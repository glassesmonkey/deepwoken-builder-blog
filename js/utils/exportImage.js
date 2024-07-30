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

// 主要的导出图片函数
async function exportImage() {
    const tabs = ['stats-tab', 'talents-tab', 'mantras-tab', 'weapons-tab', 'summary-tab'];
    const images = [];

    showLoadingIndicator();

    try {
        for (const tabId of tabs) {
            await activateTab(tabId);
            await new Promise(resolve => setTimeout(resolve, 500)); // 等待渲染完成

            const tab = document.getElementById(tabId);
            if (!tab) {
                throw new Error(`Tab content not found: ${tabId}`);
            }

            const canvas = await html2canvas(tab, {
                logging: false,
                useCORS: true,
                scale: 2 // 提高图片质量
            });
            images.push(canvas);
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