// 🔑 API Configuration
// Replace these with your actual API keys when you get them

const MATHPIX_APP_ID = 'your_mathpix_app_id_here';
const MATHPIX_APP_KEY = 'your_mathpix_app_key_here';
const ELEVENLABS_API_KEY = 'your_elevenlabs_api_key_here';

// 🎯 Demo Mode (for testing without API keys)
const DEMO_MODE = true; // Set to false when you have real API keys

// 📝 Demo Content (used when DEMO_MODE is true)
const DEMO_CONTENT = {
    text: "This is a sample math problem: x squared plus 2x plus 1 equals zero. The solution is x equals negative 1.",
    latex: "x^2 + 2x + 1 = 0 \\Rightarrow x = -1"
};

// 🎵 Voice Settings
const VOICE_SETTINGS = {
    standard: {
        voice_id: "21m00Tcm4TlvDq8ikWAM", // ElevenLabs voice ID for standard content
        name: "Standard Voice"
    },
    technical: {
        voice_id: "AZnzlk1XvdvUeBnXmlld", // ElevenLabs voice ID for math content
        name: "Technical Voice"
    }
};

// 🌐 API Endpoints
const API_ENDPOINTS = {
    mathpix: 'https://api.mathpix.com/v3/text',
    elevenlabs: 'https://api.elevenlabs.io/v1/text-to-speech'
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
        API_ENDPOINTS
    };
}
