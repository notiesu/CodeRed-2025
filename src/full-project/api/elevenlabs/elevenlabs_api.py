from flask import Flask, request, jsonify, send_file
from dotenv import load_dotenv
from elevenlabs.client import ElevenLabs
from elevenlabs import save
import os

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Initialize ElevenLabs client
elevenlabs = ElevenLabs(
  api_key=os.getenv("ELEVENLABS_API_KEY"),
)

@app.route('/text-to-speech', methods=['POST'])
def text_to_speech():
  try:
    # Get JSON data from the request
    data = request.get_json()
    text = data.get('text', 'Hi')
    voice_id = data.get('voice_id', 'JBFqnCBsd6RMkjVDRZzb')
    model_id = data.get('model_id', 'eleven_multilingual_v2')
    output_format = data.get('output_format', 'mp3_44100_128')

    # Convert text to speech
    audio = elevenlabs.text_to_speech.convert(
      text=text,
      voice_id=voice_id,
      model_id=model_id,
      output_format=output_format,
    )

    # Save the audio file
    output_path = ".tmp/output.wav"
    save(audio, output_path)

    # Return the audio file as a response
    return send_file(output_path, as_attachment=True)

  except Exception as e:
    return jsonify({"error": str(e)}), 500

# Run the Flask app
if __name__ == '__main__':
  app.run(debug=True)
