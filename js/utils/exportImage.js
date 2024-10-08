document.addEventListener('DOMContentLoaded', function () {
    const exportButton = document.getElementById('exportImage');
    const exportImageMobileBtn = document.getElementById('exportImageMobile');
    if (exportButton) {
        exportButton.addEventListener('click', showExportModal);
    } else {
        console.error('Export button not found');
    }
    if (exportImageMobileBtn) {
        exportImageMobileBtn.addEventListener('click', showExportModal);
    } else {
        console.error('Export button not found');
    }
});

function showExportModal() {
    const modal = document.createElement('div');
    modal.id = 'export-modal';
    modal.classList.add('fixed', 'inset-0', 'bg-gray-600', 'bg-opacity-50', 'overflow-y-auto', 'h-full', 'w-full', 'flex', 'items-center', 'justify-center');
    
    const modalContent = document.createElement('div');
    modalContent.classList.add('bg-white', 'p-5', 'border', 'w-96', 'shadow-lg', 'rounded-md');
    
    const title = document.createElement('h3');
    title.classList.add('text-lg', 'font-medium', 'leading-6', 'text-gray-900', 'mb-2');
    title.textContent = 'Select which tabs to export';
    
    const checkboxContainer = document.createElement('div');
    checkboxContainer.id = 'tab-checkboxes';
    checkboxContainer.classList.add('mb-4');
    
    const tabs = ['stats-tab', 'weapons-tab','talents-tab', 'mantras-tab',  'summary-tab'];
    tabs.forEach(tab => {
        const label = document.createElement('label');
        label.classList.add('block', 'mb-2');
        label.innerHTML = `
            <input type="checkbox" name="export-tabs" value="${tab}" checked>
            ${tab.replace('-tab', '').charAt(0).toUpperCase() + tab.replace('-tab', '').slice(1)}
        `;
        checkboxContainer.appendChild(label);
    });
    
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('flex', 'justify-end');
    
    const cancelButton = document.createElement('button');
    cancelButton.id = 'export-cancel';
    cancelButton.classList.add('px-4', 'py-2', 'bg-gray-300', 'text-black', 'rounded', 'mr-2');
    cancelButton.textContent = 'Cancel';
    cancelButton.addEventListener('click', hideExportModal);
    
    const confirmButton = document.createElement('button');
    confirmButton.id = 'export-confirm';
    confirmButton.classList.add('px-4', 'py-2', 'bg-blue-500', 'text-white', 'rounded');
    confirmButton.textContent = 'Export';
    confirmButton.addEventListener('click', handleExport);
    
    buttonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(confirmButton);
    
    modalContent.appendChild(title);
    modalContent.appendChild(checkboxContainer);
    modalContent.appendChild(buttonContainer);
    modal.appendChild(modalContent);
    
    document.body.appendChild(modal);
}

function hideExportModal() {
    const modal = document.getElementById('export-modal');
    if (modal) {
        modal.remove();
    }
}

async function handleExport() {
    const selectedTabs = Array.from(document.querySelectorAll('input[name="export-tabs"]:checked'))
        .map(checkbox => checkbox.value);
    
    hideExportModal();
    await exportImage(selectedTabs);
}

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

