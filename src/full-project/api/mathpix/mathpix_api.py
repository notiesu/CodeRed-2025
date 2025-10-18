from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import base64
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Create tmp directory if it doesn't exist
os.makedirs('.tmp', exist_ok=True)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Mathpix API configuration
MATHPIX_APP_ID = os.getenv('MATHPIX_APP_ID')
MATHPIX_APP_KEY = os.getenv('MATHPIX_APP_KEY')
MATHPIX_API_ENDPOINT = 'https://api.mathpix.com/v3/text'

@app.route('/process-image', methods=['POST'])
def process_image():
    try:
        # Check if file was uploaded
        if 'image' not in request.files:
            return jsonify({"error": "No file provided"}), 400
        
        file = request.files['image']
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        # Check if file is an image
        if not file.content_type.startswith('image/'):
            return jsonify({"error": "File must be an image"}), 400
            
        # Read the image file
        image_data = file.read()
        base64_image = base64.b64encode(image_data).decode('utf-8')
        
        # Send to Mathpix API
        headers = {
            'app_id': MATHPIX_APP_ID,
            'app_key': MATHPIX_APP_KEY,
            'Content-Type': 'application/json'
        }
        
        payload = {
            'src': f'data:{file.content_type};base64,{base64_image}',
            'formats': ['text', 'latex_styled', 'mathml'],
            'include_latex': True,
            'include_mathml': True
        }
        
        response = requests.post(MATHPIX_API_ENDPOINT, headers=headers, json=payload)
        
        if response.status_code != 200:
            return jsonify({
                "success": False,
                "error": f"Mathpix API error: {response.status_code}"
            }), response.status_code
            
        result = response.json()
        return jsonify({
            "success": True,
            "text": result.get('text', ''),
            "latex": result.get('latex_styled', ''),
            "mathml": result.get('mathml', ''),
            "confidence": result.get('confidence', 0)
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/test-connection', methods=['GET'])
def test_connection():
    try:
        if not MATHPIX_APP_ID or not MATHPIX_APP_KEY:
            return jsonify({
                'success': False,
                'error': 'Mathpix API credentials not configured'
            }), 401
            
        headers = {
            'app_id': MATHPIX_APP_ID,
            'app_key': MATHPIX_APP_KEY
        }
        
        response = requests.get('https://api.mathpix.com/v3/usage', headers=headers)
        
        return jsonify({
            'success': response.status_code == 200,
            'status': response.status_code
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    # Check if API credentials are configured
    if not MATHPIX_APP_ID or not MATHPIX_APP_KEY:
        print("Warning: Mathpix API credentials not configured!")
        print("Please set MATHPIX_APP_ID and MATHPIX_APP_KEY environment variables.")
    
    # Run the Flask app
    app.run(debug=True, port=5000)