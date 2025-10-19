
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

// Export for use in other files (ES module syntax)
export {
    VOICE_SETTINGS,
    APP_SETTINGS,
    UI_CONFIG,
    ERROR_MESSAGES
};
