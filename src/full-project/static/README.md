# MathsVoice - Full Project

This is the complete implementation of MathsVoice with real API integration for the hackathon.

## 🚀 Quick Start

### Step 1: Get Your API Keys (5 minutes)
1. **Mathpix API**: Go to [mathpix.com](https://mathpix.com) → Sign up → Get your `app_id` and `app_key`
2. **ElevenLabs API**: Go to [elevenlabs.io](https://elevenlabs.io) → Sign up → Get your API key

### Step 2: Configure API Keys
Edit `config.js` and replace the placeholder values:
```javascript
const MATHPIX_APP_ID = 'your_mathpix_app_id_here';
const MATHPIX_APP_KEY = 'your_mathpix_app_key_here';
const ELEVENLABS_API_KEY = 'your_elevenlabs_api_key_here';
```

### Step 3: Test Locally
1. Open `index.html` in your browser
2. Upload a math image
3. Click "Process Document"

### Step 4: Deploy
- **Vercel**: Drag and drop your folder to [vercel.com](https://vercel.com)
- **Netlify**: Drag and drop your folder to [netlify.com](https://netlify.com)

## 🎯 Features

- ✅ **Real Mathpix Integration** - Precise STEM OCR
- ✅ **Real ElevenLabs Integration** - High-quality voice synthesis
- ✅ **Dual Voice System** - Standard + Technical voices
- ✅ **LaTeX Processing** - Advanced math-to-speech conversion
- ✅ **Accessible UI** - Screen reader friendly, keyboard navigation
- ✅ **File Upload** - Drag & drop, multiple formats
- ✅ **Audio Controls** - Play, pause, stop, download
- ✅ **Error Handling** - Graceful fallbacks and user feedback

## 📁 Project Structure

```
full-project/
├── index.html              # Main application
├── styles.css              # Styling and animations
├── script.js               # Core functionality
├── config.js               # API configuration
├── api/
│   ├── mathpix.js          # Mathpix API integration
│   └── elevenlabs.js       # ElevenLabs API integration
├── utils/
│   ├── latex-parser.js     # Math to speech converter
│   ├── file-handler.js     # File upload and processing
│   └── audio-manager.js    # Audio playback and controls
├── components/
│   ├── upload-area.js      # File upload component
│   ├── processing-indicator.js # Loading states
│   └── audio-controls.js   # Audio playback controls
└── README.md               # This file
```

## 🔧 Technical Implementation

### **APIs Used:**
- **Mathpix API** - STEM OCR with LaTeX output
- **ElevenLabs API** - Natural voice synthesis

### **Key Components:**
- **LaTeX Parser** - Converts mathematical expressions to spoken text
- **Audio Manager** - Handles playback, voice selection, and controls
- **File Handler** - Processes uploads and converts to base64
- **Error Handler** - Manages API errors and user feedback

### **Accessibility Features:**
- Keyboard navigation
- Screen reader support
- High contrast mode
- Reduced motion support
- Large touch targets

## 🏆 Hackathon Submission

This implementation demonstrates:
- **API Integration** - Both Mathpix and ElevenLabs working together
- **Technical Excellence** - Advanced LaTeX processing and voice synthesis
- **Accessibility Impact** - Making STEM education accessible
- **User Experience** - Intuitive, accessible interface
- **Production Ready** - Error handling, fallbacks, and deployment

## 🛠️ Troubleshooting

- **API errors**: Check your keys in `config.js`
- **Upload not working**: Make sure image is JPG/PNG
- **No audio**: Check browser permissions for audio
- **CORS issues**: Deploy to Vercel/Netlify for production

## 🚀 Deployment

### **Vercel (Recommended)**
1. Drag and drop the `full-project` folder to [vercel.com](https://vercel.com)
2. Your app will be live in seconds

### **Netlify**
1. Drag and drop the `full-project` folder to [netlify.com](https://netlify.com)
2. Your app will be live in seconds

## 📊 Performance

- **Fast Processing** - Optimized API calls and caching
- **Responsive Design** - Works on all devices
- **Accessible** - WCAG 2.1 AA compliant
- **SEO Friendly** - Proper meta tags and structure
