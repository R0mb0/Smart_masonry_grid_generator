/* --- Configuration & State --- */
const ELEMENTS = {
    dropZone: document.getElementById('drop-zone'),
    fileInput: document.getElementById('file-input'),
    uploadBtn: document.getElementById('upload-btn'),
    formatSelect: document.getElementById('format-select'),
    customPanel: document.getElementById('custom-panel'),
    customWidth: document.getElementById('custom-width'),
    customHeight: document.getElementById('custom-height'),
    fileCount: document.getElementById('file-count'),
    startBtn: document.getElementById('start-btn'),
    inputSection: document.getElementById('input-section'),
    processingSection: document.getElementById('processing-section'),
    progressBar: document.getElementById('progress-bar'),
    resultSection: document.getElementById('result-section'),
    previewImage: document.getElementById('preview-image'),
    resetBtn: document.getElementById('reset-btn'),
    downloadBtn: document.getElementById('download-btn')
};

const FORMATS = {
    'a4-v': { w: 2480, h: 3508 },
    'a4-h': { w: 3508, h: 2480 },
    'a3-v': { w: 3508, h: 4960 },
    'a3-h': { w: 4960, h: 3508 },
    'a5-v': { w: 1748, h: 2480 },
    'a5-h': { w: 2480, h: 1748 }
};

let state = {
    files: [],
    finalCanvas: null
};

/* --- Event Listeners --- */
ELEMENTS.formatSelect.addEventListener('change', (e) => {
    e.target.value === 'custom' ? ELEMENTS.customPanel.classList.remove('hidden') : ELEMENTS.customPanel.classList.add('hidden');
});

ELEMENTS.dropZone.addEventListener('click', () => ELEMENTS.fileInput.click());
ELEMENTS.uploadBtn.addEventListener('click', (e) => { e.stopPropagation(); ELEMENTS.fileInput.click(); });
ELEMENTS.dropZone.addEventListener('dragover', (e) => { e.preventDefault(); ELEMENTS.dropZone.classList.add('drag-over'); });
ELEMENTS.dropZone.addEventListener('dragleave', () => ELEMENTS.dropZone.classList.remove('drag-over'));
ELEMENTS.dropZone.addEventListener('drop', (e) => {
    e.preventDefault(); ELEMENTS.dropZone.classList.remove('drag-over'); handleFiles(e.dataTransfer.files);
});
ELEMENTS.fileInput.addEventListener('change', (e) => handleFiles(e.target.files));

ELEMENTS.startBtn.addEventListener('click', startProcessing);
ELEMENTS.resetBtn.addEventListener('click', resetApp);
ELEMENTS.downloadBtn.addEventListener('click', downloadImage);

/* --- Core Logic --- */
function handleFiles(fileList) {
    const validFiles = Array.from(fileList).filter(file => file.type.startsWith('image/'));
    if (validFiles.length > 0) {
        state.files = [...state.files, ...validFiles];
        updateUIState();
    } else {
        alert("Please select valid image files.");
    }
}

function updateUIState() {
    if (state.files.length > 0) {
        ELEMENTS.fileCount.textContent = `${state.files.length} images selected`;
        ELEMENTS.fileCount.classList.remove('hidden');
        ELEMENTS.startBtn.classList.remove('hidden');
    }
}

function resetApp() {
    state.files = [];
    state.finalCanvas = null;
    ELEMENTS.fileInput.value = '';
    ELEMENTS.resultSection.classList.add('hidden');
    ELEMENTS.processingSection.classList.add('hidden');
    ELEMENTS.inputSection.classList.remove('hidden');
    ELEMENTS.fileCount.classList.add('hidden');
    ELEMENTS.startBtn.classList.add('hidden');
}

async function startProcessing() {
    ELEMENTS.inputSection.classList.add('hidden');
    ELEMENTS.processingSection.classList.remove('hidden');
    ELEMENTS.progressBar.style.width = '10%';

    // 1. Get Target Dimensions
    let targetW, targetH;
    const format = ELEMENTS.formatSelect.value;
    if (format === 'custom') {
        targetW = parseInt(ELEMENTS.customWidth.value) || 1920;
        targetH = parseInt(ELEMENTS.customHeight.value) || 1080;
    } else {
        targetW = FORMATS[format].w;
        targetH = FORMATS[format].h;
    }

    try {
        // 2. Load Images
        const loadedImages = await loadImages(state.files);
        ELEMENTS.progressBar.style.width = '30%';

        const avgColor = calculateGlobalAverageColor(loadedImages);
        ELEMENTS.progressBar.style.width = '40%';

        // 3. OPTIMIZED LAYOUT ALGORITHM
        // We find the layout that best fills the Target Height when Width is fixed to Target Width
        const layoutData = calculateOptimalLayout(loadedImages, targetW, targetH);
        ELEMENTS.progressBar.style.width = '80%';

        // 4. Draw Final
        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');

        // Fill Background
        ctx.fillStyle = avgColor;
        ctx.fillRect(0, 0, targetW, targetH);

        // 5. Draw images centered vertically if there's a tiny gap
        // Since we optimized for height, the scale is 1:1 with the container width
        const totalContentHeight = layoutData.totalHeight;
        const offsetY = (targetH - totalContentHeight) / 2;

        layoutData.items.forEach(item => {
            // Check if item coordinates are within reason (avoid potential negative float rounding)
            const drawX = Math.floor(item.x);
            const drawY = Math.floor(item.y + offsetY);
            const drawW = Math.ceil(item.w); // Ceil to avoid sub-pixel gaps
            const drawH = Math.ceil(item.h);

            ctx.drawImage(item.img, drawX, drawY, drawW, drawH);
        });

        state.finalCanvas = canvas;
        ELEMENTS.previewImage.src = canvas.toDataURL('image/png');
        ELEMENTS.progressBar.style.width = '100%';
        
        setTimeout(() => {
            ELEMENTS.processingSection.classList.add('hidden');
            ELEMENTS.resultSection.classList.remove('hidden');
        }, 500);

    } catch (err) {
        console.error(err);
        alert("An error occurred during generation.");
        resetApp();
    }
}

