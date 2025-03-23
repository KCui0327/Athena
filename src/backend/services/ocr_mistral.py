import os
import base64
from mistralai import Mistral

# Load API key from environment
api_key = os.getenv("MISTRAL_API_KEY")
client = Mistral(api_key=api_key)

def encode_file_to_base64(file_path):
    """Encode any file to base64."""
    try:
        with open(file_path, "rb") as f:
            return base64.b64encode(f.read()).decode("utf-8")
    except Exception as e:
        return f"Error encoding file: {e}"

def extract_text_from_file(file_path: str) -> str:
    ext = os.path.splitext(file_path)[-1].lower()

    try:
        if ext in [".jpg", ".jpeg", ".png"]:
            # Handle image
            base64_image = encode_file_to_base64(file_path)
            if base64_image.startswith("Error"):
                return base64_image

            ocr_response = client.ocr.process(
                model="mistral-ocr-latest",
                document={
                    "type": "image_url",
                    "image_url": f"data:image/jpeg;base64,{base64_image}"
                }
            )

        elif ext == ".pdf":
            # Handle PDF
            uploaded_pdf = client.files.upload(
                file={
                    "file_name": os.path.basename(file_path),
                    "content": open(file_path, "rb")
                },
                purpose="ocr"
            )

            signed_url = client.files.get_signed_url(file_id=uploaded_pdf.id)

            ocr_response = client.ocr.process(
                model="mistral-ocr-latest",
                document={
                    "type": "document_url",
                    "document_url": signed_url.url
                }
            )
        else:
            return f"Unsupported file type: {ext}"

        # Try extracting the markdown text
        if hasattr(ocr_response, "markdown_text"):
            return ocr_response.markdown_text
        elif isinstance(ocr_response, dict) and "markdown_text" in ocr_response:
            return ocr_response["markdown_text"]
        else:
            return ocr_response

    except Exception as e:
        return f"Error during OCR: {str(e)}"
