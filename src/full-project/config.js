// 🔑 API Configuration
// Replace these with your actual API keys when you get them
import { MATHPIX_APP_ID, MATHPIX_APP_KEY, ELEVENLABS_API_KEY, GEMINI_API_KEY} from './secrets.js';

// 🎯 Demo Mode (for testing without API keys)
const DEMO_MODE = false; // Set to true for testing without API keys

// 📝 Demo Content (used when DEMO_MODE is true)
const DEMO_CONTENT = {
    text: "This is a sample math problem: x squared plus 2x plus 1 equals zero. The solution is x equals negative 1.",
    latex: "x^2 + 2x + 1 = 0 \\Rightarrow x = -1"
};

// 🎵 Voice Settings
const VOICE_SETTINGS = {
    standard: {
        voice_id: "21m00Tcm4TlvDq8ikWAM", // ElevenLabs voice ID for standard content
        name: "Standard Voice",
        description: "Clear, calm voice for reading main content"
    },
    technical: {
        voice_id: "AZnzlk1XvdvUeBnXmlld", // ElevenLabs voice ID for math content
        name: "Technical Voice",
        description: "Precise, technical voice for mathematical expressions"
    }
};

// 🌐 API Endpoints
const API_ENDPOINTS = {
    mathpix: 'https://api.mathpix.com/v3/text',
    elevenlabs: 'https://api.elevenlabs.io/v1/text-to-speech'
};

// ⚙️ Application Settings
const APP_SETTINGS = {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    supportedFormats: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    processingTimeout: 30000, // 30 seconds
    audioQuality: 'high',
    defaultVoice: 'standard'
};

// 🎨 UI Configuration
const UI_CONFIG = {
    theme: 'light',
    animations: true,
    accessibility: {
        highContrast: false,
        reducedMotion: false,
        largeText: false
    }
};

// 📊 Error Messages
const ERROR_MESSAGES = {
    apiKeyMissing: 'API keys not configured. Please check your config.js file.',
    fileTooLarge: 'File is too large. Please upload an image smaller than 10MB.',
    unsupportedFormat: 'Unsupported file format. Please upload JPG, PNG, GIF, or WebP.',
    apiError: 'API error occurred. Please try again.',
    networkError: 'Network error. Please check your internet connection.',
    processingTimeout: 'Processing took too long. Please try again.'
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        MATHPIX_APP_ID,
        MATHPIX_APP_KEY,
        ELEVENLABS_API_KEY,
        DEMO_MODE,
        DEMO_CONTENT,
        VOICE_SETTINGS,
        API_ENDPOINTS,
        APP_SETTINGS,
        UI_CONFIG,
        ERROR_MESSAGES
    };
}
