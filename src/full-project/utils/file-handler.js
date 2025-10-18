// 📁 File Handler
// This file handles file upload, validation, and processing

/**
 * Convert file to base64 string
 * @param {File} file - File object
 * @returns {Promise<string>} - Base64 string
 */
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/**
 * Validate uploaded file
 * @param {File} file - File object
 * @returns {Object} - Validation result
 */
function validateFile(file) {
    const result = {
        valid: true,
        errors: []
    };
    
    // Check file size
    if (file.size > APP_SETTINGS.maxFileSize) {
        result.valid = false;
        result.errors.push(ERROR_MESSAGES.fileTooLarge);
    }
    
    // Check file type
    if (!APP_SETTINGS.supportedFormats.includes(file.type)) {
        result.valid = false;
        result.errors.push(ERROR_MESSAGES.unsupportedFormat);
    }
    
    // Check if file is empty
    if (file.size === 0) {
        result.valid = false;
        result.errors.push('File is empty');
    }
    
    return result;
}

/**
 * Get file info
 * @param {File} file - File object
 * @returns {Object} - File information
 */
function getFileInfo(file) {
    return {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        sizeFormatted: formatFileSize(file.size)
    };
}

/**
 * Format file size in human readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted size
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Create file preview
 * @param {File} file - File object
 * @returns {Promise<string>} - Preview URL
 */
function createFilePreview(file) {
    return new Promise((resolve, reject) => {
        if (!file.type.startsWith('image/')) {
            reject(new Error('File is not an image'));
            return;
        }
        
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/**
 * Compress image file
 * @param {File} file - Image file
 * @param {number} quality - Compression quality (0-1)
 * @returns {Promise<File>} - Compressed file
 */
function compressImage(file, quality = 0.8) {
    return new Promise((resolve, reject) => {
        if (!file.type.startsWith('image/')) {
            reject(new Error('File is not an image'));
            return;
        }
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
            // Calculate new dimensions
            const maxWidth = 1920;
            const maxHeight = 1080;
            let { width, height } = img;
            
            if (width > maxWidth || height > maxHeight) {
                const ratio = Math.min(maxWidth / width, maxHeight / height);
                width *= ratio;
                height *= ratio;
            }
            
            canvas.width = width;
            canvas.height = height;
            
            // Draw and compress
            ctx.drawImage(img, 0, 0, width, height);
            
            canvas.toBlob(
                (blob) => {
                    const compressedFile = new File([blob], file.name, {
                        type: file.type,
                        lastModified: Date.now()
                    });
                    resolve(compressedFile);
                },
                file.type,
                quality
            );
        };
        
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
    });
}

/**
 * Handle drag and drop events
 * @param {HTMLElement} element - Drop zone element
 * @param {Function} onDrop - Drop callback
 */
function setupDragAndDrop(element, onDrop) {
    element.addEventListener('dragover', (e) => {
        e.preventDefault();
        element.classList.add('dragover');
    });
    
    element.addEventListener('dragleave', (e) => {
        e.preventDefault();
        element.classList.remove('dragover');
    });
    
    element.addEventListener('drop', (e) => {
        e.preventDefault();
        element.classList.remove('dragover');
        
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            onDrop(files[0]);
        }
    });
}

/**
 * Create file input element
 * @param {Object} options - Input options
 * @returns {HTMLInputElement} - File input element
 */
function createFileInput(options = {}) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = options.accept || 'image/*';
    input.multiple = options.multiple || false;
    input.style.display = 'none';
    
    return input;
}

/**
 * Trigger file input dialog
 * @param {HTMLInputElement} input - File input element
 */
function triggerFileInput(input) {
    input.click();
}

/**
 * Process multiple files
 * @param {FileList} files - File list
 * @param {Function} processor - File processor function
 * @returns {Promise<Array>} - Processed results
 */
async function processMultipleFiles(files, processor) {
    const results = [];
    
    for (let i = 0; i < files.length; i++) {
        try {
            const result = await processor(files[i]);
            results.push({ success: true, result, file: files[i] });
        } catch (error) {
            results.push({ success: false, error, file: files[i] });
        }
    }
    
    return results;
}

/**
 * Download file
 * @param {Blob} blob - File blob
 * @param {string} filename - Download filename
 */
function downloadFile(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Export functions for use in other files (ES module syntax)
export {
    fileToBase64,
    validateFile,
    getFileInfo,
    formatFileSize,
    createFilePreview,
    compressImage,
    setupDragAndDrop,
    createFileInput,
    triggerFileInput,
    processMultipleFiles,
    downloadFile
};