/* --- Helpers --- */
function loadImages(files) {
    return Promise.all(files.map(file => new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
    })));
}

function calculateGlobalAverageColor(images) {
    if (images.length === 0) return '#ffffff';
    let r=0, g=0, b=0, count = Math.min(images.length, 5);
    const c = document.createElement('canvas'); c.width = 1; c.height = 1;
    const ctx = c.getContext('2d');
    for(let i=0; i<count; i++) {
        ctx.drawImage(images[i], 0, 0, 1, 1);
        const d = ctx.getImageData(0,0,1,1).data;
        r+=d[0]; g+=d[1]; b+=d[2];
    }
    return `rgb(${Math.round(r/count)}, ${Math.round(g/count)}, ${Math.round(b/count)})`;
}

function downloadImage() {
    if (!state.finalCanvas) return;
    const link = document.createElement('a');
    link.download = 'masonry-grid.png';
    link.href = state.finalCanvas.toDataURL('image/png');
    link.click();
}

/* --- NEW ALGORITHM: Area Coverage Optimizer --- */

function calculateOptimalLayout(images, containerW, containerH) {
    // Prepare items with aspect ratios
    const items = images.map(img => ({
        img: img,
        aspect: img.width / img.height
    }));

    // We scan a range of possible "Row Heights" to see which one produces
    // a total grid height closest to the container Height.
    // The width is FIXED to containerW.
    
    let bestLayout = null;
    let minDiff = Infinity;

    // Scan parameters
    // We try row heights from very small (many rows) to very large (few rows)
    const minRowHeight = containerH / 20; // At least 20 rows
    const maxRowHeight = containerH / 2;  // At most 2 rows
    const scanSteps = 100; // How many variations to test

    for (let i = 0; i <= scanSteps; i++) {
        const testRowHeight = minRowHeight + (i * (maxRowHeight - minRowHeight) / scanSteps);
        
        // Generate a layout for this specific row height fixed to containerW
        const layout = generateLayoutFixedW(items, containerW, testRowHeight);
        
        // How far is the resulting total height from the target height?
        const diff = Math.abs(layout.totalHeight - containerH);
        
        if (diff < minDiff) {
            minDiff = diff;
            bestLayout = layout;
        }
    }

    return bestLayout;
}

function generateLayoutFixedW(items, containerW, targetRowHeight) {
    let rows = [];
    let currentRow = [];
    let currentAspectRatioSum = 0;
    
    // 1. Group items into rows
    items.forEach(item => {
        currentRow.push(item);
        currentAspectRatioSum += item.aspect;

        // If this row, scaled to targetRowHeight, exceeds container Width?
        // Wait, standard justified logic:
        // Width = Height * AspectSum.
        // We want Width = containerW.
        // So ResultingHeight = containerW / AspectSum.
        // We accumulate until ResultingHeight is close to targetRowHeight? 
        // No, usually we accumulate until Width (at targetHeight) > containerWidth.
        
        const currentWidthAtTargetH = currentAspectRatioSum * targetRowHeight;
        
        if (currentWidthAtTargetH >= containerW) {
            rows.push({ items: [...currentRow], aspectSum: currentAspectRatioSum });
            currentRow = [];
            currentAspectRatioSum = 0;
        }
    });

    // Handle orphans (last row)
    if (currentRow.length > 0) {
        rows.push({ items: [...currentRow], aspectSum: currentAspectRatioSum, isLast: true });
    }

    // 2. Calculate coordinates
    let currentY = 0;
    let finalItems = [];

    rows.forEach(row => {
        // Force this row to fill containerW exactly
        // H = W / AspectSum
        let rowHeight = containerW / row.aspectSum;
        
        // SPECIAL HANDLING FOR LAST ROW:
        // If the last row has very few items, standard justification makes them HUGE.
        // If rowHeight is > 1.5x the target, it looks ugly.
        let offsetX = 0;
        
        if (row.isLast) {
            // If the calculated height is insane (giant images), cap it using the previous row's height 
            // or the target height, and center the content.
            if (rowHeight > targetRowHeight * 1.5) {
                rowHeight = targetRowHeight;
                // Recalculate width for this clamped height
                const actualRowWidth = rowHeight * row.aspectSum;
                // Center the items in the container
                offsetX = (containerW - actualRowWidth) / 2;
            }
        }

        let currentX = offsetX;
        
        row.items.forEach(item => {
            const itemW = rowHeight * item.aspect;
            finalItems.push({
                img: item.img,
                x: currentX,
                y: currentY,
                w: itemW,
                h: rowHeight
            });
            currentX += itemW;
        });

        currentY += rowHeight;
    });

    return {
        items: finalItems,
        totalHeight: currentY
    };
}