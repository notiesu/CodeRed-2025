// 🎯 MathsVoice - Full Application
// This file coordinates all components and handles the main application logic

// 📋 Global Variables
let uploadArea;
let processingIndicator;
let audioControls;
let audioManager;
let isProcessing = false;

// 🚀 Initialize the application when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎓 MathsVoice Full Application initialized!');
    initializeComponents();
    setupEventListeners();
    checkAPIConnection();
});

// 🔧 Initialize all components
function initializeComponents() {
    // Initialize upload area
    const uploadContainer = document.getElementById('uploadContainer');
    uploadArea = createUploadArea(uploadContainer, {
        onFileSelect: handleFileSelect,
        onError: handleUploadError
    });
    
    // Initialize processing indicator
    const processingContainer = document.getElementById('processingContainer');
    processingIndicator = createProcessingIndicator(processingContainer, {
        onCancel: handleProcessingCancel,
        onRetry: handleProcessingRetry
    });
    
    // Initialize audio controls
    const audioControlsContainer = document.getElementById('audioControlsContainer');
    audioControls = createAudioControls(audioControlsContainer, {
        onPlay: handleAudioPlay,
        onPause: handleAudioPause,
        onStop: handleAudioStop,
        onVoiceChange: handleVoiceChange,
        onDownload: handleAudioDownload
    });
    
    // Initialize audio manager
    audioManager = createAudioManager();
    setupAudioManagerListeners();
}

// 🎧 Set up event listeners
function setupEventListeners() {
    // New document button
    document.getElementById('newDocumentBtn').addEventListener('click', resetApplication);
}

// 🎵 Set up audio manager listeners
function setupAudioManagerListeners() {
    audioManager.on('play', () => {
        audioControls.play();
    });
    
    audioManager.on('pause', () => {
        audioControls.pause();
    });
    
    audioManager.on('ended', () => {
        audioControls.stop();
    });
    
    audioManager.on('timeupdate', (data) => {
        audioControls.setCurrentTime(data.currentTime);
        audioControls.setDuration(data.duration);
    });
    
    audioManager.on('error', (error) => {
        console.error('Audio error:', error);
        showError('Audio playback error. Please try again.');
    });
}

// 📁 Handle file selection
async function handleFileSelect(file) {
    if (isProcessing) return;
    
    try {
        isProcessing = true;
        showProcessingSection();
        
        // Process file with Mathpix
        const base64 = await fileToBase64(file);
        const mathpixResult = await processWithMathpix(base64);
        
        // Convert to speech
        const speechText = generateSpeechText(mathpixResult);
        
        // Generate audio with ElevenLabs
        const audioBlob = await createMathAudio(speechText, 'standard');
        
        // Load audio and show results
        await audioManager.loadAudio(audioBlob);
        showResults(speechText);
        
    } catch (error) {
        console.error('Processing error:', error);
        processingIndicator.showError(error.message);
    } finally {
        isProcessing = false;
    }
}

// 🚫 Handle upload error
function handleUploadError(error) {
    showError(error);
}

// ⏹️ Handle processing cancel
function handleProcessingCancel() {
    isProcessing = false;
    resetApplication();
}

// 🔄 Handle processing retry
function handleProcessingRetry() {
    resetApplication();
}

// ▶️ Handle audio play
function handleAudioPlay() {
    audioManager.play();
}

// ⏸️ Handle audio pause
function handleAudioPause() {
    audioManager.pause();
}

// ⏹️ Handle audio stop
function handleAudioStop() {
    audioManager.stop();
}

// 🎵 Handle voice change
function handleVoiceChange(voiceType) {
    console.log(`Voice changed to: ${voiceType}`);
    // In a full implementation, you'd regenerate audio with new voice
}

// ⬇️ Handle audio download
function handleAudioDownload() {
    if (audioManager.currentAudio) {
        const audioUrl = audioManager.currentAudio.src;
        const a = document.createElement('a');
        a.href = audioUrl;
        a.download = 'mathsvoice-narration.mp3';
        a.click();
    } else {
        showError('No audio available to download.');
    }
}

