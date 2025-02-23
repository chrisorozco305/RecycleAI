import os
import json
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS, cross_origin
from google.cloud import vision
from werkzeug.utils import secure_filename

# Flask Setup
app = Flask(__name__)

# Completely disable CORS restrictions (for development only)
CORS(app, supports_credentials=True)

UPLOAD_FOLDER = 'uploads'
RESULT_FILE = "result.json"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Google Vision API Credentials
CREDENTIALS_PATH = "/Users/jesuscasasanta/RecycleAI/Comp_vision/recycling-451805-a774bbfbf16f.json"
if not os.path.exists(CREDENTIALS_PATH):
    raise FileNotFoundError(f"Credential file not found at: {CREDENTIALS_PATH}")

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = CREDENTIALS_PATH
client = vision.ImageAnnotatorClient()

# Define recyclable items
RECYCLABLE_ITEMS = ["plastic bottle", "glass bottle", "cardboard", "paper", "metal can", "recycling bin"]

def classify_waste(image_path):
    """Analyze image and determine if it's recyclable."""
    with open(image_path, "rb") as image_file:
        content = image_file.read()

    image = vision.Image(content=content)
    response = client.label_detection(image=image)

    labels = [label.description.lower() for label in response.label_annotations]
    detected_objects = ", ".join(labels[:2]) if labels else "Unknown"

    classification = "Non-Recyclable"
    for label in labels:
        if label in RECYCLABLE_ITEMS:
            classification = "Recyclable"
            break

    return {"classification": classification, "labels": labels, "objects": detected_objects}

@app.after_request
def add_cors_headers(response):
    """Ensure all responses include CORS headers"""
    response.headers["Access-Control-Allow-Origin"] = "http://localhost:3000"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS, PUT, DELETE"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    return response

@app.route('/classify', methods=['POST', 'OPTIONS'])
@cross_origin(origin='http://localhost:3000', headers=['Content-Type', 'Authorization'])
def classify():
    """Handle image classification requests"""
    if request.method == "OPTIONS":  # Handle CORS preflight request
        response = jsonify({"message": "CORS preflight OK"})
        response.headers["Access-Control-Allow-Origin"] = "http://localhost:3000"
        return response, 200

    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)

    classification = classify_waste(filepath)

    # Save results to JSON file
    with open(RESULT_FILE, "w") as json_file:
        json.dump(classification, json_file)

    response = jsonify({"message": "Classification saved to result.json", "result": classification})
    response.headers["Access-Control-Allow-Origin"] = "http://localhost:3000"
    return response

@app.route('/get_result', methods=['GET', 'OPTIONS'])
@cross_origin(origin='http://localhost:3000', headers=['Content-Type', 'Authorization'])
def get_result():
    """Fetch the last classification result"""
    if request.method == "OPTIONS":  # Handle CORS preflight requests
        response = jsonify({"message": "CORS preflight OK"})
        response.headers["Access-Control-Allow-Origin"] = "http://localhost:3000"
        return response, 200

    if not os.path.exists(RESULT_FILE):
        response = jsonify({"error": "No result found"})
        response.headers["Access-Control-Allow-Origin"] = "http://localhost:3000"
        return response, 404

    response = send_file(RESULT_FILE, mimetype='application/json')
    response.headers["Access-Control-Allow-Origin"] = "http://localhost:3000"
    return response

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5001)