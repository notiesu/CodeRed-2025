from flask import jsonify, send_file, Blueprint
from dotenv import load_dotenv
from elevenlabs import ElevenLabs
from elevenlabs import save
import os

# Load environment variables
load_dotenv()

elevenlabs_bp = Blueprint('elevenlabs', __name__)

elevenlabs = ElevenLabs(
  api_key=os.getenv("ELEVENLABS_API_KEY"),
)

def text_to_speech(text, voice_id="JBFqnCBsd6RMkjVDRZzb", model_id="eleven_multilingual_v2", output_format="mp3_44100_128"):
  try:
    # # Get JSON data from the request
    # data = request.get_json()
    # text = data.get('text', 'Hi')
    # voice_id = data.get('voice_id', 'JBFqnCBsd6RMkjVDRZzb')
    # model_id = data.get('model_id', 'eleven_multilingual_v2')
    # output_format = data.get('output_format', 'mp3_44100_128')

    # Convert text to speech
    audio = elevenlabs.text_to_speech.convert(
      text=text,
      voice_id=voice_id,
      model_id=model_id,
      output_format=output_format,
    )

    # Save the audio file
    tmp_dir = os.path.join(os.path.dirname(__file__), ".tmp")
    os.makedirs(tmp_dir, exist_ok=True)
    output_path = os.path.join(tmp_dir, "output." + output_format.split('_')[0])

    save(audio, output_path)

    # Return the audio file as a response
    return send_file(output_path, as_attachment=True)

  except Exception as e:
    return jsonify({"error": str(e)}), 500



