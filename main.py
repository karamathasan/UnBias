from flask import Flask, request, jsonify
from huggingface_hub import InferenceApi
import os
import re
from flask_cors import CORS

"""
curl -X POST "http://127.0.0.1:5000/analyze" \
     -H "Content-Type: application/json" \
     -d '{"text": "This statement is clearly biased against a specific group, and it makes me very unhappy."}'
"""
# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Set Hugging Face token (store this in a safe environment variable or a config file)
HF_TOKEN = os.getenv("HF_TOKEN")

# Use Hugging Face Inference API for a general-purpose LLM (e.g., flan-t5 or Llama)
general_llm_api = InferenceApi(repo_id="google/flan-t5-large", token=HF_TOKEN)

# Map classification to Hugging Face models
MODEL_MAPPING = {
    "sentiment": "distilbert-base-uncased-finetuned-sst-2-english",
    "bias": "d4data/bias-detection-model",
    "toxicity": "unitary/toxic-bert",
    "hate_speech": "Hate-speech-CNERG/dehatebert-mono-english",
}

def preprocess_text(text):
    """
    Preprocess the input text to make it more compatible with the model.
    - Convert to lowercase.
    - Remove special characters and extra spaces.
    """
    # Convert to lowercase
    text = text.lower()
    # Remove special characters and extra spaces
    text = re.sub(r"[^a-zA-Z0-9\s]", "", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text

def classify_text(text):
    """
    Use a general-purpose LLM to classify the input text.
    """
    try:
        # Create a prompt for classification
        prompt = f"Classify the following text into one of these categories: sentiment, bias, toxicity, hate_speech. Text: {text}"
        
        # Send the prompt to the general-purpose LLM
        response = general_llm_api(inputs=prompt)

        print("General LLM Classification Response:", response)

        # Extract the classification from the response
        classification = response[0]['generated_text'].strip().lower()
        return classification
    except Exception as e:
        print("Error in text classification:", str(e))
        return None

def get_analysis_result(text, model_repo_id):
    """
    Use the selected Hugging Face model to analyze the text.
    """
    try:
        # Initialize the InferenceApi for the selected model
        inference_api = InferenceApi(repo_id=model_repo_id, token=HF_TOKEN)

        # Preprocess the text
        preprocessed_text = preprocess_text(text)
        print("Preprocessed Text:", preprocessed_text)

        # Send the text to the selected model for analysis
        response = inference_api(inputs=preprocessed_text)

        print("Hugging Face API Response:", response)

        # The API response will contain the label and score
        return response
    except Exception as e:
        print("Error in analysis:", str(e))
        return {"error": str(e)}

@app.route('/analyze', methods=['POST'])
def analyze_text():
    # Get the highlighted text from the request
    highlighted_text = request.json.get('text', '')

    if not highlighted_text:
        return jsonify({"error": "No highlighted text provided"}), 400

    # Step 1: Classify the text using a general-purpose LLM
    classification = classify_text(highlighted_text)
    if not classification:
        return jsonify({"error": "Failed to classify text"}), 500

    print("Classification:", classification)

    # Step 2: Select the appropriate Hugging Face model based on the classification
    model_repo_id = MODEL_MAPPING.get(classification)
    if not model_repo_id:
        return jsonify({"error": "No model found for classification"}), 500

    print("Selected Model:", model_repo_id)

    # Step 3: Analyze the text using the selected model
    result = get_analysis_result(highlighted_text, model_repo_id)

    print("API Response:", result)

    # Handle unexpected API responses
    if isinstance(result, dict) and "error" in result:
        return jsonify({"error": result["error"]}), 500

    if not isinstance(result, list) or len(result) == 0 or not isinstance(result[0], list):
        return jsonify({"error": "Unexpected API response format", "raw_output": result}), 500

    # Extract the label and score from the response
    labels_and_scores = result[0]
    if not labels_and_scores or "label" not in labels_and_scores[0] or "score" not in labels_and_scores[0]:
        return jsonify({"error": "Invalid API response format", "raw_output": result}), 500

    # Determine the result
    analysis_label = labels_and_scores[0]['label']
    analysis_score = labels_and_scores[0]['score']

    # Return the result as a JSON response
    return jsonify({
        "classification": classification,
        "analysis": {
            "label": analysis_label,
            "confidence": analysis_score,
            "raw_output": result
        }
    })

if __name__ == "__main__":
    app.run(debug=True)





# from flask import Flask, request, jsonify
# from huggingface_hub import InferenceApi
# import os
# import re
# from flask_cors import CORS

# # Initialize Flask app
# app = Flask(__name__)
# CORS(app)

# # Set Hugging Face token (store this in a safe environment variable or a config file)
# HF_TOKEN = os.getenv("HF_TOKEN")

# # Use Hugging Face Inference API for a bias detection model
# inference_api = InferenceApi(repo_id="d4data/bias-detection-model", token=HF_TOKEN)

# def preprocess_text(text):
#     # Remove unnecessary words or phrases
#     text = text.lower()
#     text = re.sub(r"[^a-zA-Z0-9\s]", "", text)
#     text = re.sub(r"\s+", " ", text).strip()
#     return text

# # Function to handle bias detection
# def get_bias_detection_result(text):
#     try:
#         # Send the text to Hugging Face API for bias detection
#         preprocessed = preprocess_text(text)
#         response = inference_api(inputs=preprocessed)

#         print("Hugging Face API Response:", response)

#         # The API response will contain the label and score
#         return response
#     except Exception as e:
#         return {"error": str(e)}

# @app.route('/analyze', methods=['POST'])
# def analyze_bias():
#     # Get the highlighted text from the request
#     highlighted_text = request.json.get('text', '')

#     if not highlighted_text:
#         return jsonify({"error": "No highlighted text provided"}), 400

#     # Perform bias detection
#     result = get_bias_detection_result(highlighted_text)

#     print("API Response:", result)

#     # Determine if the text is biased or not
#     if isinstance(result, list) and len(result) > 0 and "label" in result[0]:
#         bias_label = result[0]['label']  # e.g., "biased" or "non-biased"
#         bias_score = result[0]['score']  # Confidence score
#     else:
#         return jsonify({"error": "Unexpected API response", "raw_output": result}), 500

#     # Return the result as a JSON response
#     return jsonify({
#         "bias": bias_label,
#         "confidence": bias_score,
#         "raw_output": result
#     })

# if __name__ == "__main__":
#     app.run(debug=True)