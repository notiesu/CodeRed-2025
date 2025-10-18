// 🧮 LaTeX to Speech Converter
// This file converts mathematical LaTeX expressions into natural spoken language

// 📚 Sample math problems for demo mode
const SAMPLE_PROBLEMS = {
    quadratic: {
        latex: "x^2 + 2x + 1 = 0",
        speech: "The equation is x squared plus 2x plus 1 equals zero. This is a quadratic equation. To solve, we can factor it as (x plus 1) squared equals zero, which gives us x equals negative 1."
    },
    calculus: {
        latex: "\\int_0^\\infty e^{-x} dx",
        speech: "The integral from zero to infinity of e to the negative x, dx. This is an improper integral. The antiderivative of e to the negative x is negative e to the negative x. Evaluating from zero to infinity gives us 1."
    },
    trigonometry: {
        latex: "\\sin^2(x) + \\cos^2(x) = 1",
        speech: "Sine squared of x plus cosine squared of x equals 1. This is the fundamental trigonometric identity known as the Pythagorean identity."
    },
    statistics: {
        latex: "\\frac{\\sum(x - \\mu)^2}{n}",
        speech: "The sum of (x minus mu) squared, divided by n. This is the formula for variance in statistics, where mu is the mean and n is the sample size."
    }
};

// 🔧 Convert LaTeX to spoken text
function convertLatexToSpeech(latex) {
    if (!latex) return '';
    
    let speech = latex;
    
    // Common LaTeX patterns and their spoken equivalents
    const patterns = [
        // Superscripts
        { pattern: /\^(\d+)/g, replacement: ' to the power of $1' },
        { pattern: /\^(\w+)/g, replacement: ' to the $1' },
        { pattern: /\^\{([^}]+)\}/g, replacement: ' to the power of $1' },
        
        // Subscripts
        { pattern: /_(\d+)/g, replacement: ' sub $1' },
        { pattern: /_(\w+)/g, replacement: ' sub $1' },
        { pattern: /_\{([^}]+)\}/g, replacement: ' sub $1' },
        
        // Fractions
        { pattern: /\\frac\{([^}]+)\}\{([^}]+)\}/g, replacement: '($1) divided by ($2)' },
        { pattern: /\\frac\{([^}]+)\}\{([^}]+)\}/g, replacement: '$1 over $2' },
        
        // Integrals
        { pattern: /\\int_(\w+)\^(\w+)/g, replacement: 'integral from $1 to $2' },
        { pattern: /\\int/g, replacement: 'integral' },
        
        // Summations
        { pattern: /\\sum_(\w+)\^(\w+)/g, replacement: 'sum from $1 to $2' },
        { pattern: /\\sum/g, replacement: 'sum' },
        
        // Greek letters
        { pattern: /\\alpha/g, replacement: 'alpha' },
        { pattern: /\\beta/g, replacement: 'beta' },
        { pattern: /\\gamma/g, replacement: 'gamma' },
        { pattern: /\\delta/g, replacement: 'delta' },
        { pattern: /\\epsilon/g, replacement: 'epsilon' },
        { pattern: /\\theta/g, replacement: 'theta' },
        { pattern: /\\lambda/g, replacement: 'lambda' },
        { pattern: /\\mu/g, replacement: 'mu' },
        { pattern: /\\pi/g, replacement: 'pi' },
        { pattern: /\\sigma/g, replacement: 'sigma' },
        { pattern: /\\tau/g, replacement: 'tau' },
        { pattern: /\\phi/g, replacement: 'phi' },
        { pattern: /\\chi/g, replacement: 'chi' },
        { pattern: /\\psi/g, replacement: 'psi' },
        { pattern: /\\omega/g, replacement: 'omega' },
        
        // Functions
        { pattern: /\\sin/g, replacement: 'sine' },
        { pattern: /\\cos/g, replacement: 'cosine' },
        { pattern: /\\tan/g, replacement: 'tangent' },
        { pattern: /\\log/g, replacement: 'log' },
        { pattern: /\\ln/g, replacement: 'natural log' },
        { pattern: /\\exp/g, replacement: 'exponential' },
        
        // Operators
        { pattern: /\\cdot/g, replacement: 'times' },
        { pattern: /\\times/g, replacement: 'times' },
        { pattern: /\\div/g, replacement: 'divided by' },
        { pattern: /\\pm/g, replacement: 'plus or minus' },
        { pattern: /\\mp/g, replacement: 'minus or plus' },
        
        // Relations
        { pattern: /\\leq/g, replacement: 'less than or equal to' },
        { pattern: /\\geq/g, replacement: 'greater than or equal to' },
        { pattern: /\\neq/g, replacement: 'not equal to' },
        { pattern: /\\approx/g, replacement: 'approximately equal to' },
        { pattern: /\\equiv/g, replacement: 'equivalent to' },
        
        // Arrows
        { pattern: /\\rightarrow/g, replacement: 'implies' },
        { pattern: /\\leftarrow/g, replacement: 'implied by' },
        { pattern: /\\leftrightarrow/g, replacement: 'if and only if' },
        
        // Sets
        { pattern: /\\in/g, replacement: 'is an element of' },
        { pattern: /\\notin/g, replacement: 'is not an element of' },
        { pattern: /\\subset/g, replacement: 'is a subset of' },
        { pattern: /\\supset/g, replacement: 'is a superset of' },
        { pattern: /\\cup/g, replacement: 'union' },
        { pattern: /\\cap/g, replacement: 'intersection' },
        { pattern: /\\emptyset/g, replacement: 'empty set' },
        
        // Infinity and limits
        { pattern: /\\infty/g, replacement: 'infinity' },
        { pattern: /\\lim/g, replacement: 'limit' },
        
        // Parentheses and brackets
        { pattern: /\\left\(/g, replacement: 'open parenthesis' },
        { pattern: /\\right\)/g, replacement: 'close parenthesis' },
        { pattern: /\\left\[/g, replacement: 'open bracket' },
        { pattern: /\\right\]/g, replacement: 'close bracket' },
        
        // Clean up extra spaces
        { pattern: /\s+/g, replacement: ' ' },
        { pattern: /^\s+|\s+$/g, replacement: '' }
    ];
    
    // Apply all patterns
    patterns.forEach(({ pattern, replacement }) => {
        speech = speech.replace(pattern, replacement);
    });
    
    return speech;
}

