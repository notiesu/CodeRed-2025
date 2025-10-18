// 📊 Mathpix API Integration
// This file handles all interactions with the Mathpix API for STEM OCR

/**
 * Process an image with Mathpix API to extract mathematical content
 * @param {string} base64Image - Base64 encoded image data
 * @param {Object} options - Processing options
 * @returns {Promise<Object>} - Mathpix API response
 */
async function processWithMathpix(base64Image, options = {}) {
    const defaultOptions = {
        formats: ['text', 'latex_styled', 'mathml'],
        include_latex: true,
        include_mathml: true,
        include_table_html: true,
        include_svg: false
    };
    
    const requestOptions = { ...defaultOptions, ...options };
    
    try {
        const response = await fetch(API_ENDPOINTS.mathpix, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'app_id': MATHPIX_APP_ID,
                'app_key': MATHPIX_APP_KEY
            },
            body: JSON.stringify({
                src: `data:image/jpeg;base64,${base64Image}`,
                ...requestOptions
            })
        });
        
        if (!response.ok) {
            throw new Error(`Mathpix API error: ${response.status} ${response.statusText}`);
        }
        
        const result = await response.json();
        return processMathpixResponse(result);
        
    } catch (error) {
        console.error('Mathpix API error:', error);
        throw new Error(`Failed to process image with Mathpix: ${error.message}`);
    }
}

/**
 * Process and clean up Mathpix API response
 * @param {Object} response - Raw Mathpix API response
 * @returns {Object} - Processed response
 */
function processMathpixResponse(response) {
    return {
        text: response.text || '',
        latex: response.latex_styled || '',
        mathml: response.mathml || '',
        confidence: response.confidence || 0,
        error: response.error || null,
        raw: response
    };
}

/**
 * Validate Mathpix API configuration
 * @returns {boolean} - True if configuration is valid
 */
function validateMathpixConfig() {
    if (!MATHPIX_APP_ID || MATHPIX_APP_ID === 'your_mathpix_app_id_here') {
        throw new Error('Mathpix APP_ID not configured');
    }
    
    if (!MATHPIX_APP_KEY || MATHPIX_APP_KEY === 'your_mathpix_app_key_here') {
        throw new Error('Mathpix APP_KEY not configured');
    }
    
    return true;
}

/**
 * Test Mathpix API connection
 * @returns {Promise<boolean>} - True if connection is successful
 */
async function testMathpixConnection() {
    try {
        validateMathpixConfig();
        
        // Test with a simple image (1x1 pixel)
        const testImage = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
        
        const response = await fetch(API_ENDPOINTS.mathpix, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'app_id': MATHPIX_APP_ID,
                'app_key': MATHPIX_APP_KEY
            },
            body: JSON.stringify({
                src: `data:image/png;base64,${testImage}`,
                formats: ['text']
            })
        });
        
        return response.ok;
        
    } catch (error) {
        console.error('Mathpix connection test failed:', error);
        return false;
    }
}

/**
 * Get Mathpix API usage statistics
 * @returns {Promise<Object>} - Usage statistics
 */
async function getMathpixUsage() {
    try {
        const response = await fetch('https://api.mathpix.com/v3/usage', {
            method: 'GET',
            headers: {
                'app_id': MATHPIX_APP_ID,
                'app_key': MATHPIX_APP_KEY
            }
        });
        
        if (!response.ok) {
            throw new Error(`Failed to get usage stats: ${response.status}`);
        }
        
        return await response.json();
        
    } catch (error) {
        console.error('Failed to get Mathpix usage:', error);
        return null;
    }
}

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        processWithMathpix,
        processMathpixResponse,
        validateMathpixConfig,
        testMathpixConnection,
        getMathpixUsage
    };
}
