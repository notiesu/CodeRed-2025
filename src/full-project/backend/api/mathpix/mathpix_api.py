from flask import Blueprint, request, jsonify
import requests
import base64
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Create tmp directory if it doesn't exist
os.makedirs('.tmp', exist_ok=True)

# Create a Blueprint
mathpix_bp = Blueprint('mathpix', __name__)

# Mathpix API configuration
MATHPIX_APP_ID = os.getenv('MATHPIX_APP_ID')
MATHPIX_APP_KEY = os.getenv('MATHPIX_APP_KEY')
MATHPIX_API_ENDPOINT = 'https://api.mathpix.com/v3/text'

def process_image(headers, payload):
    try:
        # # Check if file was uploaded
        # if 'image' not in request.files:
        #     return jsonify({"error": "No file provided"}), 400
        
        # file = request.files['image']
        # if file.filename == '':
        #     return jsonify({"error": "No file selected"}), 400
            
        # # Read the image file
        # image_data = file.read()
        # base64_image = base64.b64encode(image_data).decode('utf-8')
        
        # # Send to Mathpix API
        # headers = {
        #     'app_id': MATHPIX_APP_ID,
        #     'app_key': MATHPIX_APP_KEY,
        #     'Content-Type': 'application/json'
        # }
        
        # payload = {
        #     'src': f'data:image/jpeg;base64,{base64_image}',
        #     'formats': ['text', 'latex_styled', 'mathml'],
        #     'include_latex': True,
        #     'include_mathml': True
        # }
        
        response = requests.post(MATHPIX_API_ENDPOINT, headers=headers, json=payload)
        
        if response.status_code != 200:
            return jsonify({"error": f"Mathpix API error: {response.status_code}"}), response.status_code
            
        return jsonify(response.json())
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@mathpix_bp.route('/test-connection', methods=['GET'])
def test_connection():
    try:
        # Basic connection test
        if not MATHPIX_APP_ID or not MATHPIX_APP_KEY:
            return jsonify({
                'success': False,
                'error': 'Mathpix API credentials not configured'
            }), 401
            
        # Send a minimal request to test API connection
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
