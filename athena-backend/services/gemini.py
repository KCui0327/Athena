import os
from pydantic import BaseModel
from google import genai
from dotenv import load_dotenv
from enum import Enum
load_dotenv()

class GeminiModel(Enum):
    FLASH = "gemini-2.0-flash" 

class GeminiEmbeddingModel(Enum):
    EMBEDDING = "gemini-embedding-exp-03-07"


class Gemini:
    def __init__(self, api_key:str, model:GeminiModel, embedding_model:GeminiEmbeddingModel):
        self.model = model
        self.embedding_model = embedding_model
        self.api_key = api_key
        self.client = genai.Client(api_key=self.api_key)

    def generate_text(self, prompt:str):
        try:
            return self.client.models.generate_content(model=self.model, contents=prompt)
        except Exception as e:
            return f"Error during generation: {str(e)}"

    def generate_quiz(self, text:str):
        try:
            prompt = f"Generate a quiz with 10 questions based on the following text: {text}"
            return self.client.models.generate_content(model=self.model, contents=prompt)
        except Exception as e:
            return f"Error during generation: {str(e)}"

    def generate_summary(self, text:str):
        try:
            prompt = f"Summarize the following class notes into concise bullet points: {text}"
            return self.client.models.generate_content(model=self.model, contents=prompt)
        except Exception as e:
            return f"Error during generation: {str(e)}"

    def generate_embedding(self, text:str):
        try:
            result = self.client.models.embed_content(
                model=self.embedding_model,
                contents=text)
            return result
        except Exception as e:
            return f"Error during generation: {str(e)}"


if __name__ == "__main__":
    gemini = Gemini(os.getenv('GEMINI_API_KEY'), GeminiModel.FLASH, GeminiEmbeddingModel.EMBEDDING)
    print(gemini.generate_summary("Linear regresion is a type of regression analysis that models the relationship between a dependent variable and one or more independent variables. It is a simple and effective method for predicting outcomes based on input variables."))
