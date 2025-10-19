// 📁 Upload Area Component
// This file handles the file upload area component

class UploadArea {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            accept: 'image/*',
            multiple: false,
            maxSize: 10 * 1024 * 1024, // 10MB
            onFileSelect: null,
            onError: null,
            ...options
        };
        
        this.isDragOver = false;
        this.init();
    }
    
    /**
     * Initialize upload area
     */
    init() {
        this.createHTML();
        this.setupEventListeners();
        this.setupDragAndDrop();
    }
    
    /**
     * Create HTML structure
     */
    createHTML() {
        this.container.innerHTML = `
            <div class="upload-area" tabindex="0" role="button" aria-label="Upload document">
                <div class="upload-icon">📄</div>
                <h2>Upload STEM Document</h2>
                <p>Drop an image or click to browse</p>
                <p class="supported-formats">Supports: JPG, PNG, GIF, WebP</p>
                <input type="file" class="file-input" accept="${this.options.accept}" ${this.options.multiple ? 'multiple' : ''} style="display: none;">
            </div>
        `;
        
        this.uploadArea = this.container.querySelector('.upload-area');
        this.fileInput = this.container.querySelector('.file-input');
    }
    
    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Click to upload
        this.uploadArea.addEventListener('click', () => {
            this.fileInput.click();
        });
        
        // File selection
        this.fileInput.addEventListener('change', (e) => {
            this.handleFileSelect(e.target.files);
        });
        
        // Keyboard support
        this.uploadArea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.fileInput.click();
            }
        });
    }
    
    /**
     * Set up drag and drop
     */
    setupDragAndDrop() {
        this.uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.setDragOver(true);
        });
        
        this.uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            this.setDragOver(false);
        });
        
        this.uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            this.setDragOver(false);
            
            const files = Array.from(e.dataTransfer.files);
            if (files.length > 0) {
                this.handleFileSelect(files);
            }
        });
    }
    
    /**
     * Handle file selection
     * @param {FileList} files - Selected files
     */
    handleFileSelect(files) {
        const file = files[0]; // Take first file
        
        if (!file) return;
        
        // Validate file
        const validation = this.validateFile(file);
        if (!validation.valid) {
            this.showError(validation.errors.join(', '));
            return;
        }
        
        // Show file info
        this.showFileInfo(file);
        
        // Call callback
        if (this.options.onFileSelect) {
            this.options.onFileSelect(file);
        }
    }
    
    /**
     * Validate file
     * @param {File} file - File to validate
     * @returns {Object} - Validation result
     */
    validateFile(file) {
        const result = {
            valid: true,
            errors: []
        };
        
        // Check file size
        if (file.size > this.options.maxSize) {
            result.valid = false;
            result.errors.push(`File is too large. Maximum size is ${this.formatFileSize(this.options.maxSize)}`);
        }
        
        // Check file type
        if (!file.type.startsWith('image/')) {
            result.valid = false;
            result.errors.push('Please upload an image file');
        }
        
        // Check if file is empty
        if (file.size === 0) {
            result.valid = false;
            result.errors.push('File is empty');
        }
        
        return result;
    }
    
    /**
     * Show file information
     * @param {File} file - Selected file
     */
    showFileInfo(file) {
        const info = document.createElement('div');
        info.className = 'file-info';
        info.innerHTML = `
            <div class="file-preview">
                <img src="${URL.createObjectURL(file)}" alt="Preview" style="max-width: 200px; max-height: 200px;">
            </div>
            <div class="file-details">
                <h3>${file.name}</h3>
                <p>Size: ${this.formatFileSize(file.size)}</p>
                <p>Type: ${file.type}</p>
            </div>
        `;
        
        this.uploadArea.innerHTML = '';
        this.uploadArea.appendChild(info);
    }
    
    /**
     * Show error message
     * @param {string} message - Error message
     */
    showError(message) {
        const error = document.createElement('div');
        error.className = 'upload-error';
        error.textContent = message;
        
        this.uploadArea.appendChild(error);
        
        setTimeout(() => {
            error.remove();
        }, 5000);
        
        if (this.options.onError) {
            this.options.onError(message);
        }
    }
    
    /**
     * Set drag over state
     * @param {boolean} isDragOver - Drag over state
     */
    setDragOver(isDragOver) {
        this.isDragOver = isDragOver;
        
        if (isDragOver) {
            this.uploadArea.classList.add('dragover');
        } else {
            this.uploadArea.classList.remove('dragover');
        }
    }
    
    /**
     * Format file size
     * @param {number} bytes - File size in bytes
     * @returns {string} - Formatted size
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    /**
     * Reset upload area
     */
    reset() {
        this.uploadArea.innerHTML = `
            <div class="upload-icon">📄</div>
            <h2>Upload STEM Document</h2>
            <p>Drop an image or click to browse</p>
            <p class="supported-formats">Supports: JPG, PNG, GIF, WebP</p>
            <input type="file" class="file-input" accept="${this.options.accept}" ${this.options.multiple ? 'multiple' : ''} style="display: none;">
        `;
        
        this.fileInput = this.uploadArea.querySelector('.file-input');
        this.setupEventListeners();
    }
    
    /**
     * Set loading state
     * @param {boolean} isLoading - Loading state
     */
    setLoading(isLoading) {
        if (isLoading) {
            this.uploadArea.classList.add('loading');
            this.uploadArea.innerHTML = `
                <div class="spinner"></div>
                <h2>Processing...</h2>
                <p>Please wait while we analyze your document</p>
            `;
        } else {
            this.uploadArea.classList.remove('loading');
        }
    }
}

/**
 * Create upload area component
 * @param {HTMLElement} container - Container element
 * @param {Object} options - Component options
 * @returns {UploadArea} - Upload area instance
 */
export function createUploadArea(container, options = {}) {
    return new UploadArea(container, options);
}

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        UploadArea,
        createUploadArea
    };
}