// 📊 Process with Mathpix API
async function processWithMathpix(base64Image) {
    if (DEMO_MODE) {
        console.log('🎭 Using demo mode - no real API call');
        return DEMO_CONTENT;
    }
    
    try {
        validateMathpixConfig();
        return await processWithMathpix(base64Image);
    } catch (error) {
        console.error('Mathpix processing error:', error);
        throw new Error(`Failed to process image: ${error.message}`);
    }
}

// 🗣️ Generate speech text
function generateSpeechText(mathpixResult) {
    if (DEMO_MODE) {
        return DEMO_CONTENT.text;
    }
    
    // Extract text content
    const text = mathpixResult.text || '';
    const latex = mathpixResult.latex || '';
    
    // Convert LaTeX to spoken text
    const spokenMath = convertLatexToSpeech(latex);
    
    // Enhance regular text
    const enhancedText = enhanceTextForSpeech(text);
    
    // Combine text and math
    return `${enhancedText} ${spokenMath}`.trim();
}

// 🎵 Create math audio
async function createMathAudio(text, voiceType) {
    if (DEMO_MODE) {
        console.log('🎭 Demo mode - generating sample audio');
        return createDemoAudioBlob();
    }
    
    try {
        validateElevenLabsConfig();
        return await createMathAudio(text, voiceType);
    } catch (error) {
        console.error('ElevenLabs processing error:', error);
        throw new Error(`Failed to generate audio: ${error.message}`);
    }
}

// 🎭 Create demo audio blob
function createDemoAudioBlob() {
    return new Blob(['demo audio'], { type: 'audio/wav' });
}

// 📱 UI Functions
function showProcessingSection() {
    document.getElementById('uploadContainer').style.display = 'none';
    document.getElementById('processingSection').style.display = 'block';
    document.getElementById('resultsSection').style.display = 'none';
    
    processingIndicator.show();
}

function showResults(speechText) {
    // Show results
    document.getElementById('processingSection').style.display = 'none';
    document.getElementById('resultsSection').style.display = 'block';
    document.getElementById('contentOutput').textContent = speechText;
    
    // Enable audio controls
    audioControls.setEnabled(true);
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = message;
    
    document.querySelector('.main-content').insertBefore(errorDiv, document.querySelector('.main-content').firstChild);
    
    setTimeout(() => errorDiv.remove(), 5000);
}

function resetApplication() {
    // Reset all sections
    document.getElementById('uploadContainer').style.display = 'block';
    document.getElementById('processingSection').style.display = 'none';
    document.getElementById('resultsSection').style.display = 'none';
    
    // Reset components
    uploadArea.reset();
    processingIndicator.reset();
    audioManager.destroy();
    audioControls.setEnabled(false);
    
    // Reset state
    isProcessing = false;
}

// 🔍 Check API connection
async function checkAPIConnection() {
    if (DEMO_MODE) {
        console.log('🎭 Running in demo mode - APIs not required');
        return;
    }
    
    try {
        // Check Mathpix connection
        const mathpixConnected = await testMathpixConnection();
        console.log(`Mathpix connection: ${mathpixConnected ? '✅' : '❌'}`);
        
        // Check ElevenLabs connection
        const elevenlabsConnected = await testElevenLabsConnection();
        console.log(`ElevenLabs connection: ${elevenlabsConnected ? '✅' : '❌'}`);
        
        if (!mathpixConnected || !elevenlabsConnected) {
            showError('API connection failed. Please check your configuration.');
        }
        
    } catch (error) {
        console.error('API connection check failed:', error);
        showError('Failed to verify API connections. Please check your configuration.');
    }
}

// 🛠️ Utility Functions
function handleError(error, context = '') {
    console.error(`Error in ${context}:`, error);
    showError(`${context ? context + ': ' : ''}${error.message}`);
}

// 🎯 Application State Management
const AppState = {
    currentFile: null,
    processingResult: null,
    audioBlob: null,
    
    setCurrentFile(file) {
        this.currentFile = file;
    },
    
    setProcessingResult(result) {
        this.processingResult = result;
    },
    
    setAudioBlob(blob) {
        this.audioBlob = blob;
    },
    
    clear() {
        this.currentFile = null;
        this.processingResult = null;
        this.audioBlob = null;
    }
};

// 🚀 Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeComponents,
        handleFileSelect,
        processWithMathpix,
        generateSpeechText,
        createMathAudio,
        AppState
    };
}
