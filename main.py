from flask import Flask, request, jsonify
from transformers import pipeline
import json
from huggingface_hub import InferenceApi
import os
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Set Hugging Face token (store this in a safe environment variable or a config file)
HF_TOKEN = os.getenv("HF_TOKEN")

# Use Hugging Face Inference API for a specific model
inference_api = InferenceApi(repo_id="meta-llama/Llama-3.1-8B-Instruct", token=HF_TOKEN)

# Function to handle sentiment analysis or chat completion using Hugging Face
def get_bias_detection_result(text):
    try:
    # Send the text to Hugging Face API for analysis (modify the API parameters as needed)
        response = inference_api.call({"inputs": text})

        # The API response might vary depending on the model you're using.
        return response
    except Exception as e:
        return {"error": str(e)}

@app.route('/analyze', methods=['POST'])
def analyze_sentiment():
    # Get the highlighted text from the request
    highlighted_text = request.json.get('text', '')

    if not highlighted_text:
        return jsonify({"error": "No highlighted text provided"}), 400

    # Perform bias detection or sentiment analysis with Hugging Face
    result = get_bias_detection_result(highlighted_text)

    # Return the result as a JSON response
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)




# from flask import Flask, request, jsonify
# from transformers import pipeline
# import json
# from flask_cors import CORS

# # Initialize the Flask app and sentiment analysis model
# app = Flask(__name__)
# CORS(app, resources={r"/*": {"origins": "*"}})
# classifier = pipeline("sentiment-analysis")

# @app.route('/analyze', methods=['POST'])
# def analyze_sentiment():
#     # Get the highlighted text from the request
#     highlighted_text = request.json.get('text', '')

#     # Run sentiment analysis
#     result = classifier(highlighted_text)

#     # Save the result to a file
#     with open("result.json", "w") as result_json:
#         json.dump(result, result_json, indent=4)

#     # Return the result as a JSON response
#     return jsonify(result)

# if __name__ == "__main__":
#     app.run(debug=True)