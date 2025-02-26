import streamlit as st
import requests
import json
from PIL import Image
import io


FLASK_API_CLASSIFY = "http://127.0.0.1:5001/classify"
FLASK_API_GET_RESULT = "http://127.0.0.1:5001/get_result"

# Streamlit App Title
st.title("♻️ RecycleAI - Classify Your Waste")

# Description
st.write("Take a photo or upload an image to check if the item is recyclable.")

# State to track if camera should be opened
if "open_camera" not in st.session_state:
    st.session_state.open_camera = False

# Button to activate camera
if st.button("📷 Open Camera"):
    st.session_state.open_camera = True

# Show camera input when button is clicked
if st.session_state.open_camera:
    camera_file = st.camera_input("📸 Capture an image")
else:
    camera_file = None

# File uploader for an alternative way to upload images
uploaded_file = st.file_uploader("📂 Or Upload an image", type=["jpg", "png", "jpeg"])

# Determine which file to process
selected_file = camera_file if camera_file else uploaded_file

if selected_file is not None:
    # Display the selected image
    image = Image.open(selected_file)
    st.image(image, caption="📸 Captured Image", use_column_width=True)

    # Resize Image (to prevent large uploads)
    image = image.resize((500, 500))

    # Convert the resized image to bytes
    image_bytes = io.BytesIO()
    image.save(image_bytes, format="JPEG", quality=85)  # Reduce quality to optimize size
    image_bytes.seek(0)

    # 🔘 Button to send image to Flask API
    if st.button("🔍 Classify Image"):
        with st.spinner("🔄 Processing image..."):
            try:
                # Send the image to Flask for classification
                files = {"file": ("image.jpg", image_bytes.getvalue(), "image/jpeg")}
                response = requests.post(FLASK_API_CLASSIFY, files=files, timeout=10)

                if response.status_code == 200:
                    st.success("✅ Image classified successfully! Fetching results...")

                    # Fetch classification result
                    result_response = requests.get(FLASK_API_GET_RESULT, timeout=10)

                    if result_response.status_code == 200:
                        result_json = result_response.json()

                        # Display formatted classification result
                        st.subheader("🔍 Classification Result")
                        # st.json(result_json)

                        # Show classification as a message
                        classification = result_json.get("classification", "Unknown")
                        if classification == "Recyclable":
                            st.success(f"♻️ {classification} - You can recycle this item!")
                        else:
                            st.error(f"🚫 {classification} - This item is not recyclable.")

                        # Display extracted details
                        st.text_area(
                            "📜 Extracted Information",
                            f"**Classification:** {classification}\n"
                            f"**Objects Identified:** {result_json.get('objects', 'N/A')}\n"
                            f"**Labels:** {', '.join(result_json.get('labels', []))}",
                            height=150
                        )
                    else:
                        st.error("❌ Failed to fetch classification results.")
                else:
                    st.error("❌ Failed to classify image. Please try again.")
            except requests.exceptions.RequestException as e:
                st.error(f"❌ Network Error: {e}")

