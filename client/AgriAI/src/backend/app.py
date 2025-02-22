from flask import Flask, request, jsonify
import pickle
import pandas as pd
import os
import tensorflow as tf
import numpy as np
from flask_cors import CORS
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

# Paths for trained models
CROP_MODEL_PATH = "crop.pkl"
CROP_YIELD_MODEL_PATH = "cropyeild.pkl"
DISEASE_MODEL_PATH = "C:\\Users\\PRANAV\\Downloads\\sample\\client\\AgriAI\\src\\backend\\trained_plant_disease_model.h5"
UPLOAD_FOLDER = "uploads"

# Create the uploads folder if it doesn't exist
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Load Crop Model
if os.path.exists(CROP_MODEL_PATH):
    with open(CROP_MODEL_PATH, 'rb') as file:
        crop_data = pickle.load(file)
        crop_model = crop_data.get('model')
        state_mapping = crop_data.get('state_mapping')
        features = crop_data.get('features')
else:
    crop_model, state_mapping, features = None, None, None
    print("⚠️ Model file 'crop.pkl' not found!")

# Load Crop Yield Model
if os.path.exists(CROP_YIELD_MODEL_PATH):
    with open(CROP_YIELD_MODEL_PATH, 'rb') as file:
        crop_yield_data = pickle.load(file)
        crop_yield_model = crop_yield_data.get('model')
        factorized_mappings = crop_yield_data.get('factorized_mappings')
else:
    crop_yield_model, factorized_mappings = None, None
    print("⚠️ Model file 'cropyeild.pkl' not found!")

# Load Plant Disease Model
if os.path.exists(DISEASE_MODEL_PATH):
    disease_model = tf.keras.models.load_model(DISEASE_MODEL_PATH)
else:
    disease_model = None
    print("⚠️ Plant disease model not found!")

@app.route('/predict', methods=['POST'])
def predict():
    if crop_model is None:
        return jsonify({'error': 'Model not loaded'}), 500
    
    data = request.json
    if not data:
        return jsonify({'error': 'No input data provided'}), 400

    required_features = ['N_SOIL', 'P_SOIL', 'K_SOIL', 'TEMPERATURE', 'HUMIDITY', 'ph', 'RAINFALL', 'CROP_PRICE', 'STATE']

    try:
        input_data = {key: data[key] for key in required_features}
    except KeyError as e:
        return jsonify({'error': f'Missing feature: {str(e)}'}), 400

    input_df = pd.DataFrame([input_data])

    if state_mapping is not None:
        input_df['STATE'] = input_df['STATE'].apply(lambda x: state_mapping.get_loc(x) if x in state_mapping else -1)

    input_df = input_df[required_features]
    input_df = input_df.astype(float)

    prediction = crop_model.predict(input_df)
    return jsonify({'prediction': prediction[0]})

@app.route('/analytics', methods=['POST'])
def analytics():
    if crop_yield_model is None:
        return jsonify({'error': 'Crop yield model not loaded'}), 500
    
    data = request.json
    if not data:
        return jsonify({'error': 'No input data provided'}), 400
    
    required_features = ['Region', 'Soil_Type', 'Crop', 'Rainfall_mm', 'Temperature_Celsius', 'Fertilizer_Used', 'Irrigation_Used', 'Weather_Condition', 'Days_to_Harvest']
    input_data = {key: data.get(key, None) for key in required_features}
    
    missing_features = [key for key, value in input_data.items() if value is None]
    if missing_features:
        return jsonify({'error': f"Missing features: {', '.join(missing_features)}"}), 400  # Fixed f-string issue

    input_df = pd.DataFrame([input_data])

    for col in ['Region', 'Soil_Type', 'Crop', 'Weather_Condition']:
        if factorized_mappings and col in factorized_mappings:
            input_df[col] = input_df[col].map(lambda x: factorized_mappings[col].get_loc(x) if x in factorized_mappings[col] else -1)
    
    prediction = crop_yield_model.predict(input_df)
    
    return jsonify({'prediction': prediction[0]})

@app.route('/disease', methods=['POST'])
def disease_detection():
    if disease_model is None:
        return jsonify({'error': 'Disease model not loaded'}), 500
    
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    filename = secure_filename(file.filename)
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    image = tf.keras.preprocessing.image.load_img(filepath, target_size=(128, 128))
    img_array = tf.keras.preprocessing.image.img_to_array(image)
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
    img_array = img_array / 255.0  # Normalize

    predictions = disease_model.predict(img_array)
    predicted_class = int(np.argmax(predictions, axis=1)[0])  # Ensure it's an integer
    confidence = float(np.max(predictions))

    classes = ['Apple___Apple_scab', 'Apple___Black_rot', 'Apple___Cedar_apple_rust', 'Apple___healthy', 'Blueberry___healthy', 'Cherry_(including_sour)___Powdery_mildew', 'Cherry_(including_sour)___healthy', 'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot', 'Corn_(maize)___Common_rust_', 'Corn_(maize)___Northern_Leaf_Blight', 'Corn_(maize)___healthy', 'Grape___Black_rot', 'Grape___Esca_(Black_Measles)', 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)', 'Grape___healthy', 'Orange___Haunglongbing_(Citrus_greening)', 'Peach___Bacterial_spot', 'Peach___healthy', 'Pepper,_bell___Bacterial_spot', 'Pepper,_bell___healthy', 'Potato___Early_blight', 'Potato___Late_blight', 'Potato___healthy', 'Raspberry___healthy', 'Soybean___healthy', 'Squash___Powdery_mildew', 'Strawberry___Leaf_scorch', 'Strawberry___healthy', 'Tomato___Bacterial_spot', 'Tomato___Early_blight', 'Tomato___Late_blight', 'Tomato___Leaf_Mold', 'Tomato___Septoria_leaf_spot', 'Tomato___Spider_mites Two-spotted_spider_mite', 'Tomato___Target_Spot', 'Tomato___Tomato_Yellow_Leaf_Curl_Virus', 'Tomato___Tomato_mosaic_virus', 'Tomato___healthy']

    # Ensure the predicted_class index is within range
    if 0 <= predicted_class < len(classes):
        disease_name = classes[predicted_class].split("___")[-1]  # Extract only the disease name
        return jsonify({'disease_name': disease_name, 'confidence': confidence})
    else:
        return jsonify({'error': 'Predicted class index out of range', 'predicted_class': predicted_class}), 500


if __name__ == '__main__':
    app.run(debug=True)
