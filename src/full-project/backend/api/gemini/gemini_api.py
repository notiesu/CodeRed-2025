from flask import Blueprint, jsonify
import google.generativeai as genai
from flask import request
import os
from dotenv import load_dotenv

load_dotenv()

gemini_bp = Blueprint('gemini_api', __name__)

def generate_content(content):

    # content = request.args.get('content', default='', type=str)
    if not content:
        return jsonify({"error": "Content parameter is required"}), 400

    # Replace 'your_api_key_here' with your actual API key
    client = genai.Client(api_key=os.getenv('GEMINI_API_KEY'))
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=content,
    )
    return jsonify({"response": response.text})
