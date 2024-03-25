const fileInput = document.getElementById('fileInput');
const compressionRange = document.getElementById('compressionRange');
const compressionValue = document.getElementById('compressionValue');
const imagePreview = document.getElementById('imagePreview');
const downloadBtn = document.getElementById('downloadBtn');
const estimatedSizeKB = document.getElementById('sizeValueKB');
const estimatedSizeMB = document.getElementById('sizeValueMB');
const actualSizeKB = document.getElementById('actualSizeValueKB');
const actualSizeMB = document.getElementById('actualSizeValueMB');

fileInput.addEventListener('change', function() {
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            downloadBtn.style.display = 'none';
            updateEstimatedSize(file.size, compressionRange.value);
            updateActualSize(file.size);
        };
        reader.readAsDataURL(file);
    }
});

compressionRange.addEventListener('input', function() {
    const compressionLevel = compressionRange.value;
    compressionValue.textContent = `Compression Level: ${compressionLevel}%`;
    const currentImageSrc = imagePreview.src;
    if (currentImageSrc) {
        updateEstimatedSize(fileInput.files[0].size, compressionLevel);
        compressImage(currentImageSrc, compressionLevel);
    }
});

function updateEstimatedSize(originalSize, compressionLevel) {
    const compressedSizeBytes = Math.round(originalSize * (compressionLevel / 100));
    const compressedSizeKB = bytesToKB(compressedSizeBytes);
    const compressedSizeMB = bytesToMB(compressedSizeBytes);
    estimatedSizeKB.textContent = `${compressedSizeKB.toFixed(2)}`;
    estimatedSizeMB.textContent = `${compressedSizeMB.toFixed(2)}`;
}

function updateActualSize(originalSize) {
    const actualSizeKB = bytesToKB(originalSize);
    const actualSizeMB = bytesToMB(originalSize);
    actualSizeValueKB.textContent = `${actualSizeKB.toFixed(2)}`;
    actualSizeValueMB.textContent = `${actualSizeMB.toFixed(2)}`;
}

function bytesToKB(bytes) {
    return bytes / 1024;
}

function bytesToMB(bytes) {
    return bytes / (1024 * 1024);
}

function compressImage(src, quality) {
    const image = new Image();
    image.src = src;
    image.onload = function() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);
        const compressedSrc = canvas.toDataURL('image/jpeg', quality / 100);
        downloadBtn.style.display = 'block';
        downloadBtn.onclick = function() {
            const a = document.createElement('a');
            a.href = compressedSrc;
            a.download = 'compressed_image.jpg';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        };
        imagePreview.src = compressedSrc;
    };
}
