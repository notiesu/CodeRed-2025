// 🎵 Audio Manager
// This file handles audio playback, controls, and management

class AudioManager {
    constructor() {
        this.currentAudio = null;
        this.isPlaying = false;
        this.isPaused = false;
        this.currentTime = 0;
        this.duration = 0;
        this.volume = 1.0;
        this.playbackRate = 1.0;
        this.listeners = {};
    }
    
    /**
     * Load audio from blob
     * @param {Blob} audioBlob - Audio blob
     * @returns {Promise<void>}
     */
    async loadAudio(audioBlob) {
        try {
            // Clean up previous audio
            if (this.currentAudio) {
                this.currentAudio.pause();
                this.currentAudio = null;
            }
            
            // Create new audio element
            const audioUrl = URL.createObjectURL(audioBlob);
            this.currentAudio = new Audio(audioUrl);
            
            // Set up event listeners
            this.setupAudioListeners();
            
            // Wait for audio to be ready
            await new Promise((resolve, reject) => {
                this.currentAudio.addEventListener('loadedmetadata', resolve);
                this.currentAudio.addEventListener('error', reject);
            });
            
            this.duration = this.currentAudio.duration;
            this.emit('loaded', { duration: this.duration });
            
        } catch (error) {
            console.error('Failed to load audio:', error);
            this.emit('error', error);
            throw error;
        }
    }
    
    /**
     * Set up audio event listeners
     */
    setupAudioListeners() {
        if (!this.currentAudio) return;
        
        this.currentAudio.addEventListener('play', () => {
            this.isPlaying = true;
            this.isPaused = false;
            this.emit('play');
        });
        
        this.currentAudio.addEventListener('pause', () => {
            this.isPlaying = false;
            this.isPaused = true;
            this.emit('pause');
        });
        
        this.currentAudio.addEventListener('ended', () => {
            this.isPlaying = false;
            this.isPaused = false;
            this.currentTime = 0;
            this.emit('ended');
        });
        
        this.currentAudio.addEventListener('timeupdate', () => {
            this.currentTime = this.currentAudio.currentTime;
            this.emit('timeupdate', { 
                currentTime: this.currentTime, 
                duration: this.duration 
            });
        });
        
        this.currentAudio.addEventListener('error', (error) => {
            this.emit('error', error);
        });
    }
    
    /**
     * Play audio
     */
    async play() {
        if (!this.currentAudio) {
            throw new Error('No audio loaded');
        }
        
        try {
            await this.currentAudio.play();
        } catch (error) {
            console.error('Failed to play audio:', error);
            this.emit('error', error);
            throw error;
        }
    }
    
    /**
     * Pause audio
     */
    pause() {
        if (this.currentAudio && this.isPlaying) {
            this.currentAudio.pause();
        }
    }
    
    /**
     * Stop audio
     */
    stop() {
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
            this.currentTime = 0;
            this.isPlaying = false;
            this.isPaused = false;
            this.emit('stop');
        }
    }
    
    /**
     * Set volume
     * @param {number} volume - Volume level (0-1)
     */
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        if (this.currentAudio) {
            this.currentAudio.volume = this.volume;
        }
        this.emit('volumechange', { volume: this.volume });
    }
    
    /**
     * Set playback rate
     * @param {number} rate - Playback rate
     */
    setPlaybackRate(rate) {
        this.playbackRate = Math.max(0.25, Math.min(4, rate));
        if (this.currentAudio) {
            this.currentAudio.playbackRate = this.playbackRate;
        }
        this.emit('ratechange', { rate: this.playbackRate });
    }
    
    /**
     * Seek to specific time
     * @param {number} time - Time in seconds
     */
    seekTo(time) {
        if (this.currentAudio) {
            this.currentAudio.currentTime = Math.max(0, Math.min(this.duration, time));
            this.currentTime = this.currentAudio.currentTime;
            this.emit('seek', { time: this.currentTime });
        }
    }
    
    /**
     * Get current audio state
     * @returns {Object} - Audio state
     */
    getState() {
        return {
            isPlaying: this.isPlaying,
            isPaused: this.isPaused,
            currentTime: this.currentTime,
            duration: this.duration,
            volume: this.volume,
            playbackRate: this.playbackRate
        };
    }
    
    /**
     * Add event listener
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     */
    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }
    
    /**
     * Remove event listener
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     */
    off(event, callback) {
        if (this.listeners[event]) {
            this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
        }
    }
    
    /**
     * Emit event
     * @param {string} event - Event name
     * @param {*} data - Event data
     */
    emit(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => callback(data));
        }
    }
    
    /**
     * Clean up resources
     */
    destroy() {
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio = null;
        }
        this.listeners = {};
        this.isPlaying = false;
        this.isPaused = false;
        this.currentTime = 0;
        this.duration = 0;
    }
}

/**
 * Create audio manager instance
 * @returns {AudioManager} - Audio manager instance
 */
export function createAudioManager() {
    return new AudioManager();
}

/**
 * Format time in seconds to MM:SS format
 * @param {number} seconds - Time in seconds
 * @returns {string} - Formatted time
 */
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Create audio controls UI
 * @param {AudioManager} audioManager - Audio manager instance
 * @returns {HTMLElement} - Controls element
 */
function createAudioControls(audioManager) {
    const controls = document.createElement('div');
    controls.className = 'audio-controls';
    
    const playButton = document.createElement('button');
    playButton.className = 'btn btn-primary';
    playButton.innerHTML = '<span class="btn-icon">▶️</span> Play';
    playButton.addEventListener('click', () => {
        if (audioManager.isPlaying) {
            audioManager.pause();
        } else {
            audioManager.play();
        }
    });
    
    const stopButton = document.createElement('button');
    stopButton.className = 'btn btn-secondary';
    stopButton.innerHTML = '<span class="btn-icon">⏹️</span> Stop';
    stopButton.addEventListener('click', () => audioManager.stop());
    
    const timeDisplay = document.createElement('span');
    timeDisplay.className = 'time-display';
    timeDisplay.textContent = '0:00 / 0:00';
    
    const volumeSlider = document.createElement('input');
    volumeSlider.type = 'range';
    volumeSlider.min = '0';
    volumeSlider.max = '1';
    volumeSlider.step = '0.1';
    volumeSlider.value = '1';
    volumeSlider.addEventListener('input', (e) => {
        audioManager.setVolume(parseFloat(e.target.value));
    });
    
    controls.appendChild(playButton);
    controls.appendChild(stopButton);
    controls.appendChild(timeDisplay);
    controls.appendChild(volumeSlider);
    
    // Update UI based on audio state
    audioManager.on('play', () => {
        playButton.innerHTML = '<span class="btn-icon">⏸️</span> Pause';
    });
    
    audioManager.on('pause', () => {
        playButton.innerHTML = '<span class="btn-icon">▶️</span> Play';
    });
    
    audioManager.on('timeupdate', (data) => {
        timeDisplay.textContent = `${formatTime(data.currentTime)} / ${formatTime(data.duration)}`;
    });
    
    return controls;
}

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AudioManager,
        createAudioManager,
        formatTime,
        createAudioControls
    };
}
