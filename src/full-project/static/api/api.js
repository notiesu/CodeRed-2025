// mathpix.js - Skeleton Mathpix client used by the frontend

/**
 * Process an image (base64) with Mathpix and return a simplified result
 * @param {string} base64Image - Base64 image string (no data: prefix)
 * @returns {Promise<Object>} - { text, latex, mathml }
 */
// If your frontend is served from a different origin than the Flask backend,
// set BASE_BACKEND_URL to 'http://localhost:5000' (or your backend URL).
const BASE_BACKEND_URL = '';

async function processPDF(fileOrBase64) {
    // If passed a File object, send it to the Flask backend which runs the
    // full pipeline: Mathpix -> Gemini -> ElevenLabs and returns transcript + audio
    try {
        if (fileOrBase64 instanceof File) {
            const form = new FormData();
            form.append('image', fileOrBase64);

            const url = (BASE_BACKEND_URL || '') + '/image-to-speech';
            const resp = await fetch(url, {
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
                console.log('Mathpix response:', j);
                // If the backend embedded audio as base64 string, convert it to Blob
                if (j.audio_base64 && typeof j.audio_base64 === 'string') {
                    const byteChars = atob(j.audio_base64);
                    const byteNumbers = new Array(byteChars.length);
                    for (let i = 0; i < byteChars.length; i++) {
                        byteNumbers[i] = byteChars.charCodeAt(i);
                    }
                    const byteArray = new Uint8Array(byteNumbers);
                    const blob = new Blob([byteArray], { type: `audio/${j.audio_format || 'wav'}` });
                    return { text: j.transcript || '', latex: j.latex || '', audio: blob };
                }

                console.log('Warning: No audio returned from backend JSON.');
                return { text: j.transcript || '', latex: j.latex || '', audio: null };
            }

            // If backend returned binary (audio file), convert to Blob and try to extract transcript
            const blob = await resp.blob();
            // Some backends may include a transcript in a header; try to parse it if present
            const transcriptHeader = resp.headers.get('x-transcript') || '';
            return { text: transcriptHeader, latex: '', audio: blob };
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
    processPDF,
    processMathpixResponse,
    validateMathpixConfig,
    testMathpixConnection,
    getMathpixUsage
};
