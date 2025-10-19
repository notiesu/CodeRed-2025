// elevenlabs.js - Frontend client that talks to the Flask backend for ElevenLabs
// The backend exposes endpoints like /text-to-speech, /create-math-audio and /ping

/**
 * Generate audio from text using Flask server (/text-to-speech)
 * @param {string} text
 * @param {string} voiceId
 * @param {Object} options
 * @returns {Promise<Blob>}
 */
async function generateAudioWithFlask(text, voiceId, options = {}) {
    const resp = await fetch('/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voiceId, options })
    });

    if (!resp.ok) throw new Error(`Text-to-speech failed: ${resp.status}`);
    return await resp.blob();
}

/**
 * Test backend connection (/ping)
 * @returns {Promise<boolean>}
 */
async function testFlaskConnection() {
    try {
        const resp = await fetch('/ping');
        return resp.ok;
    } catch (err) {
        console.error('Flask ping failed:', err);
        return false;
    }
}

/**
 * Get usage stats from backend (/usage)
 */
async function getFlaskUsage() {
    try {
        const resp = await fetch('/usage');
        if (!resp.ok) throw new Error(`Usage fetch failed: ${resp.status}`);
        return await resp.json();
    } catch (err) {
        console.error('getFlaskUsage error:', err);
        return null;
    }
}

/**
 * Create math audio using backend endpoint (/create-math-audio). Falls back to
 * /text-to-speech if backend doesn't support create-math-audio.
 */
async function createMathAudio(text, voiceType = 'standard') {
    try {
        const resp = await fetch('/create-math-audio', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, voiceType })
        });

        if (!resp.ok) {
            // fallback to generic text-to-speech
            console.warn('create-math-audio failed, falling back to /text-to-speech', resp.status);
            return await generateAudioWithFlask(text, null, { voiceType });
        }

        return await resp.blob();
    } catch (err) {
        console.error('createMathAudio error:', err);
        return await generateAudioWithFlask(text, null, { voiceType });
    }
}

/**
 * Validate ElevenLabs config client-side (noop when using backend)
 */
function validateElevenLabsConfig() {
    // When using backend, client-side validation is minimal
    return true;
}

/**
 * Test ElevenLabs connection via backend (re-uses ping)
 */
async function testElevenLabsConnection() {
    return await testFlaskConnection();
}

export {
    validateElevenLabsConfig,
    createMathAudio,
    testElevenLabsConnection,
    generateAudioWithFlask,
    testFlaskConnection,
    getFlaskUsage
};

