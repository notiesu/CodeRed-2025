from flask import Flask, request, jsonify, render_template, flash, redirect, url_for
from backend.api.mathpix.mathpix_api import mathpix_bp, process_image
from backend.api.elevenlabs.elevenlabs_api import elevenlabs_bp, text_to_speech
from backend.api.gemini.gemini_api import gemini_bp, generate_summary, list_equations
import base64
import os
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import Integer, String, Text
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import LoginManager, login_user, logout_user, UserMixin, current_user, login_required
from dataclasses import dataclass


app = Flask(__name__)

# #create database
# class Base(DeclarativeBase):
#     pass

# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(app.instance_path, 'users.db')
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# db = SQLAlchemy(app)

# class User(db.Model):
#     id = db.Column(Integer, primary_key=True)
#     username = db.Column(String, unique=True, nullable=False)
#     email = db.Column(String, unique=True, nullable=False)
#     password = db.Column(String, unique=True, nullable=False)

# with app.app_context():
#     db.create_all()

@dataclass
class SupportedVoice:
  id: str
  name: str
  language: str


SUPPORTED_VOICES = [
    SupportedVoice(id="7EgG6hUPTRSnBBfZN5tp", name="English Male", language="english"),
    SupportedVoice(id="67oeJmj7jIMsdE6yXPr5", name="English Female", language="english"),
    SupportedVoice(id="zl1Ut8dvwcVSuQSB9XkG", name="Spanish Female", language="spanish"),
    SupportedVoice(id="IdhxxSTaAg80CTeSgScm", name="Spanish Male", language="spanish"),
    SupportedVoice(id="DwVjO5Gf5OLta9foButZ", name="Filipino Male", language="tagalog"),
    SupportedVoice(id="X8p5qX4nY3p7b2F6mLzD", name="Filipino Female", language="tagalog"),
    SupportedVoice(id="nutrBX1pApRaSpLJobvb", name="Indian Female", language="hindi"),
    SupportedVoice(id="tCQZxDMvByfdDO1hNxhz", name="Indian Male", language="hindi"),
    SupportedVoice(id="t8BrjWUT5Z23DLLBzbuY", name="French Female", language="french"),
    SupportedVoice(id="5d9jEFwkzN2grNaI7bw1", name="French Male", language="french")
]


# Register blueprints
app.register_blueprint(mathpix_bp)
app.register_blueprint(elevenlabs_bp)
app.register_blueprint(gemini_bp)

MATHPIX_APP_ID = os.getenv('MATHPIX_APP_ID')
MATHPIX_APP_KEY = os.getenv('MATHPIX_APP_KEY')

app.secret_key = os.getenv("LOGIN_SECRET_KEY")
#create database
class Base(DeclarativeBase):
    pass


app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
db = SQLAlchemy(model_class=Base)
db.init_app(app)

class User(UserMixin, db.Model):
    id = db.Column(Integer, primary_key=True)
    username = db.Column(String, unique=True, nullable=False)
    email = db.Column(String, unique=True, nullable=False)
    password = db.Column(String, nullable=False)


with app.app_context():
    db.create_all()


#user authentication
login_manager = LoginManager()
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id):
    return db.get_or_404(User, user_id)


#register endpoint
@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        email = request.form.get("email")
        username = request.form.get("username")
        password = request.form.get("password")
        hashed_password = generate_password_hash(password)

        #check for duplicate usernames/ emails
        user = db.session.execute(db.select(User).where(User.email == email))
        user = user.scalar()
        if user:
            flash("Email is already in use")
            return redirect(url_for("register"))
        #check username
        user = db.session.execute(db.select(User).where(User.username == username))
        user = user.scalar()
        if user:
            flash("Username is already in use")
            return redirect(url_for("register"))
                            
        new_user = User(username=username, email=email, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()
        login_user(new_user)
        return redirect(url_for("index"))
    return render_template("register.html")

@app.route("/login", methods=["GET","POST"])
def login():
    if request.method == "POST":
        identifier = request.form.get("identifier")
        password = request.form.get("password")
        # Try username first, then email
        user = db.session.execute(db.select(User).where(User.username == identifier)).scalar()
        if not user:
            user = db.session.execute(db.select(User).where(User.email == identifier)).scalar()
        if not user:
            flash("Wrong username or email")
            return redirect(url_for('login'))
        if not check_password_hash(user.password, password):
            flash("Wrong password")
            return redirect(url_for('login'))
        login_user(user)
        return redirect(url_for("index"))
    return render_template("login.html")


@app.route("/logout", methods=["POST"])
@login_required
def logout():
    logout_user()
    return redirect(url_for('home'))


@app.route('/image-to-speech', methods=['POST'])
def image_to_speech():
    # Check if file was uploaded
    if 'image' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    
    file = request.files['image']
    if 'voice_id' in request.form:
        voice_id = request.form['voice_id']
    else:
        return jsonify({"error": "No voice ID provided"}), 400
    voiceObject = next((voice for voice in SUPPORTED_VOICES if voice.id == voice_id), None)
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

    #input - text
    #input - text
    math_content = mathpix_output.get_json().get("text", "")
    gemini_output = generate_summary(math_content, language=voiceObject.language)
    #TODO - consider performance before uncommenting
    # list_equations_output = list_equations(math_content)
    list_equations_output = jsonify({"equations": []})

    #extract speech
    speech_content = gemini_output.get_json().get("response", "")
    elevenlabs_output = text_to_speech(text=speech_content, voice_id=voice_id)

    # try:
    #     return jsonify(elevenlabs_output.get_json())
    # except:
    #     return jsonify({"error": type(elevenlabs_output), "details": str(elevenlabs_output)})

    # # Now safe to check for errors
    # if "error" in response_json:
    #     return response_json
    # Read the generated audio file and encode as base64
    audio_path = ".tmp/output.wav"
    if os.path.exists(audio_path):
        with open(audio_path, 'rb') as audio_file:
            audio_base64 = base64.b64encode(audio_file.read()).decode('utf-8')
    else:
        audio_base64 = None

    #return audio file (base64) and speech_content (transcript)
    return jsonify({
        "transcript": speech_content,
        "audio_base64": audio_base64,
        "audio_format": "wav",
        "equations": list_equations_output.get_json().get("equations", [])
    })

@app.route('/voices', methods=['GET'])
def supported_voices():
    return jsonify({"voices": [vars(voice) for voice in SUPPORTED_VOICES]})

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/app')
def index():
    return render_template("index.html")

if __name__ == '__main__':
    app.run(debug=True)
