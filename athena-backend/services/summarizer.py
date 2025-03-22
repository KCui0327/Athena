import os
import google.generativeai as genai

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.0-flash")

def summarize_text(notes: str) -> str:
    prompt = f"Summarize the following class notes into concise bullet points:\n\n{notes}"
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error during summarization: {str(e)}"
