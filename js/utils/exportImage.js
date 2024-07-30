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



function createOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'export-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.backdropFilter = 'blur(5px)';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '9999';

    const progressContainer = document.createElement('div');
    progressContainer.style.width = '300px';
    progressContainer.style.backgroundColor = '#fff';
    progressContainer.style.borderRadius = '10px';
    progressContainer.style.padding = '20px';
    progressContainer.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';

    const progressText = document.createElement('div');
    progressText.id = 'progress-text';
    progressText.textContent = 'Exporting image: 0%';
    progressText.style.marginBottom = '10px';
    progressText.style.textAlign = 'center';
    progressText.style.color = '#333';

    const progressBar = document.createElement('div');
    progressBar.style.width = '100%';
    progressBar.style.backgroundColor = '#e0e0e0';
    progressBar.style.borderRadius = '5px';
    progressBar.style.overflow = 'hidden';

    const progressBarInner = document.createElement('div');
    progressBarInner.id = 'progress-bar-inner';
    progressBarInner.style.width = '0%';
    progressBarInner.style.height = '20px';
    progressBarInner.style.backgroundColor = '#4CAF50';
    progressBarInner.style.transition = 'width 0.3s ease-in-out';

    progressBar.appendChild(progressBarInner);
    progressContainer.appendChild(progressText);
    progressContainer.appendChild(progressBar);
    overlay.appendChild(progressContainer);

    return overlay;
}

function updateProgress(progress) {
    const progressText = document.getElementById('progress-text');
    const progressBarInner = document.getElementById('progress-bar-inner');
    if (progressText && progressBarInner) {
        progressText.textContent = `Exporting image: ${Math.round(progress)}%`;
        progressBarInner.style.width = `${progress}%`;
    }
}
function downloadImage(canvas) {
    updateProgress(100);
    setTimeout(() => {
        const dataURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'deepwoken_build.png';
        link.href = dataURL;
        link.click();
    }, 500);
}

async function exportImage() {
    const tabs = ['stats-tab', 'talents-tab', 'mantras-tab', 'weapons-tab', 'summary-tab'];
    const images = [];

    const overlay = createOverlay();
    document.body.appendChild(overlay);

    try {
        for (let i = 0; i < tabs.length; i++) {
            const tabId = tabs[i];
            await activateTab(tabId);
            await new Promise(resolve => setTimeout(resolve, 1000));

            const tab = document.getElementById(tabId);
            if (!tab) {
                throw new Error(`Tab content not found: ${tabId}`);
            }

            const containerDiv = document.createElement('div');
            containerDiv.style.position = 'absolute';
            containerDiv.style.left = '-9999px';
            containerDiv.style.top = '0';
            containerDiv.style.width = '1000px';
            containerDiv.style.height = 'auto';
            containerDiv.appendChild(tab.cloneNode(true));
            document.body.appendChild(containerDiv);

            await applyInlineStyles(containerDiv);

            if (tabId === 'weapons-tab') {
                window.triggerDamageCalculation();
                await new Promise(resolve => setTimeout(resolve, 1000));
                await handleChart(containerDiv);
            }

            await document.fonts.ready;
            replaceSelectsWithCustomRender(containerDiv);
            const canvas = await html2canvas(containerDiv, {
                logging: false,
                useCORS: true,
                scale: 2,
                width: 1000,
                height: containerDiv.scrollHeight,
                backgroundColor: null,
				onclone: (clonedDoc) => {
                    const clonedElement = clonedDoc.getElementById(tabId);
                    if (clonedElement) {
                        fixInputsAndSelects(clonedElement);
                    }
                }
            });
            images.push(canvas);

            document.body.removeChild(containerDiv);

            // 更新进度
            updateProgress((i + 1) / tabs.length * 100);
        }

        const finalCanvas = createFinalCanvas(images);
        addWatermark(finalCanvas);
        downloadImage(finalCanvas);
    } catch (error) {
        console.error('Error exporting image:', error);
        showErrorMessage('Failed to export image. Please try again.');
    } finally {
        document.body.removeChild(overlay);
    }
}

async function handleChart(containerDiv) {
    const originalCanvas = document.getElementById('damageChart');
    const clonedCanvasContainer = containerDiv.querySelector('#damageChart').parentNode;

    if (originalCanvas && clonedCanvasContainer) {
        const originalChart = Chart.getChart(originalCanvas);
        
        if (originalChart) {
            // 调整图表配置
            originalChart.options.scales.x.ticks.font = {
                family: 'Arial, sans-serif',
                size: 12,  // 减小字体大小
                weight: 'bold'
            };
            originalChart.options.scales.x.ticks.color = 'white';
            
            // 增加底部边距以为标签留出空间
            originalChart.options.layout.padding.bottom = 30;
            
            // 更新图表
            originalChart.update();
            
            // 等待渲染完成
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // 将原始图表转换为图像
            const chartImage = new Image();
            chartImage.src = originalCanvas.toDataURL();
            
            await new Promise((resolve, reject) => {
                chartImage.onload = resolve;
                chartImage.onerror = reject;
            });

            // 创建图表容器
            const chartContainer = document.createElement('div');
            chartContainer.style.position = 'relative';
            chartContainer.style.width = '100%';
            chartContainer.style.paddingBottom = '50px';  // 增加底部padding
            chartContainer.appendChild(chartImage);

            // 添加x轴标签
            const labels = originalChart.data.labels;
            const labelsContainer = document.createElement('div');
            labelsContainer.style.display = 'flex';
            labelsContainer.style.justifyContent = 'space-between';
            labelsContainer.style.width = '100%';
            labelsContainer.style.position = 'absolute';
            labelsContainer.style.bottom = '0';
            labelsContainer.style.left = '0';
            labelsContainer.style.padding = '0 10px';  // 添加左右padding

            labels.forEach(label => {
                const labelElement = document.createElement('span');
                labelElement.textContent = label;
                labelElement.style.color = 'white';
                labelElement.style.fontSize = '10px';  // 进一步减小字体大小
                labelElement.style.textAlign = 'center';
                labelElement.style.width = `${100 / labels.length}%`;
                labelsContainer.appendChild(labelElement);
            });

            chartContainer.appendChild(labelsContainer);

            // 替换克隆的canvas
            clonedCanvasContainer.innerHTML = '';
            clonedCanvasContainer.appendChild(chartContainer);
        }
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

        // 确保canvas元素有正确的尺寸
        if (el.tagName.toLowerCase() === 'canvas') {
            el.style.width = style.width;
            el.style.height = style.height;
        }
    }
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