// 🎯 MathsVoice - Proof of Concept
// This file handles the user interface and coordinates all the API calls

// 📋 Global Variables
let currentAudio = null;
let isProcessing = false;
let isDemoMode = true;

// 🚀 Initialize the application when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎓 MathsVoice Proof of Concept initialized!');
    setupEventListeners();
    checkAPIConnection();
    setupSampleProblems();
});

// 🎧 Set up all the button clicks and interactions
function setupEventListeners() {
    // File upload
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    
    uploadArea.addEventListener('click', () => fileInput.click());
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('drop', handleDrop);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    
    fileInput.addEventListener('change', handleFileSelect);
    
    // Demo mode toggle
    document.getElementById('demoMode').addEventListener('change', handleDemoModeToggle);
    
    // Audio controls
    document.getElementById('playBtn').addEventListener('click', playAudio);
    document.getElementById('pauseBtn').addEventListener('click', pauseAudio);
    document.getElementById('stopBtn').addEventListener('click', stopAudio);
    
    // Voice selection
    document.getElementById('voiceSelect').addEventListener('change', handleVoiceChange);
    
    // Action buttons
    document.getElementById('newDocumentBtn').addEventListener('click', resetApplication);
    document.getElementById('downloadAudioBtn').addEventListener('click', downloadAudio);
}

// 🎭 Set up sample problems for demo
function setupSampleProblems() {
    const sampleItems = document.querySelectorAll('.sample-item');
    sampleItems.forEach(item => {
        item.addEventListener('click', () => {
            const problemType = item.dataset.problem;
            loadSampleProblem(problemType);
        });
    });
}

// 📁 Handle file upload
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        processFile(file);
    }
}

// 🎯 Handle drag and drop
function handleDragOver(event) {
    event.preventDefault();
    event.currentTarget.classList.add('dragover');
}

function handleDrop(event) {
    event.preventDefault();
    event.currentTarget.classList.remove('dragover');
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
        processFile(files[0]);
    }
}

function handleDragLeave(event) {
    event.currentTarget.classList.remove('dragover');
}

// 🎭 Handle demo mode toggle
function handleDemoModeToggle(event) {
    isDemoMode = event.target.checked;
    console.log(`Demo mode: ${isDemoMode ? 'ON' : 'OFF'}`);
    
    if (isDemoMode) {
        document.getElementById('sampleProblems').style.display = 'block';
    } else {
        document.getElementById('sampleProblems').style.display = 'none';
    }
}

// 📊 Load sample problem for demo
function loadSampleProblem(problemType) {
    if (!isDemoMode) return;
    
    const sample = getSampleProblem(problemType);
    if (sample) {
        // Simulate processing
        showProcessingSection();
        
        setTimeout(() => {
            const speechText = sample.speech;
            const audioBlob = createDemoAudioBlob();
            showResults(speechText, audioBlob);
        }, 2000);
    }
}

// 🔄 Process uploaded file
async function processFile(file) {
    if (isProcessing) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showError('Please upload an image file (JPG, PNG, etc.)');
        return;
    }
    
    isProcessing = true;
    showProcessingSection();
    
    try {
        if (isDemoMode) {
            // Demo mode - use sample content
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing
            const sample = getSampleProblem('quadratic');
            const speechText = sample.speech;
            const audioBlob = createDemoAudioBlob();
            showResults(speechText, audioBlob);
        } else {
            // Real mode - use APIs
            const base64 = await fileToBase64(file);
            const mathpixResult = await processWithMathpix(base64);
            const speechText = convertToSpeech(mathpixResult);
            const audioBlob = await generateAudio(speechText);
            showResults(speechText, audioBlob);
        }
        
    } catch (error) {
        console.error('Processing error:', error);
        showError('Failed to process document. Please try again.');
    } finally {
        isProcessing = false;
    }
}

// 🔧 Convert file to base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// 📊 Process with Mathpix API
async function processWithMathpix(base64Image) {
    if (isDemoMode) {
        console.log('🎭 Using demo mode - no real API call');
        return DEMO_CONTENT;
    }
    
    const response = await fetch(API_ENDPOINTS.mathpix, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'app_id': MATHPIX_APP_ID,
            'app_key': MATHPIX_APP_KEY
        },
        body: JSON.stringify({
            src: `data:image/jpeg;base64,${base64Image}`,
            formats: ['text', 'latex_styled']
        })
    });
    
    if (!response.ok) {
        throw new Error(`Mathpix API error: ${response.status}`);
    }
    
    return await response.json();
}

// 🗣️ Convert math content to speech
function convertToSpeech(mathpixResult) {
    let speechText = '';
    
    if (isDemoMode) {
        speechText = DEMO_CONTENT.text;
    } else {
        // Extract text content
        const text = mathpixResult.text || '';
        const latex = mathpixResult.latex_styled || '';
        
        // Convert LaTeX to spoken text
        const spokenMath = convertLatexToSpeech(latex);
        
        // Combine text and math
        speechText = `${text} ${spokenMath}`.trim();
    }
    
    return speechText;
}

