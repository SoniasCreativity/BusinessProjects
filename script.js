// DOM Elements
const layoutButtons = document.querySelectorAll('.layout-btn');
const imageInput = document.getElementById('image-input');
const uploadedImagesContainer = document.getElementById('uploaded-images');
const rotationSlider = document.getElementById('rotation');
const rotationValue = document.getElementById('rotation-value');
const spacingSlider = document.getElementById('spacing');
const spacingValue = document.getElementById('spacing-value');
const previewBtn = document.getElementById('preview-btn');
const downloadBtn = document.getElementById('download-btn');
const resetBtn = document.getElementById('reset-btn');
const previewCanvas = document.getElementById('preview-canvas');
const statusMessage = document.getElementById('status-message');

// State
let currentLayout = 'vinyl-lp';
let uploadedImages = {};

// Event Listeners
layoutButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        layoutButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentLayout = btn.dataset.layout;
        showMessage('Layout changed to: ' + btn.querySelector('.btn-text').textContent, 'info');
        generatePreview();
    });
});

imageInput.addEventListener('change', handleImageUpload);
rotationSlider.addEventListener('input', (e) => {
    rotationValue.textContent = e.target.value + '°';
    generatePreview();
});
spacingSlider.addEventListener('input', (e) => {
    spacingValue.textContent = e.target.value + '%';
    generatePreview();
});
previewBtn.addEventListener('click', generatePreview);
downloadBtn.addEventListener('click', downloadComposition);
resetBtn.addEventListener('click', resetForm);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    layoutButtons[0].classList.add('active');
});

/**
 * Handle image upload
 */
