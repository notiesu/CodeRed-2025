// 🎵 Audio Controls Component
// This file handles the audio controls component

class AudioControls {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            showVoiceSelection: true,
            showDownload: true,
            showProgress: true,
            onPlay: null,
            onPause: null,
            onStop: null,
            onVoiceChange: null,
            onDownload: null,
            ...options
        };
        
        this.isPlaying = false;
        this.isPaused = false;
        this.currentTime = 0;
        this.duration = 0;
        this.volume = 1.0;
        this.playbackRate = 1.0;
        this.selectedVoice = 'standard';
        
        this.init();
    }
    
    /**
     * Initialize audio controls
     */
    init() {
        this.createHTML();
        this.setupEventListeners();
    }
    
    /**
     * Create HTML structure
     */
    createHTML() {
        this.container.innerHTML = `
            <div class="audio-controls">
                <h3>Audio Narration</h3>
                
                <div class="voice-controls">
                    <button class="btn btn-primary play-btn" aria-label="Play narration">
                        <span class="btn-icon">▶️</span>
                        <span class="btn-text">Play Narration</span>
                    </button>
                    <button class="btn btn-secondary pause-btn" aria-label="Pause narration" style="display: none;">
                        <span class="btn-icon">⏸️</span>
                        <span class="btn-text">Pause</span>
                    </button>
                    <button class="btn btn-secondary stop-btn" aria-label="Stop narration">
                        <span class="btn-icon">⏹️</span>
                        <span class="btn-text">Stop</span>
                    </button>
                </div>
                
                ${this.options.showVoiceSelection ? `
                    <div class="voice-selection">
                        <label for="voiceSelect">Narration Voice:</label>
                        <select id="voiceSelect" class="voice-select">
                            <option value="standard">Standard Voice (Main Content)</option>
                            <option value="technical">Technical Voice (Math & Science)</option>
                        </select>
                    </div>
                ` : ''}
                
                ${this.options.showProgress ? `
                    <div class="audio-progress">
                        <div class="time-display">
                            <span class="current-time">0:00</span>
                            <span class="duration">0:00</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill"></div>
                            <div class="progress-handle"></div>
                        </div>
                    </div>
                ` : ''}
                
                <div class="audio-settings">
                    <div class="volume-control">
                        <label for="volumeSlider">Volume:</label>
                        <input type="range" id="volumeSlider" class="volume-slider" min="0" max="1" step="0.1" value="1">
                        <span class="volume-value">100%</span>
                    </div>
                    
                    <div class="speed-control">
                        <label for="speedSlider">Speed:</label>
                        <input type="range" id="speedSlider" class="speed-slider" min="0.5" max="2" step="0.1" value="1">
                        <span class="speed-value">1x</span>
                    </div>
                </div>
                
                ${this.options.showDownload ? `
                    <div class="download-controls">
                        <button class="btn btn-outline download-btn">
                            <span class="btn-icon">⬇️</span>
                            <span class="btn-text">Download Audio</span>
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
        
        this.playBtn = this.container.querySelector('.play-btn');
        this.pauseBtn = this.container.querySelector('.pause-btn');
        this.stopBtn = this.container.querySelector('.stop-btn');
        this.voiceSelect = this.container.querySelector('#voiceSelect');
        this.volumeSlider = this.container.querySelector('#volumeSlider');
        this.speedSlider = this.container.querySelector('#speedSlider');
        this.downloadBtn = this.container.querySelector('.download-btn');
        this.progressBar = this.container.querySelector('.progress-bar');
        this.progressFill = this.container.querySelector('.progress-fill');
        this.progressHandle = this.container.querySelector('.progress-handle');
        this.currentTimeDisplay = this.container.querySelector('.current-time');
        this.durationDisplay = this.container.querySelector('.duration');
        this.volumeValue = this.container.querySelector('.volume-value');
        this.speedValue = this.container.querySelector('.speed-value');
    }
    
    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Play/Pause button
        this.playBtn.addEventListener('click', () => {
            if (this.isPlaying) {
                this.pause();
            } else {
                this.play();
            }
        });
        
        // Stop button
        this.stopBtn.addEventListener('click', () => {
            this.stop();
        });
        
        // Voice selection
        if (this.voiceSelect) {
            this.voiceSelect.addEventListener('change', (e) => {
                this.selectedVoice = e.target.value;
                if (this.options.onVoiceChange) {
                    this.options.onVoiceChange(this.selectedVoice);
                }
            });
        }
        
        // Volume control
        if (this.volumeSlider) {
            this.volumeSlider.addEventListener('input', (e) => {
                this.setVolume(parseFloat(e.target.value));
            });
        }
        
        // Speed control
        if (this.speedSlider) {
            this.speedSlider.addEventListener('input', (e) => {
                this.setPlaybackRate(parseFloat(e.target.value));
            });
        }
        
        // Download button
        if (this.downloadBtn) {
            this.downloadBtn.addEventListener('click', () => {
                if (this.options.onDownload) {
                    this.options.onDownload();
                }
            });
        }
        
        // Progress bar
        if (this.progressBar) {
            this.progressBar.addEventListener('click', (e) => {
                const rect = this.progressBar.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const percentage = clickX / rect.width;
                const newTime = percentage * this.duration;
                this.seekTo(newTime);
            });
        }
    }
    
    /**
     * Play audio
     */
    play() {
        this.isPlaying = true;
        this.isPaused = false;
        
        this.playBtn.style.display = 'none';
        this.pauseBtn.style.display = 'inline-flex';
        
        if (this.options.onPlay) {
            this.options.onPlay();
        }
    }
    
    /**
     * Pause audio
     */
    pause() {
        this.isPlaying = false;
        this.isPaused = true;
        
        this.playBtn.style.display = 'inline-flex';
        this.pauseBtn.style.display = 'none';
        
        if (this.options.onPause) {
            this.options.onPause();
        }
    }
    
    /**
     * Stop audio
     */
    stop() {
        this.isPlaying = false;
        this.isPaused = false;
        this.currentTime = 0;
        
        this.playBtn.style.display = 'inline-flex';
        this.pauseBtn.style.display = 'none';
        
        this.updateProgress();
        
        if (this.options.onStop) {
            this.options.onStop();
        }
    }
    
    /**
     * Set volume
     * @param {number} volume - Volume level (0-1)
     */
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        
        if (this.volumeSlider) {
            this.volumeSlider.value = this.volume;
        }
        
        if (this.volumeValue) {
            this.volumeValue.textContent = `${Math.round(this.volume * 100)}%`;
        }
    }
    
    /**
     * Set playback rate
     * @param {number} rate - Playback rate
     */
    setPlaybackRate(rate) {
        this.playbackRate = Math.max(0.5, Math.min(2, rate));
        
        if (this.speedSlider) {
            this.speedSlider.value = this.playbackRate;
        }
        
        if (this.speedValue) {
            this.speedValue.textContent = `${this.playbackRate}x`;
        }
    }
    
    /**
     * Seek to specific time
     * @param {number} time - Time in seconds
     */
    seekTo(time) {
        this.currentTime = Math.max(0, Math.min(this.duration, time));
        this.updateProgress();
    }
    
    /**
     * Update progress display
     */
    updateProgress() {
        if (this.progressFill) {
            const percentage = this.duration > 0 ? (this.currentTime / this.duration) * 100 : 0;
            this.progressFill.style.width = `${percentage}%`;
        }
        
        if (this.progressHandle) {
            const percentage = this.duration > 0 ? (this.currentTime / this.duration) * 100 : 0;
            this.progressHandle.style.left = `${percentage}%`;
        }
        
        if (this.currentTimeDisplay) {
            this.currentTimeDisplay.textContent = this.formatTime(this.currentTime);
        }
        
        if (this.durationDisplay) {
            this.durationDisplay.textContent = this.formatTime(this.duration);
        }
    }
    
    /**
     * Set duration
     * @param {number} duration - Duration in seconds
     */
    setDuration(duration) {
        this.duration = duration;
        this.updateProgress();
    }
    
    /**
     * Set current time
     * @param {number} time - Current time in seconds
     */
    setCurrentTime(time) {
        this.currentTime = time;
        this.updateProgress();
    }
    
    /**
     * Format time in seconds to MM:SS format
     * @param {number} seconds - Time in seconds
     * @returns {string} - Formatted time
     */
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    /**
     * Get current state
     * @returns {Object} - Current state
     */
    getState() {
        return {
            isPlaying: this.isPlaying,
            isPaused: this.isPaused,
            currentTime: this.currentTime,
            duration: this.duration,
            volume: this.volume,
            playbackRate: this.playbackRate,
            selectedVoice: this.selectedVoice
        };
    }
    
    /**
     * Enable/disable controls
     * @param {boolean} enabled - Enable state
     */
    setEnabled(enabled) {
        const buttons = this.container.querySelectorAll('button');
        const inputs = this.container.querySelectorAll('input, select');
        
        buttons.forEach(btn => btn.disabled = !enabled);
        inputs.forEach(input => input.disabled = !enabled);
    }
    
    /**
     * Show/hide controls
     * @param {boolean} visible - Visibility state
     */
    setVisible(visible) {
        this.container.style.display = visible ? 'block' : 'none';
    }
}

/**
 * Create audio controls component
 * @param {HTMLElement} container - Container element
 * @param {Object} options - Component options
 * @returns {AudioControls} - Audio controls instance
 */
export function createAudioControls(container, options = {}) {
    return new AudioControls(container, options);
}

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AudioControls,
        createAudioControls
    };
}