// 🎵 Generate audio with ElevenLabs
async function generateAudio(text) {
    if (isDemoMode) {
        console.log('🎭 Demo mode - generating sample audio');
        return createDemoAudioBlob();
    }
    
    const selectedVoice = document.getElementById('voiceSelect').value;
    const voiceId = VOICE_SETTINGS[selectedVoice].voice_id;
    
    const response = await fetch(`${API_ENDPOINTS.elevenlabs}/${voiceId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'xi-api-key': ELEVENLABS_API_KEY
        },
        body: JSON.stringify({
            text: text,
            model_id: 'eleven_monolingual_v1',
            voice_settings: {
                stability: 0.5,
                similarity_boost: 0.5
            }
        })
    });
    
    if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`);
    }
    
    return await response.blob();
}

// 🎭 Create demo audio blob (for testing without API)
function createDemoAudioBlob() {
    // For demo purposes, we'll create a mock audio blob
    // In a real implementation, this would be the actual audio from ElevenLabs
    return new Blob(['demo audio'], { type: 'audio/wav' });
}

// 🎧 Audio Controls
function playAudio() {
    if (currentAudio) {
        currentAudio.play();
        document.getElementById('playBtn').style.display = 'none';
        document.getElementById('pauseBtn').style.display = 'inline-flex';
    } else {
        // Use Web Speech API for demo
        const text = document.getElementById('contentOutput').textContent;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.8;
        utterance.pitch = 1.0;
        
        // Use different voices for demo
        const voices = speechSynthesis.getVoices();
        const selectedVoice = document.getElementById('voiceSelect').value;
        
        if (selectedVoice === 'technical' && voices.length > 1) {
            utterance.voice = voices[1]; // Use second voice for technical content
        }
        
        speechSynthesis.speak(utterance);
        document.getElementById('playBtn').style.display = 'none';
        document.getElementById('pauseBtn').style.display = 'inline-flex';
    }
}

function pauseAudio() {
    if (currentAudio) {
        currentAudio.pause();
    } else {
        speechSynthesis.pause();
    }
    document.getElementById('playBtn').style.display = 'inline-flex';
    document.getElementById('pauseBtn').style.display = 'none';
}

function stopAudio() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    } else {
        speechSynthesis.cancel();
    }
    document.getElementById('playBtn').style.display = 'inline-flex';
    document.getElementById('pauseBtn').style.display = 'none';
}

// 🎵 Handle voice change
function handleVoiceChange() {
    const selectedVoice = document.getElementById('voiceSelect').value;
    console.log(`Voice changed to: ${VOICE_SETTINGS[selectedVoice].name}`);
    // In a full implementation, you'd regenerate audio with new voice
}

// 📱 UI Functions
function showProcessingSection() {
    document.getElementById('uploadArea').style.display = 'none';
    document.getElementById('processingSection').style.display = 'block';
    document.getElementById('resultsSection').style.display = 'none';
    document.getElementById('sampleProblems').style.display = 'none';
}

function showResults(speechText, audioBlob) {
    // Create audio element
    if (audioBlob && audioBlob.size > 0) {
        const audioUrl = URL.createObjectURL(audioBlob);
        currentAudio = new Audio(audioUrl);
    }
    
    // Show results
    document.getElementById('processingSection').style.display = 'none';
    document.getElementById('resultsSection').style.display = 'block';
    document.getElementById('contentOutput').textContent = speechText;
    
    // Enable audio controls
    document.getElementById('playBtn').disabled = false;
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
    document.getElementById('uploadArea').style.display = 'block';
    document.getElementById('processingSection').style.display = 'none';
    document.getElementById('resultsSection').style.display = 'none';
    
    if (isDemoMode) {
        document.getElementById('sampleProblems').style.display = 'block';
    }
    
    // Clear file input
    document.getElementById('fileInput').value = '';
    
    // Reset audio
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }
    speechSynthesis.cancel();
    
    // Reset buttons
    document.getElementById('playBtn').style.display = 'inline-flex';
    document.getElementById('pauseBtn').style.display = 'none';
}

function downloadAudio() {
    if (currentAudio) {
        const a = document.createElement('a');
        a.href = currentAudio.src;
        a.download = 'mathsvoice-narration.mp3';
        a.click();
    } else {
        showError('No audio available to download. This feature requires API integration.');
    }
}

// 🔍 Check API connection
async function checkAPIConnection() {
    if (isDemoMode) {
        console.log('🎭 Running in demo mode - APIs not required');
        return;
    }
    
    // Check if API keys are set
    if (MATHPIX_APP_ID === 'your_mathpix_app_id_here' || 
        MATHPIX_APP_KEY === 'your_mathpix_app_key_here' || 
        ELEVENLABS_API_KEY === 'your_elevenlabs_api_key_here') {
        console.warn('⚠️ API keys not configured - running in demo mode');
        isDemoMode = true;
        document.getElementById('demoMode').checked = true;
        return;
    }
    
    console.log('✅ API keys configured');
}
