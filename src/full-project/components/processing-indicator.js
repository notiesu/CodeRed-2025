// ⏳ Processing Indicator Component
// This file handles the processing indicator component

class ProcessingIndicator {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            showProgress: true,
            showSteps: true,
            onCancel: null,
            ...options
        };
        
        this.currentStep = 0;
        this.steps = [
            'Analyzing document...',
            'Extracting mathematical content...',
            'Converting to speech...',
            'Generating audio...',
            'Finalizing...'
        ];
        
        this.init();
    }
    
    /**
     * Initialize processing indicator
     */
    init() {
        this.createHTML();
        this.startAnimation();
    }
    
    /**
     * Create HTML structure
     */
    createHTML() {
        this.container.innerHTML = `
            <div class="processing-indicator">
                <div class="spinner"></div>
                <h3>Processing your document...</h3>
                <p class="current-step">${this.steps[0]}</p>
                ${this.options.showProgress ? '<div class="progress-bar"><div class="progress-fill"></div></div>' : ''}
                ${this.options.showSteps ? '<div class="steps-list"></div>' : ''}
                ${this.options.onCancel ? '<button class="btn btn-outline cancel-btn">Cancel</button>' : ''}
            </div>
        `;
        
        this.progressFill = this.container.querySelector('.progress-fill');
        this.stepsList = this.container.querySelector('.steps-list');
        this.cancelBtn = this.container.querySelector('.cancel-btn');
        
        if (this.stepsList) {
            this.createStepsList();
        }
        
        if (this.cancelBtn && this.options.onCancel) {
            this.cancelBtn.addEventListener('click', this.options.onCancel);
        }
    }
    
    /**
     * Create steps list
     */
    createStepsList() {
        this.steps.forEach((step, index) => {
            const stepElement = document.createElement('div');
            stepElement.className = 'step';
            stepElement.innerHTML = `
                <div class="step-icon">${index === 0 ? '🔄' : '⏳'}</div>
                <div class="step-text">${step}</div>
            `;
            this.stepsList.appendChild(stepElement);
        });
    }
    
    /**
     * Start animation
     */
    startAnimation() {
        this.animateSteps();
        this.animateProgress();
    }
    
    /**
     * Animate steps
     */
    animateSteps() {
        const stepElements = this.stepsList?.querySelectorAll('.step');
        if (!stepElements) return;
        
        const animateStep = (index) => {
            if (index >= stepElements.length) {
                // All steps completed, restart
                setTimeout(() => this.animateSteps(), 1000);
                return;
            }
            
            // Mark current step as active
            stepElements[index].classList.add('active');
            stepElements[index].querySelector('.step-icon').textContent = '🔄';
            
            // Update current step text
            const currentStepText = this.container.querySelector('.current-step');
            if (currentStepText) {
                currentStepText.textContent = this.steps[index];
            }
            
            // Move to next step after delay
            setTimeout(() => {
                stepElements[index].classList.remove('active');
                stepElements[index].classList.add('completed');
                stepElements[index].querySelector('.step-icon').textContent = '✅';
                animateStep(index + 1);
            }, 2000);
        };
        
        animateStep(0);
    }
    
    /**
     * Animate progress bar
     */
    animateProgress() {
        if (!this.progressFill) return;
        
        let progress = 0;
        const increment = 100 / (this.steps.length * 2); // 2 seconds per step
        
        const updateProgress = () => {
            progress += increment;
            if (progress > 100) {
                progress = 0; // Restart
            }
            
            this.progressFill.style.width = `${progress}%`;
            setTimeout(updateProgress, 100);
        };
        
        updateProgress();
    }
    
    /**
     * Update current step
     * @param {number} stepIndex - Step index
     */
    updateStep(stepIndex) {
        this.currentStep = stepIndex;
        
        const currentStepText = this.container.querySelector('.current-step');
        if (currentStepText && this.steps[stepIndex]) {
            currentStepText.textContent = this.steps[stepIndex];
        }
        
        // Update progress
        if (this.progressFill) {
            const progress = (stepIndex / this.steps.length) * 100;
            this.progressFill.style.width = `${progress}%`;
        }
    }
    
    /**
     * Set custom message
     * @param {string} message - Custom message
     */
    setMessage(message) {
        const currentStepText = this.container.querySelector('.current-step');
        if (currentStepText) {
            currentStepText.textContent = message;
        }
    }
    
    /**
     * Show error state
     * @param {string} error - Error message
     */
    showError(error) {
        this.container.innerHTML = `
            <div class="processing-error">
                <div class="error-icon">❌</div>
                <h3>Processing Failed</h3>
                <p>${error}</p>
                <button class="btn btn-primary retry-btn">Try Again</button>
            </div>
        `;
        
        const retryBtn = this.container.querySelector('.retry-btn');
        if (retryBtn && this.options.onRetry) {
            retryBtn.addEventListener('click', this.options.onRetry);
        }
    }
    
    /**
     * Show success state
     * @param {string} message - Success message
     */
    showSuccess(message = 'Processing completed successfully!') {
        this.container.innerHTML = `
            <div class="processing-success">
                <div class="success-icon">✅</div>
                <h3>${message}</h3>
                <p>Your document has been processed and is ready for narration.</p>
            </div>
        `;
    }
    
    /**
     * Hide processing indicator
     */
    hide() {
        this.container.style.display = 'none';
    }
    
    /**
     * Show processing indicator
     */
    show() {
        this.container.style.display = 'block';
    }
    
    /**
     * Reset processing indicator
     */
    reset() {
        this.currentStep = 0;
        this.init();
    }
}

/**
 * Create processing indicator component
 * @param {HTMLElement} container - Container element
 * @param {Object} options - Component options
 * @returns {ProcessingIndicator} - Processing indicator instance
 */
function createProcessingIndicator(container, options = {}) {
    return new ProcessingIndicator(container, options);
}

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ProcessingIndicator,
        createProcessingIndicator
    };
}
