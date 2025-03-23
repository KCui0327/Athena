import os
from pydantic import BaseModel
from google import genai
from google.genai import types
from dotenv import load_dotenv
from enum import Enum
from numpy.linalg import norm
from numpy import dot
import vertexai
from vertexai.generative_models import GenerativeModel, Part
from datatype import Quiz

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

    def generate_quiz(self, text:str):
        try:
            prompt = f"Generate a multiple choice quiz with 4 questions and a list of the correct answers based on the following text: {text}"
            response = self.client.models.generate_content(
                model=GeminiModel.FLASH,
                contents=prompt,
                config={
                    'response_mime_type': 'application/json',
                    'response_schema': list[Quiz],
            },)
            return response
        except Exception as e:
            return f"Error during generation: {str(e)}"

    def generate_summary(self, text:str):
        try:
            prompt = f"Summarize the following class notes into concise bullet points: {text}"
            return self.client.models.generate_content(model=self.model, contents=prompt)
        except Exception as e:
            return f"Error during generation: {str(e)}"
        
    def generate_summary_from_video(self, video_url:str):
        try:
            # Create a proper request with the video URL
            contents = [
                {
                    "role": "user",
                    "parts": [
                        {"text": "Summarize this video."},
                        {"uri": video_url, "mime_type": "video/mp4"}
                    ]
                }
            ]
            return self.client.models.generate_content(model=self.model.value, contents=contents)
        except Exception as e:
            return f"Error during generation: {str(e)}"

    def generate_embedding(self, text:str):
        try:
            result = self.client.models.embed_content(
                model=self.embedding_model,
                contents=text,
                config=types.EmbedContentConfig(task_type="SEMANTIC_SIMILARITY")
            )
            return result.embeddings[0].values
        except Exception as e:
            return f"Error during generation: {str(e)}"

    def sentence_slicer(self, past_chunk, current_chunk, next_chunk):
        try:
            prompt = f"You are a helpful assistant that slices a text into sentences. The past chunk is: {past_chunk}, the current chunk is: {current_chunk}, and the next chunk is: {next_chunk}. Please determine if the current chunk is the end of a sentence or not. If it is, return True. If it is not, return False."
            return self.client.models.generate_content(model=self.model, contents=prompt, config={
                'response_mime_type': 'application/json',
                'response_schema': bool,
            })
        except Exception as e:
            return f"Error during generation: {str(e)}"
        
    def cosine_similarity(self, embedding1:list[float], embedding2:list[float]):
        try:
            cos_sim = dot(embedding1, embedding2)/(norm(embedding1)*norm(embedding2))
            print(f"cos_sim: {cos_sim}, type: {type(cos_sim)}")
            return cos_sim
        except Exception as e:
            return f"Error during generation: {str(e)}"

if __name__ == "__main__":
    load_dotenv()

    print(os.getenv('GEMINI_API_KEY'))
    # gemini = Gemini(os.getenv('GEMINI_API_KEY'), GeminiModel.FLASH, GeminiEmbeddingModel.EMBEDDING)
    # print(gemini.generate_summary("Linear regresion is a type of regression analysis that models the relationship between a dependent variable and one or more independent variables. It is a simple and effective method for predicting outcomes based on input variables."))

    # embedding1 = gemini.generate_embedding("Linear regresion is a type of regression analysis that models the relationship between a dependent variable and one or more independent variables. It is a simple and effective method for predicting outcomes based on input variables.")
    # embedding2 = gemini.generate_embedding("I like apples")
    # print(gemini.cosine_similarity(embedding1, embedding2))


    gemini = Gemini(os.getenv('GEMINI_API_KEY'), GeminiModel.FLASH, GeminiEmbeddingModel.EMBEDDING)
    video_summary = gemini.generate_summary_from_video("https://www.youtube.com/watch?v=aircAruvnKk&t=1s&ab_channel=3Blue1Brown")
    #print(video_summary)

    print(gemini.generate_quiz(video_summary))