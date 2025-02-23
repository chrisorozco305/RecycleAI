from flask import Flask, render_template, request, jsonify
from openai import OpenAI

app = Flask(__name__)

# OpenAI Configuration
openai_api_key = "secret_recycle_ee20da1f32e84f059e76b004674ee518.3OY2vLmI42nyg9aATLX6u1RlvHpFFty9"
openai_api_base = "https://api.lambdalabs.com/v1"

client = OpenAI(
    api_key=openai_api_key,
    base_url=openai_api_base,
)

model = "llama3.3-70b-instruct-fp8"

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/classify", methods=["POST"])
def classify_item():
    data = request.get_json()
    item = data.get("item", "").strip()

    if not item:
        return jsonify({"error": "Please provide an item"}), 400

    try:
        # Mimicking the reference script
        response = client.completions.create(
            prompt=f"you're a recycling expert and you will categorize the item I "+
            "give you into one of the following categories: plastic, paper, metal, glass, compost, or trash."+
            "After categorizing the item, provide a brief suggestion on how to recycle or dispose of it properly. "+
            "If the item does not fit any of these categories, respond with 'trash' and explain why it cannot be recycled."+
            f" If the item does not fit any of these categories, please respond with 'trash'. The item is: {item}",
            temperature=0,
            model=model,
        )

        # Ensure proper response extraction
        result_text = response.choices[0].text.strip()
        return jsonify({"response": result_text})

    except Exception as e:
        return jsonify({"error": str(e)}), 500  # Return API error message

if __name__ == "__main__":
    app.run(debug=True)
