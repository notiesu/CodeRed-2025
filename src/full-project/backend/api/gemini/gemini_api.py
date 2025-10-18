from flask import Blueprint, jsonify
from google import genai
from flask import request
import os
from dotenv import load_dotenv

load_dotenv()

gemini_bp = Blueprint('gemini_api', __name__)

SYSTEM_PROMPT = "\
I am giving you a text file that contains mathematical content extracted from images or PDFs.\
Please summarize this and prepare it as a script (maximum of two minutes for someone to speak) to teach a human student. Here is the content:\
"
def generate_content(content):

    # content = request.args.get('content', default='', type=str)
    if not content:
        return jsonify({"error": "Content parameter is required"}), 400
    
    full_prompt = f"{SYSTEM_PROMPT}\n\n{content}"
    # Replace 'your_api_key_here' with your actual API key
    client = genai.Client()
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=full_prompt,
    )
    return jsonify({"response": response.text})