async function exportImage(selectedTabs) {
    const script = document.createElement('script');
    script.src = 'https://html2canvas.hertzen.com/dist/html2canvas.min.js';
    document.head.appendChild(script);
    await new Promise(resolve => script.onload = resolve);
    const images = [];

    const overlay = createOverlay();
    document.body.appendChild(overlay);

    try {
        for (let i = 0; i < selectedTabs.length; i++) {
            const tabId = selectedTabs[i];
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
                const chartCanvas = containerDiv.querySelector('#damageChart');
                if (chartCanvas) {
                    window.triggerDamageCalculation();
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    await handleChart(containerDiv);
                } else {
                    console.log('Chart canvas not found in weapons tab, skipping chart handling');
                }
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

            updateProgress((i + 1) / selectedTabs.length * 100);
        }

        const finalCanvas = createFinalCanvas(images);
        await addWatermark(finalCanvas);
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
    if (typeof Chart !== 'undefined' && originalCanvas && clonedCanvasContainer) {
        const originalChart = Chart.getChart(originalCanvas);

        if (originalChart) {
            originalChart.options.scales.x.ticks.font = {
                family: 'Arial, sans-serif',
                size: 12,
                weight: 'bold'
            };
            originalChart.options.scales.x.ticks.color = 'white';

            originalChart.options.layout.padding.bottom = 30;

            originalChart.update();

            await new Promise(resolve => setTimeout(resolve, 1000));

            const chartImage = new Image();
            chartImage.src = originalCanvas.toDataURL();

            await new Promise((resolve, reject) => {
                chartImage.onload = resolve;
                chartImage.onerror = reject;
            });

            const chartContainer = document.createElement('div');
            chartContainer.style.position = 'relative';
            chartContainer.style.width = '100%';
            chartContainer.style.paddingBottom = '50px';
            chartContainer.appendChild(chartImage);

            const labels = originalChart.data.labels;
            const labelsContainer = document.createElement('div');
            labelsContainer.style.display = 'flex';
            labelsContainer.style.justifyContent = 'space-between';
            labelsContainer.style.width = '100%';
            labelsContainer.style.position = 'absolute';
            labelsContainer.style.bottom = '0';
            labelsContainer.style.left = '0';
            labelsContainer.style.padding = '0 10px';

            labels.forEach(label => {
                const labelElement = document.createElement('span');
                labelElement.textContent = label;
                labelElement.style.color = 'white';
                labelElement.style.fontSize = '10px';
                labelElement.style.textAlign = 'center';
                labelElement.style.width = `${100 / labels.length}%`;
                labelsContainer.appendChild(labelElement);
            });

            chartContainer.appendChild(labelsContainer);

            clonedCanvasContainer.innerHTML = '';
            clonedCanvasContainer.appendChild(chartContainer);
        }
    } else {
        console.log('Chart or canvas not available, skipping chart handling');
    }
}

async function applyInlineStyles(element) {
    const elements = element.getElementsByTagName('*');
    for (let i = 0; i < elements.length; i++) {
        const el = elements[i];
        const style = window.getComputedStyle(el);
        el.style.cssText = style.cssText;

        if (style.display === 'grid') {
            el.style.display = 'grid';
            el.style.gridTemplateColumns = style.gridTemplateColumns;
            el.style.gridGap = style.gridGap;
        }

        if (el.tagName === 'INPUT' || el.tagName === 'SELECT') {
            el.style.height = 'auto';
            el.style.minHeight = '30px';
        }

        if (el.tagName.toLowerCase() === 'canvas') {
            el.style.width = style.width;
            el.style.height = style.height;
        }
    }
}

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

        setTimeout(() => {
            clearInterval(checkInterval);
            reject(new Error(`Timeout waiting for tab content: ${tabId}`));
        }, 5000);
    });
}

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

async function addWatermark(canvas) {
    const ctx = canvas.getContext('2d');
    const watermarkPath = "assets/images/DeepwokenBuilder-yellow.png";

    try {
        console.log('Loading watermark image from:', watermarkPath);
        const watermarkImage = await loadWatermarkImage(watermarkPath);
        console.log('Watermark image loaded successfully');

        const watermarkWidth = canvas.width * 0.2;
        const watermarkHeight = (watermarkImage.height / watermarkImage.width) * watermarkWidth;

        console.log('Drawing watermark, canvas dimensions:', canvas.width, canvas.height);
        console.log('Watermark dimensions:', watermarkWidth, watermarkHeight);

        ctx.globalAlpha = 0.5;
        ctx.drawImage(watermarkImage, 10, 10, watermarkWidth, watermarkHeight);

        ctx.drawImage(watermarkImage, canvas.width - watermarkWidth - 10,
            canvas.height - watermarkHeight - 10, watermarkWidth, watermarkHeight);

        ctx.globalAlpha = 1.0;
        console.log('Watermark added successfully');
    } catch (error) {
        console.error('Error adding watermark:', error);

        ctx.font = '20px Arial';
        ctx.fillStyle = 'rgba(128, 128, 128, 0.5)';
        ctx.fillText('deepwokenbuilder.com', 10, 30);
        ctx.fillText('deepwokenbuilder.com', canvas.width - 200, canvas.height - 10);
    }
}

function loadWatermarkImage(imagePath) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = (e) => {
            console.error('Error loading watermark image:', e);
            reject(new Error('Failed to load watermark image'));
        };
        img.crossOrigin = 'anonymous';
        img.src = imagePath;
    });
}

function downloadImage(canvas) {
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'deepwoken_build.png';
    link.href = dataURL;
    link.click();
}

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

function hideLoadingIndicator() {
    const loadingDiv = document.getElementById('loading-indicator');
    if (loadingDiv) {
        loadingDiv.remove();
    }
}

function showErrorMessage(message) {
    const modal = document.getElementById('custom-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');
    const modalClose = document.getElementById('modal-close');

    if (modal && modalTitle && modalContent && modalClose) {
        modalTitle.textContent = 'Error';
        modalContent.textContent = message;
        modal.classList.remove('hidden');

        modalClose.onclick = function () {
            modal.classList.add('hidden');
        };
    } else {
        alert(message);
    }
}