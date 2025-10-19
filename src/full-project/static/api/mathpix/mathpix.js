// mathpix.js - Skeleton Mathpix client used by the frontend

/**
 * Process an image (base64) with Mathpix and return a simplified result
 * @param {string} base64Image - Base64 image string (no data: prefix)
 * @returns {Promise<Object>} - { text, latex, mathml }
 */
async function processWithMathpix(fileOrBase64) {
    // If passed a File object, send it to the Flask backend which runs the
    // full pipeline: Mathpix -> Gemini -> ElevenLabs and returns transcript + audio
    try {
        if (fileOrBase64 instanceof File) {
            const form = new FormData();
            form.append('image', fileOrBase64);

            const resp = await fetch('/image-to-speech', {
                method: 'POST',
                body: form
            });

            if (!resp.ok) {
                const txt = await resp.text();
                throw new Error(`Backend error: ${resp.status} ${txt}`);
            }

            // The backend returns JSON with transcript and audio (audio returned via send_file)
            // Some backends may return a multipart response; here we assume JSON where
            // `audio` is a binary file path or direct binary; handle common cases.
            const contentType = resp.headers.get('content-type') || '';
            if (contentType.includes('application/json')) {
                const j = await resp.json();
                // If the backend embedded audio as base64 string, convert it to Blob
                if (j.audio && typeof j.audio === 'string' && j.audio.startsWith('data:')) {
                    // data URL -> Blob
                    const parts = j.audio.split(',');
                    const meta = parts[0];
                    const b64 = parts[1];
                    const byteChars = atob(b64);
                    const byteNumbers = new Array(byteChars.length);
                    for (let i = 0; i < byteChars.length; i++) {
                        byteNumbers[i] = byteChars.charCodeAt(i);
                    }
                    const byteArray = new Uint8Array(byteNumbers);
                    const blob = new Blob([byteArray], { type: meta.split(':')[1].split(';')[0] });
                    return { text: j.transcript || '', latex: j.latex || '', audio: blob };
                }

                return { text: j.transcript || '', latex: j.latex || '', audio: null };
            }

            // If backend returned binary (audio file), convert to Blob and try to extract transcript from headers
            const blob = await resp.blob();
            // Attempt to read a transcript header (custom) or call /test-connection separately
            return { text: '', latex: '', audio: blob };
        }

        // Fallback: if caller passed a base64 string, call Mathpix directly (not used when backend present)
        return {
            text: 'Detected text placeholder',
            latex: '\\frac{a}{b}',
            mathml: '<math></math>'
        };
    } catch (err) {
        console.error('processWithMathpix error:', err);
        throw err;
    }
}

/**
 * Convert raw Mathpix API response to a normalized object
 */
function processMathpixResponse(response) {
    return {
        text: response.text || '',
        latex: response.latex || '',
        mathml: response.mathml || '',
        raw: response
    };
}

/**
 * Validate Mathpix configuration
 * Throws if config is invalid
 */
function validateMathpixConfig() {
    // TODO: check config values (import from config.js if present)
    return true;
}

/**
 * Test Mathpix API connectivity
 * @returns {Promise<boolean>}
 */
async function testMathpixConnection() {
    // Skeleton: perform a lightweight test or return true
    return true;
}

/**
 * Get Mathpix usage information
 */
async function getMathpixUsage() {
    // Skeleton: fetch usage from Mathpix or return null
    return null;
}

export {
    processWithMathpix,
    processMathpixResponse,
    validateMathpixConfig,
    testMathpixConnection,
    getMathpixUsage
};