// 🎯 Get sample problem by type
function getSampleProblem(type) {
    return SAMPLE_PROBLEMS[type] || {
        latex: "x^2 + 1 = 0",
        speech: "x squared plus 1 equals zero"
    };
}

// 🔍 Enhanced text processing for better speech
function enhanceTextForSpeech(text) {
    if (!text) return '';
    
    let enhanced = text;
    
    // Add pauses for better speech flow
    enhanced = enhanced.replace(/\./g, '. ');
    enhanced = enhanced.replace(/,/g, ', ');
    enhanced = enhanced.replace(/;/g, '; ');
    enhanced = enhanced.replace(/:/g, ': ');
    
    // Handle mathematical expressions in text
    enhanced = enhanced.replace(/\b(\d+)\^(\d+)\b/g, '$1 to the power of $2');
    enhanced = enhanced.replace(/\b(\w+)\^(\d+)\b/g, '$1 to the power of $2');
    
    // Clean up multiple spaces
    enhanced = enhanced.replace(/\s+/g, ' ').trim();
    
    return enhanced;
}

// 🎵 Generate speech text for different content types
function generateSpeechText(content, type = 'mixed') {
    let speechText = '';
    
    if (type === 'demo') {
        // Use predefined sample content
        const sampleType = content.problemType || 'quadratic';
        const sample = getSampleProblem(sampleType);
        speechText = sample.speech;
    } else {
        // Process real content
        const text = content.text || '';
        const latex = content.latex || '';
        
        // Convert LaTeX to speech
        const spokenMath = convertLatexToSpeech(latex);
        
        // Enhance regular text
        const enhancedText = enhanceTextForSpeech(text);
        
        // Combine text and math
        speechText = `${enhancedText} ${spokenMath}`.trim();
    }
    
    return speechText;
}

// Export functions for use in main script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        convertLatexToSpeech,
        getSampleProblem,
        enhanceTextForSpeech,
        generateSpeechText,
        SAMPLE_PROBLEMS
    };
}
