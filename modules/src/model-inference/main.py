import vertexai
import dotenv
import os
import uvicorn
from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from google import genai
from vertexai.generative_models import GenerativeModel, Part

load_dotenv()

_project_id = os.getenv("PROJECT_ID")
_location = os.getenv("LOCATION")
_model = os.getenv("MODEL_NAME")

class VertexAI:
    def __init__(self):
        vertexai.init(project=_project_id, location=_location)
        self.model = GenerativeModel(_model)
        self.router = APIRouter()
        self.router.add_api_route("/summarize_video", self.summarize_video, methods=["POST"])
        self.router.add_api_route("/generate_quiz", self.generate_quiz, methods=["POST"])
        self.router.add_api_route("/generate_summary", self.generate_summary, methods=["POST"])

    async def summarize_video(self, video_link: str) -> dict:
        try:
            contents = [
                "Summarize this video.",
                Part.from_uri(video_link, "video/mp4"),
            ]
            response = self.model.generate_content(contents)
            return {"summary": response.text}
        except Exception as e:
            return {"error": str(e)}

    async def generate_quiz(self, text: str) -> dict:
        try:
            prompt = f"Generate a quiz with 10 questions based on the following text: {text}"
            response = self.model.generate_content(prompt)
            return {"quiz": response.text}
        except Exception as e:
            return {"error": str(e)}

    async def generate_summary(self, text: str) -> dict:
        try:
            prompt = f"Summarize the following class notes into concise bullet points: {text}"
            response = self.model.generate_content(prompt)
            return {"summary": response.text}
        except Exception as e:
            return {"error": str(e)}
    

app = FastAPI()
vertex_ai = VertexAI()
app.include_router(vertex_ai.router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)