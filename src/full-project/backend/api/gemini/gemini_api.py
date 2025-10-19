from flask import Blueprint, jsonify
from google import genai
from flask import request
import os
from dotenv import load_dotenv
from dataclasses import dataclass, field
from typing import List, Set
load_dotenv()

gemini_bp = Blueprint('gemini_api', __name__)

@dataclass
class Equation:
    latex: str                     # The LaTeX representation of the equation
    description: str               # What the equation represents / its purpose
    symbols: Set[str] = field(default_factory=set)  # Unique symbols/variables used
    mathML: str = ""            # Optional MathML representation

    def add_symbols(self, new_symbols: List[str]):
        """Add symbols to the equation's symbol set."""
        self.symbols.update(new_symbols)

GENERATE_SUMMARY_PROMPT = (
    "You are an expert STEM educator. Convert technical lecture notes into a clear, engaging word lecture "
    "You will be speaking directly to the user, so avoid filler language and go straight into the content. "
    "that will be prepped into a text-to-speech. Explain complex concepts in simple, conversational language without losing accuracy. "
    "Emphasize key points, formulas, and definitions. Include brief examples or analogies."
    "When describing formulas, use MathML format to ensure clarity."
    "Keep sentences concise and natural for reading aloud. Maintain logical flow and break long sections "
    "into digestible segments. Avoid filler or unnecessary repetition."
    "Ensure the summary is 240 words AT MAXIMUM."
    "This is the lecture content:\n"
)

LIST_EQUATIONS_PROMPT = (
    "You are a STEM assistant. Given lecture notes parsed from Mathpix, extract only the equations and formulas. "
    "For each equation, provide its LaTeX representation, a brief description of what it represents, and list the unique symbols or variables used in it. "
    "Format the response as a numbered list, with each entry containing the LaTeX code, description, and symbols."
    "This is the format to follow:\n"
    "LaTeX equation - Description - MathML representation\n"
    "Symbols: symbol1, symbol2, ..."
    "Ensure accuracy and completeness in extraction."
    "Only do this for up to 10 equations."
    "This is the lecture content:\n"
)


def generate_summary(content, language="en"):

    # content = request.args.get('content', default='', type=str)
    if not content:
        return jsonify({"error": "Content parameter is required"}), 400
    
    # Optionally include voice guidance in the system prompt
    voice_hint = ''
    if language:
        voice_hint = f"\n\nFirst, translate content into this language: {language}."

    full_prompt = f"{voice_hint}/{GENERATE_SUMMARY_PROMPT}\n\n{content}"
    # Replace 'your_api_key_here' with your actual API key
    client = genai.Client()
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=full_prompt,
    )
    return jsonify({"response": response.text})

def list_equations(content):
    
    full_prompt = f"{LIST_EQUATIONS_PROMPT}\n\n{content}"
    client = genai.Client()
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=full_prompt,
    )
    
    # Parse the response text to extract equations and their metadata
    equations = []
    try:
        lines = response.text.split("\n")
        current_equation = None

        for line in lines:
            line = line.strip()
            if " - " in line:  # Start of a new equation
                parts = line.split(" - ")
                if len(parts) == 3:  # LaTeX, Description, MathML
                    latex = parts[0].strip()
                    description = parts[1].strip()
                    mathML = parts[2].strip()
                    current_equation = Equation(latex=latex, description=description, mathML=mathML)
                    equations.append(current_equation)
            elif line.startswith("Symbols:") and current_equation:
                symbols = line.replace("Symbols:", "").strip().split(", ")
                current_equation.add_symbols(symbols)
    except Exception as e:
        return jsonify({"error": f"Failed to parse equations: {str(e)}"}), 500

    # Convert the list of Equation objects to a serializable format
    equations_data = [
        {"latex": eq.latex, "description": eq.description, "symbols": list(eq.symbols)}
        for eq in equations
    ]
    return jsonify({"equations": equations_data})
