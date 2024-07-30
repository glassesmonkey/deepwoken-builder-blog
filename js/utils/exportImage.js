// 确保DOM加载完成后再执行脚本
document.addEventListener('DOMContentLoaded', function() {
    // 为导出按钮添加事件监听器
    const exportButton = document.getElementById('exportImage');
    if (exportButton) {
        exportButton.addEventListener('click', exportImage);
    } else {
        console.error('Export button not found');
    }
});

async function exportImage() {
    const tabs = ['stats-tab', 'talents-tab', 'mantras-tab', 'weapons-tab', 'summary-tab'];
    const images = [];

    showLoadingIndicator();

    try {
        for (const tabId of tabs) {
            await activateTab(tabId);
            await new Promise(resolve => setTimeout(resolve, 1000)); // 增加等待时间

            const tab = document.getElementById(tabId);
            if (!tab) {
                throw new Error(`Tab content not found: ${tabId}`);
            }

            // 创建一个新的div来包含tab内容的克隆
            const containerDiv = document.createElement('div');
            containerDiv.style.position = 'absolute';
            containerDiv.style.left = '-9999px';
            containerDiv.style.top = '0';
            containerDiv.style.width = tab.offsetWidth + 'px';
            containerDiv.style.height = 'auto';
            containerDiv.appendChild(tab.cloneNode(true));
            document.body.appendChild(containerDiv);

            // 应用内联样式
            await applyInlineStyles(containerDiv);

            // 确保所有字体已加载
            await document.fonts.ready;

            // 替换select元素为自定义渲染
            replaceSelectsWithCustomRender(containerDiv);

            const canvas = await html2canvas(containerDiv, {
                logging: false,
                useCORS: true,
                scale: 2, // 提高缩放比例以获得更好的文本渲染
                width: tab.offsetWidth,
                height: containerDiv.scrollHeight,
                onclone: (clonedDoc) => {
                    const clonedElement = clonedDoc.getElementById(tabId);
                    if (clonedElement) {
                        fixInputsAndSelects(clonedElement);
                    }
                }
            });
            images.push(canvas);

            // 移除临时div
            document.body.removeChild(containerDiv);
        }

        const finalCanvas = createFinalCanvas(images);
        addWatermark(finalCanvas);
        downloadImage(finalCanvas);
    } catch (error) {
        console.error('Error exporting image:', error);
        showErrorMessage('Failed to export image. Please try again.');
    } finally {
        hideLoadingIndicator();
    }
}

// 应用内联样式
async function applyInlineStyles(element) {
    const elements = element.getElementsByTagName('*');
    for (let i = 0; i < elements.length; i++) {
        const el = elements[i];
        const style = window.getComputedStyle(el);
        el.style.cssText = style.cssText;

        // 特别处理grid布局
        if (style.display === 'grid') {
            el.style.display = 'grid';
            el.style.gridTemplateColumns = style.gridTemplateColumns;
            el.style.gridGap = style.gridGap;
        }

        // 确保input和select元素有足够的高度
        if (el.tagName === 'INPUT' || el.tagName === 'SELECT') {
            el.style.height = 'auto';
            el.style.minHeight = '30px';
        }
    }
}

// 修复input和select元素
function fixInputsAndSelects(element) {
    const inputs = element.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.style.height = 'auto';
        input.style.minHeight = '30px';
        input.style.lineHeight = '30px';
        input.style.padding = '0 8px';
        input.style.boxSizing = 'border-box';
    });
}

// 替换select元素为自定义渲染
function replaceSelectsWithCustomRender(container) {
    const selects = container.querySelectorAll('select');
    selects.forEach(select => {
        const customSelect = document.createElement('div');
        customSelect.style.cssText = window.getComputedStyle(select).cssText;
        customSelect.style.overflow = 'hidden';
        customSelect.style.minHeight = '30px';
        customSelect.style.padding = '5px';
        customSelect.style.boxSizing = 'border-box';
        customSelect.style.border = '1px solid #ccc';
        customSelect.style.borderRadius = '4px';
        customSelect.style.backgroundColor = '#1F2937';

        const selectedOption = select.options[select.selectedIndex];
        customSelect.textContent = selectedOption ? selectedOption.textContent : '';

        select.parentNode.replaceChild(customSelect, select);
    });
}


// 激活特定的tab并等待内容加载
async function activateTab(tabId) {
    return new Promise((resolve, reject) => {
        const tabButton = document.querySelector(`[data-tab="${tabId}"]`);
        if (!tabButton) {
            reject(new Error(`Tab button not found: ${tabId}`));
            return;
        }

        tabButton.click();

        const checkInterval = setInterval(() => {
            const content = document.getElementById(tabId);
            if (content && !content.classList.contains('hidden')) {
                clearInterval(checkInterval);
                resolve();
            }
        }, 100);

        // 设置超时，以防内容加载失败
        setTimeout(() => {
            clearInterval(checkInterval);
            reject(new Error(`Timeout waiting for tab content: ${tabId}`));
        }, 5000);
    });
}

// 创建最终的canvas并拼接图片
function createFinalCanvas(images) {
    const finalCanvas = document.createElement('canvas');
    const ctx = finalCanvas.getContext('2d');

    const totalHeight = images.reduce((sum, img) => sum + img.height, 0);
    const maxWidth = Math.max(...images.map(img => img.width));

    finalCanvas.width = maxWidth;
    finalCanvas.height = totalHeight;

    let yOffset = 0;
    for (const img of images) {
        ctx.drawImage(img, 0, yOffset);
        yOffset += img.height;
    }

    return finalCanvas;
}

// 添加水印
function addWatermark(canvas) {
    const ctx = canvas.getContext('2d');
    ctx.font = '20px Arial';
    ctx.fillStyle = 'rgba(128, 128, 128, 0.5)';
    ctx.fillText('deepwokenbuilder.com', 10, 30);
    ctx.fillText('deepwokenbuilder.com', canvas.width - 200, canvas.height - 10);
}

// 下载图片
function downloadImage(canvas) {
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'deepwoken_build.png';
    link.href = dataURL;
    link.click();
}

// 显示加载指示器
function showLoadingIndicator() {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading-indicator';
    loadingDiv.textContent = 'Exporting image...';
    loadingDiv.style.position = 'fixed';
    loadingDiv.style.top = '50%';
    loadingDiv.style.left = '50%';
    loadingDiv.style.transform = 'translate(-50%, -50%)';
    loadingDiv.style.padding = '20px';
    loadingDiv.style.background = 'rgba(0, 0, 0, 0.7)';
    loadingDiv.style.color = 'white';
    loadingDiv.style.borderRadius = '5px';
    loadingDiv.style.zIndex = '9999';
    document.body.appendChild(loadingDiv);
}

// 隐藏加载指示器
function hideLoadingIndicator() {
    const loadingDiv = document.getElementById('loading-indicator');
    if (loadingDiv) {
        loadingDiv.remove();
    }
}

// 显示错误消息
function showErrorMessage(message) {
    const modal = document.getElementById('custom-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');
    const modalClose = document.getElementById('modal-close');

    if (modal && modalTitle && modalContent && modalClose) {
        modalTitle.textContent = 'Error';
        modalContent.textContent = message;
        modal.classList.remove('hidden');

        modalClose.onclick = function() {
            modal.classList.add('hidden');
        };
    } else {
        alert(message);
    }
}