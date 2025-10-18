# MathsVoice - Proof of Concept

This is a working proof of concept that demonstrates the core functionality of MathsVoice without requiring API keys.

## 🚀 Quick Start

1. **Open the application**: Open `index.html` in your browser
2. **Try sample problems**: Click on any of the sample math problems
3. **Test file upload**: Upload an image (demo mode will use sample content)
4. **Listen to narration**: Click "Play Narration" to hear the audio

## 🎭 Demo Features

- ✅ **Sample Math Problems** - Quadratic, Calculus, Trigonometry, Statistics
- ✅ **LaTeX to Speech Conversion** - See how math symbols become spoken text
- ✅ **Web Speech API** - Browser's built-in voice synthesis
- ✅ **Complete UI** - Full user interface with accessibility features
- ✅ **File Upload** - Drag & drop or click to upload
- ✅ **Voice Selection** - Standard vs Technical voice options

## 🎯 What This Demonstrates

1. **User Experience** - How students will interact with the application
2. **LaTeX Processing** - How mathematical expressions are converted to speech
3. **Accessibility** - Keyboard navigation, screen reader support
4. **Workflow** - Upload → Process → Listen → Download

## 🔧 Technical Implementation

- **Frontend**: HTML/CSS/JavaScript
- **Math Processing**: Custom LaTeX parser
- **Audio**: Web Speech API (demo) / ElevenLabs (production)
- **Styling**: Modern, accessible design with animations

## 🏆 Hackathon Presentation

This proof of concept is perfect for demonstrating:
- The accessibility problem being solved
- The technical approach and API integration
- The user experience and interface design
- The potential impact on STEM education

## 📁 File Structure

```
proof-of-concept/
├── index.html          # Main application
├── styles.css          # Styling and animations
├── script.js           # Core functionality
├── config.js           # API configuration
├── utils/
│   └── latex-parser.js # Math to speech converter
└── README.md           # This file
```

## 🚀 Next Steps

When ready for the full implementation:
1. Get API keys from Mathpix and ElevenLabs
2. Update `config.js` with real keys
3. Toggle demo mode OFF
4. Deploy to Vercel/Netlify
