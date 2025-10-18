from flask import Flask, request, jsonify
from api.mathpix.mathpix_api import mathpix_bp, process_image
from api.elevenlabs.elevenlabs_api import elevenlabs_bp, text_to_speech
from api.gemini.gemini_api import gemini_bp, generate_content
import base64
import os

app = Flask(__name__)

# Register blueprints
app.register_blueprint(mathpix_bp)
app.register_blueprint(elevenlabs_bp)
app.register_blueprint(gemini_bp)

MATHPIX_APP_ID = os.getenv('MATHPIX_APP_ID')
MATHPIX_APP_KEY = os.getenv('MATHPIX_APP_KEY')


@app.route('/image-to-speech', methods=['POST'])
def image_to_speech():
    # Check if file was uploaded
    if 'image' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400
        
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
        'src': f'data:image/jpeg;base64,{base64_image}',
        'formats': ['text', 'latex_styled', 'mathml'],
        'include_latex': True,
        'include_mathml': True
    }
    
    #overall input - pdf/image file
    #overall output - audio file
    mathpix_output = process_image(headers, payload)
    print(mathpix_output)

    #input - text
    #input - text
    math_content = mathpix_output.get_json().get("content", "")
    gemini_output = generate_content(math_content)

    #extract speech
    speech_content = gemini_output.get_json().get("response", "")
    elevenlabs_output = process(speech_content)
    return elevenlabs_output

if __name__ == '__main__':
    app.run(debug=True)