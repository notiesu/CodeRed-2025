// 🎵 ElevenLabs API Integration
// This file handles all interactions with the ElevenLabs API for voice synthesis

/**
 * Generate audio from text using ElevenLabs API
 * @param {string} text - Text to convert to speech
 * @param {string} voiceId - Voice ID to use
 * @param {Object} options - Voice options
 * @returns {Promise<Blob>} - Audio blob
 */
async function generateAudioWithElevenLabs(text, voiceId, options = {}) {
    const defaultOptions = {
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
            style: 0.0,
            use_speaker_boost: true
        }
    };
    
    const requestOptions = { ...defaultOptions, ...options };
    
    try {
        const response = await fetch(`${API_ENDPOINTS.elevenlabs}/${voiceId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'xi-api-key': ELEVENLABS_API_KEY
            },
            body: JSON.stringify({
                text: text,
                ...requestOptions
            })
        });
        
        if (!response.ok) {
            throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText}`);
        }
        
        return await response.blob();
        
    } catch (error) {
        console.error('ElevenLabs API error:', error);
        throw new Error(`Failed to generate audio: ${error.message}`);
    }
}

/**
 * Get available voices from ElevenLabs
 * @returns {Promise<Array>} - Array of available voices
 */
async function getAvailableVoices() {
    try {
        const response = await fetch('https://api.elevenlabs.io/v1/voices', {
            method: 'GET',
            headers: {
                'xi-api-key': ELEVENLABS_API_KEY
            }
        });
        
        if (!response.ok) {
            throw new Error(`Failed to get voices: ${response.status}`);
        }
        
        const data = await response.json();
        return data.voices || [];
        
    } catch (error) {
        console.error('Failed to get voices:', error);
        return [];
    }
}

/**
 * Get voice details by ID
 * @param {string} voiceId - Voice ID
 * @returns {Promise<Object>} - Voice details
 */
async function getVoiceDetails(voiceId) {
    try {
        const response = await fetch(`https://api.elevenlabs.io/v1/voices/${voiceId}`, {
            method: 'GET',
            headers: {
                'xi-api-key': ELEVENLABS_API_KEY
            }
        });
        
        if (!response.ok) {
            throw new Error(`Failed to get voice details: ${response.status}`);
        }
        
        return await response.json();
        
    } catch (error) {
        console.error('Failed to get voice details:', error);
        return null;
    }
}

/**
 * Validate ElevenLabs API configuration
 * @returns {boolean} - True if configuration is valid
 */
function validateElevenLabsConfig() {
    if (!ELEVENLABS_API_KEY || ELEVENLABS_API_KEY === 'your_elevenlabs_api_key_here') {
        throw new Error('ElevenLabs API key not configured');
    }
    
    return true;
}

/**
 * Test ElevenLabs API connection
 * @returns {Promise<boolean>} - True if connection is successful
 */
async function testElevenLabsConnection() {
    try {
        validateElevenLabsConfig();
        
        const response = await fetch('https://api.elevenlabs.io/v1/voices', {
            method: 'GET',
            headers: {
                'xi-api-key': ELEVENLABS_API_KEY
            }
        });
        
        return response.ok;
        
    } catch (error) {
        console.error('ElevenLabs connection test failed:', error);
        return false;
    }
}

/**
 * Get ElevenLabs API usage statistics
 * @returns {Promise<Object>} - Usage statistics
 */
async function getElevenLabsUsage() {
    try {
        const response = await fetch('https://api.elevenlabs.io/v1/user', {
            method: 'GET',
            headers: {
                'xi-api-key': ELEVENLABS_API_KEY
            }
        });
        
        if (!response.ok) {
            throw new Error(`Failed to get usage stats: ${response.status}`);
        }
        
        return await response.json();
        
    } catch (error) {
        console.error('Failed to get ElevenLabs usage:', error);
        return null;
    }
}

/**
 * Create audio with specific voice settings for math content
 * @param {string} text - Text to convert
 * @param {string} voiceType - 'standard' or 'technical'
 * @returns {Promise<Blob>} - Audio blob
 */
async function createMathAudio(text, voiceType = 'standard') {
    const voiceId = VOICE_SETTINGS[voiceType]?.voice_id;
    
    if (!voiceId) {
        throw new Error(`Invalid voice type: ${voiceType}`);
    }
    
    // Adjust voice settings based on content type
    const voiceSettings = {
        standard: {
            stability: 0.5,
            similarity_boost: 0.5,
            style: 0.0,
            use_speaker_boost: true
        },
        technical: {
            stability: 0.7,
            similarity_boost: 0.8,
            style: 0.2,
            use_speaker_boost: true
        }
    };
    
    return await generateAudioWithElevenLabs(text, voiceId, {
        voice_settings: voiceSettings[voiceType]
    });
}

/**
 * Stream audio generation for long texts
 * @param {string} text - Text to convert
 * @param {string} voiceId - Voice ID
 * @param {Function} onChunk - Callback for each audio chunk
 * @returns {Promise<Blob>} - Complete audio blob
 */
async function streamAudioGeneration(text, voiceId, onChunk) {
    try {
        const response = await fetch(`${API_ENDPOINTS.elevenlabs}/${voiceId}/stream`, {
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
            throw new Error(`Streaming failed: ${response.status}`);
        }
        
        const reader = response.body.getReader();
        const chunks = [];
        
        while (true) {
            const { done, value } = await reader.read();
            
            if (done) break;
            
            chunks.push(value);
            if (onChunk) onChunk(value);
        }
        
        return new Blob(chunks, { type: 'audio/mpeg' });
        
    } catch (error) {
        console.error('Streaming audio generation failed:', error);
        throw error;
    }
}

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateAudioWithElevenLabs,
        getAvailableVoices,
        getVoiceDetails,
        validateElevenLabsConfig,
        testElevenLabsConnection,
        getElevenLabsUsage,
        createMathAudio,
        streamAudioGeneration
    };
}
