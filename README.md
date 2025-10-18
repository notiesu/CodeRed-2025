# MathsVoice - Accessible STEM Learning

Making STEM education accessible through AI-powered voice narration.

## 🎯 Project Concept

**MathsVoice** is a web application that transforms complex STEM documents into accessible audio explanations for students with visual impairments, dyslexia, or learning disabilities.

### How It Works:
1. **Upload** - User uploads an image of a STEM document (textbook, worksheet, exam)
2. **OCR** - Mathpix API reads and structures mathematical content with precise LaTeX
3. **Convert** - LaTeX symbols are converted to natural spoken language
4. **Narrate** - ElevenLabs API generates high-quality voice narration
5. **Access** - Students can learn independently with clear audio explanations

### Key Features:
- **Dual Voice System** - Standard voice for text, technical voice for math
- **Accessible UI** - Keyboard navigation, screen reader friendly
- **Real-time Processing** - Upload → Process → Listen workflow
- **High Accuracy** - Mathpix's precise STEM OCR + ElevenLabs' natural speech

## 🏆 Why This Wins the Accessibility Track

- **Solves Real Problem** - Makes STEM education accessible to millions
- **API Synergy** - Requires genuine integration of both Mathpix and ElevenLabs
- **High Impact** - Could significantly lower barriers to STEM learning
- **Technical Excellence** - Advanced LaTeX processing and voice synthesis

## 📁 Project Structure

```
src/
├── proof-of-concept/          # Working demo without API keys
│   ├── index.html            # Demo application
│   ├── styles.css            # Styling
│   ├── script.js             # Core functionality
│   ├── config.js             # API configuration
│   ├── utils/
│   │   └── latex-parser.js   # Math to speech converter
│   └── README.md             # Demo instructions
│
└── full-project/             # Complete implementation
    ├── index.html            # Main application
    ├── styles.css            # Styling
    ├── script.js             # Core functionality
    ├── config.js             # API configuration
    ├── api/
    │   ├── mathpix.js        # Mathpix API integration
    │   └── elevenlabs.js     # ElevenLabs API integration
    ├── utils/
    │   ├── latex-parser.js   # Math to speech converter
    │   ├── file-handler.js   # File upload and processing
    │   └── audio-manager.js  # Audio playback and controls
    ├── components/
    │   ├── upload-area.js    # File upload component
    │   ├── processing-indicator.js # Loading states
    │   └── audio-controls.js # Audio playback controls
    └── README.md             # Full implementation guide
```

## 🚀 Quick Start

### Option 1: Proof of Concept (No API Keys Needed)
1. Open `src/proof-of-concept/index.html` in your browser
2. Try the sample math problems
3. Test the complete workflow

### Option 2: Full Implementation
1. Get API keys from Mathpix and ElevenLabs
2. Edit `src/full-project/config.js` with your keys
3. Open `src/full-project/index.html` in your browser
4. Upload a real math document

## 🛠️ Tech Stack

- **Frontend**: HTML/CSS/JavaScript
- **APIs**: Mathpix (STEM OCR) + ElevenLabs (Voice Synthesis)
- **Deployment**: Vercel/Netlify (drag & drop)
- **Architecture**: Modular components with clean separation

## 🎯 Ready for Hackathon

Both implementations are complete and ready to use:
- **Proof of Concept**: Test immediately without setup
- **Full Project**: Production-ready with real API integration