function handleImageUpload(e) {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    files.forEach(file => {
        if (!file.type.startsWith('image/')) {
            showMessage('Please upload valid image files', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (event) => {
            const fileName = file.name.toLowerCase();
            const img = new Image();
            img.onload = () => {
                uploadedImages[fileName] = {
                    src: event.target.result,
                    img: img,
                    name: file.name
                };
                displayUploadedImages();
                generatePreview();
                showMessage('Image uploaded: ' + file.name, 'success');
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });
}

/**
 * Display uploaded images
 */
function displayUploadedImages() {
    uploadedImagesContainer.innerHTML = '';
    
    Object.entries(uploadedImages).forEach(([key, imageData]) => {
        const div = document.createElement('div');
        div.className = 'image-item';
        div.innerHTML = `
            <span class="image-item-name">${imageData.name}</span>
            <button class="image-item-remove" data-filename="${key}">Remove</button>
        `;
        uploadedImagesContainer.appendChild(div);
    });
    
    document.querySelectorAll('.image-item-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const filename = e.target.dataset.filename;
            delete uploadedImages[filename];
            displayUploadedImages();
            generatePreview();
        });
    });
}

/**
 * Classify images by filename
 */
function classifyImages() {
    const classified = {
        front: null,
        back: null,
        generic: null
    };
    
    Object.entries(uploadedImages).forEach(([key, imageData]) => {
        const nameLower = key.toLowerCase();
        if (nameLower.includes('front')) {
            classified.front = imageData.img;
        } else if (nameLower.includes('back')) {
            classified.back = imageData.img;
        } else {
            classified.generic = imageData.img;
        }
    });
    
    return classified;
}

/**
 * Remove background from image (simplified - returns canvas with image)
 */
function removeBackground(img, canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    // In production, use a library like remove.bg API or TensorFlow.js
    return canvas;
}

/**
 * Crop image edges
 */
function cropImage(img, canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    // Simplified crop - in production, detect actual content boundaries
    return canvas;
}

/**
 * Generate preview based on layout
 */
function generatePreview() {
    const rotation = parseInt(rotationSlider.value);
    const spacing = parseInt(spacingSlider.value) / 100;
    
    const classified = classifyImages();
    
    if (!classified.front && !classified.back && !classified.generic) {
        showMessage('Please upload images first', 'error');
        return;
    }
    
    // Create canvas with white background
    const canvas = document.createElement('canvas');
    const ctx = previewCanvas.getContext('2d');
    
    switch (currentLayout) {
        case 'vinyl-lp':
            generateVinylLP(previewCanvas, classified, rotation, spacing);
            break;
        case 'vinyl-ep':
            generateVinylEP(previewCanvas, classified, rotation, spacing);
            break;
        case 'cd':
            generateCD(previewCanvas, classified, rotation, spacing);
            break;
        case 'cassette':
            generateCassette(previewCanvas, classified, rotation, spacing);
            break;
        case 'books':
            generateBooks(previewCanvas, classified, rotation, spacing);
            break;
    }
    
    showMessage('Preview generated', 'success');
}

/**
 * Vinyl LP Layout: Top center (large), bottom left/right with 20% overlap
 */
function generateVinylLP(canvas, images, rotation, spacing) {
    const canvasWidth = 1200;
    const canvasHeight = 1400;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    const topSize = 600;
    const bottomSize = 400;
    const overlap = bottomSize * 0.2;
    
    // Top center - front image (slightly larger)
    if (images.front) {
        const x = (canvasWidth - topSize) / 2;
        const y = 50;
        drawImageRotated(ctx, images.front, x, y, topSize, topSize, rotation);
    }
    
    // Bottom left - back image
    if (images.back) {
        const x = 100 - (spacing * 50);
        const y = canvasHeight - bottomSize - 50 + overlap;
        drawImageRotated(ctx, images.back, x, y, bottomSize, bottomSize, rotation);
    }
    
    // Bottom right - generic image (behind bottom left)
    if (images.generic) {
        const x = canvasWidth - bottomSize - 100 + (spacing * 50);
        const y = canvasHeight - bottomSize - 50;
        drawImageRotated(ctx, images.generic, x, y, bottomSize, bottomSize, rotation);
    }
}

/**
 * Vinyl EP Layout: Bottom center (front), top center (generic/back)
 */
function generateVinylEP(canvas, images, rotation, spacing) {
    const canvasWidth = 1000;
    const canvasHeight = 1200;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    const size = 500;
    
    // Top center - generic/back image (in back)
    if (images.generic || images.back) {
        const img = images.generic || images.back;
        const x = (canvasWidth - size) / 2 + (spacing * 30);
        const y = 50;
        drawImageRotated(ctx, img, x, y, size, size, rotation);
    }
    
    // Bottom center - front image (on top)
    if (images.front) {
        const x = (canvasWidth - size) / 2 - (spacing * 30);
        const y = canvasHeight - size - 50;
        drawImageRotated(ctx, images.front, x, y, size, size, rotation);
    }
}

/**
 * CD Layout: Top left/right (pair), bottom center (overlay with 20% overlap)
 */
function generateCD(canvas, images, rotation, spacing) {
    const canvasWidth = 1200;
    const canvasHeight = 1000;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    const topSize = 400;
    const bottomSize = 500;
    const overlap = bottomSize * 0.2;
    const gap = 60 - (spacing * 40);
    
    // Top left - front image
    if (images.front) {
        const x = (canvasWidth / 2 - topSize) / 2 - gap / 2;
        const y = 50;
        drawImageRotated(ctx, images.front, x, y, topSize, topSize, rotation);
    }
    
    // Top right - back image
    if (images.back) {
        const x = canvasWidth / 2 + (canvasWidth / 2 - topSize) / 2 + gap / 2;
        const y = 50;
        drawImageRotated(ctx, images.back, x, y, topSize, topSize, rotation);
    }
    
    // Bottom center - generic image (on top, overlapping)
    if (images.generic) {
        const x = (canvasWidth - bottomSize) / 2;
        const y = 50 + topSize - overlap;
        drawImageRotated(ctx, images.generic, x, y, bottomSize, bottomSize, rotation);
    }
}

/**
 * Cassette Tape Layout: Center left (front), center right (generic with ribbon)
 */
function generateCassette(canvas, images, rotation, spacing) {
    const canvasWidth = 1000;
    const canvasHeight = 800;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    const size = 400;
    const gap = 100 + (spacing * 50);
    
    // Center left - front image
    if (images.front) {
        const x = (canvasWidth / 2 - size) / 2 - gap / 2;
        const y = (canvasHeight - size) / 2;
        drawImageRotated(ctx, images.front, x, y, size, size, rotation);
    }
    
    // Center right - generic image
    if (images.generic) {
        const x = canvasWidth / 2 + (canvasWidth / 2 - size) / 2 + gap / 2;
        const y = (canvasHeight - size) / 2;
        drawImageRotated(ctx, images.generic, x, y, size, size, rotation);
        
        // Draw ribbon edge at bottom
        ctx.fillStyle = '#c0c0c0';
        ctx.fillRect(x, y + size - 30, size, 30);
    }
}

/**
 * Books Layout: Top left (front), bottom right (back) with front in front
 */
function generateBooks(canvas, images, rotation, spacing) {
    const canvasWidth = 1000;
    const canvasHeight = 1200;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    const size = 500;
    const offset = 100 + (spacing * 50);
    
    // Bottom right - back image (drawn first, so it's behind)
    if (images.back) {
        const x = canvasWidth - size - 50 - offset;
        const y = canvasHeight - size - 50;
        drawImageRotated(ctx, images.back, x, y, size, size, rotation);
    }
    
    // Top left - front image (drawn last, so it's in front)
    if (images.front) {
        const x = 50 + offset;
        const y = 50;
        drawImageRotated(ctx, images.front, x, y, size, size, rotation);
    }
}

/**
 * Draw image with rotation
 */
function drawImageRotated(ctx, img, x, y, width, height, rotation) {
    ctx.save();
    ctx.translate(x + width / 2, y + height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.drawImage(img, -width / 2, -height / 2, width, height);
    ctx.restore();
}

/**
 * Download composition as JPG
 */
function downloadComposition() {
    if (previewCanvas.width === 0) {
        showMessage('Please generate a preview first', 'error');
        return;
    }
    
    previewCanvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `product-layout-${currentLayout}-${Date.now()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        showMessage('Image downloaded as JPG', 'success');
    }, 'image/jpeg', 0.95);
}

/**
 * Reset form
 */
function resetForm() {
    uploadedImages = {};
    imageInput.value = '';
    rotationSlider.value = 0;
    spacingSlider.value = 0;
    rotationValue.textContent = '0°';
    spacingValue.textContent = '0%';
    uploadedImagesContainer.innerHTML = '';
    previewCanvas.width = 0;
    previewCanvas.height = 0;
    showMessage('Form reset', 'info');
}

/**
 * Show status message
 */
function showMessage(text, type) {
    statusMessage.textContent = text;
    statusMessage.className = 'status-message ' + type;
    
    setTimeout(() => {
        statusMessage.textContent = '';
        statusMessage.className = 'status-message';
    }, 4000);
}

console.log('Product Image Layout Composer initialized successfully!');
