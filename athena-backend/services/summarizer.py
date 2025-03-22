import os
from google import genai
import google.generativeai as genai
from dotenv import load_dotenv  

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.0-flash")


def summarize_text(notes: str) -> str:
    prompt = f"Summarize the following class notes into concise bullet points:\n\n{notes}"
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error during summarization: {str(e)}"


if __name__ == "__main__":
    notes = "Linear regresion is a type of regression analysis that models the relationship between a dependent variable and one or more independent variables. It is a simple and effective method for predicting outcomes based on input variables."
    print(summarize_text(notes))