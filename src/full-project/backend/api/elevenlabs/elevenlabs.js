// 🎵 Flask Server Integration
// This file handles all interactions with the Flask server for voice synthesis

/**
 * Generate audio from text using Flask server
 * @param {string} text - Text to convert to speech
 * @param {string} voiceId - Voice ID to use
 * @param {Object} options - Voice options
 * @returns {Promise<Blob>} - Audio blob
 */
async function generateAudioWithFlask(text, voiceId, options = {}) {
    try {
        const response = await fetch(`http://localhost:5000/text-to-speech`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: text,
                voiceId: voiceId,
                options: options
            })
        });
        
        if (!response.ok) {
            throw new Error(`Flask server error: ${response.status} ${response.statusText}`);
        }
        
        return await response.blob();
        
    } catch (error) {
        console.error('Flask server error:', error);
        throw new Error(`Failed to generate audio: ${error.message}`);
    }
}


/**
 * Test Flask server connection
 * @returns {Promise<boolean>} - True if connection is successful
 */
async function testFlaskConnection() {
    try {
        const response = await fetch('http://localhost:5000/ping', {
            method: 'GET'
        });
        
        return response.ok;
        
    } catch (error) {
        console.error('Flask connection test failed:', error);
        return false;
    }
}

/**
 * Get Flask server usage statistics
 * @returns {Promise<Object>} - Usage statistics
 */
async function getFlaskUsage() {
    try {
        const response = await fetch('http://localhost:5000/usage', {
            method: 'GET'
        });
        
        if (!response.ok) {
            throw new Error(`Failed to get usage stats: ${response.status}`);
        }
        
        return await response.json();
        
    } catch (error) {
        console.error('Failed to get Flask usage:', error);
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
    try {
        const response = await fetch(`http://localhost:5000/create-math-audio`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: text,
                voiceType: voiceType
            })
        });
        
        if (!response.ok) {
            throw new Error(`Failed to create math audio: ${response.status}`);
        }
        
        return await response.blob();
        
    } catch (error) {
        console.error('Failed to create math audio:', error);
        throw error;
    }
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
        const response = await fetch(`http://localhost:5000/stream-audio`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: text,
                voiceId: voiceId
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
        generateAudioWithFlask,
        getAvailableVoices,
        getVoiceDetails,
        testFlaskConnection,
        getFlaskUsage,
        createMathAudio,
        streamAudioGeneration
    };
}
