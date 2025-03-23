import random
import os
from dotenv import load_dotenv
import uvicorn
import requests
load_dotenv()

from fastapi import FastAPI, Request, Form, File, UploadFile, Depends, Response
from fastapi.middleware.cors import CORSMiddleware
from src.backend.services.ocr_mistral import extract_text_from_file
from src.backend.services.gemini_client import Gemini, GeminiModel, GeminiEmbeddingModel
from src.backend.services.cohere_client import Cohere
from src.backend.services.models import Base, Material, Material_Metadata, Course, Video_Metadata, Video_Transcript, Questions, Users
from src.backend.services.youtube import Youtube
from fastapi.exceptions import HTTPException
from typing import Annotated, Optional
import tempfile
import shutil
# SQLAlchemy imports
from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import sessionmaker, Session
import uuid
from supabase import create_client, Client
from datetime import datetime

# Create SQLAlchemy engine and session
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT", 6543)  # Default to 6543 if not specified
DB_NAME = os.getenv("DB_NAME")
GCP_GATEWAY = os.getenv("GCP_GATEWAY")

# Create the connection URL
DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
engine = create_engine(DATABASE_URL)
Base.metadata.reflect(bind=engine)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Check if tables exist before creating them
inspector = inspect(engine)
tables_to_check = [
    'materials',
    'material_metadata',
    'video_metadata',
    'video_transcript',
    'questions',
    'courses',
    'users'
]

tables_missing = [table for table in tables_to_check if not inspector.has_table(table)]

if tables_missing:
    print(f"Creating missing tables: {', '.join(tables_missing)}")
    Base.metadata.create_all(bind=engine)
else:
    print("All database tables already exist, skipping creation.")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

app = FastAPI()
gemini = Gemini(os.getenv('GEMINI_API_KEY'), GeminiModel.FLASH, GeminiEmbeddingModel.EMBEDDING)
co_client = Cohere(os.getenv('COHERE_API_KEY'))

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_signed_url(filename: str) -> str:
    # First request to get the signed URL
    url = f"{GCP_GATEWAY}/v1/cloudstore/storage-post"
    
    # Prepare the JSON payload
    payload = {
        "filename": filename
    }
    
    # Make the POST request
    response = requests.post(
        url,
        headers={"Content-Type": "application/json"},
        json=payload
    )
    
    # Check if request was successful
    if response.status_code == 200:
        return response.json()["upload_url"]
    else:
        raise Exception(f"Failed to get signed URL: {response.text}")

@app.get("/")
def root():
    return {"message": "Athena backend is running"}

@app.post("/summarize")
async def summarize(notes: str = Form(...), video_link: str = Form(None)):
    if not notes and not video_link:
        raise HTTPException(status_code=400, detail="Either notes or video_link must be provided")
    if notes:
        # Call the external API for video summarization
        response = requests.post(
            f"{GCP_GATEWAY}/v1/vertexai/generate_summary",
            params={"text": notes}
        )

        if response.status_code == 200:
            return response.json()
        else:
            return {"error": f"External API error: {response.status_code}", "message": response.text}
    if video_link:
        # Call the external API for video summarization
        response = requests.post(
            f"{GCP_GATEWAY}/v1/vertexai/summarize_video",
            params={"video_link": video_link}
        )
        
        if response.status_code == 200:
            return response.json()
        else:
            return {"error": f"External API error: {response.status_code}", "message": response.text}
    else:
        # Use the local function for text summarization
        summary = gemini.generate_summary(notes)
        return {"summary": summary}

@app.post("/get-video")
async def get_video(user_id:Annotated[str, Form(...)]):
    videos = get_db().query(Video_Metadata).filter(
        Video_Metadata.user_id == user_id
    ).all()
    return {"videos": videos}


@app.post("/delete-note")
async def delete_note(user_id:Annotated[str, Form(...)], doc_id:Annotated[str, Form(...)]):
    get_db().query(Video_Metadata).filter(
        Video_Metadata.id == doc_id
    ).delete()
    get_db().commit()
    return {"message": "Note deleted"}


@app.post('/generate-video')
async def generate_video(user_id:Annotated[str, Form(...)], context:Annotated[str, Form(...)]):
    youtube = Youtube(os.getenv('YOUTUBE_API_KEY'))
    search_response = youtube.search_youtube(context)
    video_id_visited = []
    video_limit = 10
    while search_response.next_page_token or search_response.prev_page_token:
        for i,search_result in enumerate(search_response.search_results):
            if search_result.video_id not in video_id_visited:
                if len(video_id_visited) >= video_limit:
                    break
                
                video_id = search_result.video_id
                try:
                    # Check if directories exist
                    chunks_dir = "src/backend/services/chunks"
                    downloads_dir = "src/backend/services/downloads"
                    os.makedirs(chunks_dir, exist_ok=True)
                    os.makedirs(downloads_dir, exist_ok=True)

                    print(f"\nProcessing video {video_id}...")
                    
                    transcript = youtube.download_youtube_transcript(video_id)
                    if not transcript:
                        print(f"No transcript available for video {video_id}")
                        continue
                        
                    chunk_path, output_path, subtitles_file, video_length = youtube.process_transcript_alternative(video_id, gemini)
                    if not os.path.exists(output_path):
                        print(f"Failed to create output video at {output_path}")
                        continue



                    video_metadata = Video_Metadata(
                        video_id=video_id,
                        video_summary="",
                        length=video_length,
                        user_id=user_id,
                    )

                    db = next(get_db())
                    db.add(video_metadata)
                    db.commit()
                    video_id_visited.append(video_id)
                    
 
                    
                except Exception as e:
                    print(f"Error processing video {video_id}: {str(e)}")
                    import traceback
                    traceback.print_exc()
                    continue
                
    return {
        "message": "Video processing complete",
        "videos_processed": len(video_id_visited),
        "processed_ids": video_id_visited
    }


@app.post("/generate-quiz")
async def generate_quiz(
    user_id: Annotated[str, Form()], 
    course_id: Annotated[str, Form()], 
    material_id: Annotated[str, Form()],
    db: Session = Depends(get_db)
):
    material = get_db().query(Material).join(
        Material_Metadata,
        Material.id == Material_Metadata.material_id
    ).filter(
        Material_Metadata.user_id == user_id,
        Material_Metadata.course_id == course_id,
        Material_Metadata.material_id == material_id,
    ).all()

    if not material:
        raise HTTPException(status_code=404, detail="No materials found for this user and course")
    
    quiz_content = gemini.generate_quiz(material.content)

    questions = Material(
        question = quiz_content['question'],
        correct_answer = quiz_content['answer'],
        choices = quiz_content['choices']
    )
    db.add(questions)
    db.commit()


@app.post("/generate-image")
async def generate_image(
    user_id: Annotated[str, Form(...)], 
    course_id: Annotated[str, Form(...)], 
    material_id: Annotated[str, Form(...)]
):
    db: Session = get_db()
    
    material = db.query(Material).join(
        Material_Metadata,
        Material.id == Material_Metadata.material_id
    ).filter(
        Material_Metadata.user_id == user_id,
        Material_Metadata.course_id == course_id,
        Material_Metadata.material_id == material_id,
    ).first()

    if not material:
        raise HTTPException(status_code=404, detail="Material not found")

    topic = gemini.generate_summary(material.content)
    image_data = gemini.image_generation(topic)  # This returns raw image data

    # Save image to the database
    material.image = image_data
    db.commit()

    return {"message": "Image generated and stored successfully"}

@app.get("/get-image/{material_id}")
async def get_image(material_id: str):
    db: Session = get_db()
    
    # Fetch the material record from the database
    material = db.query(Material).filter(Material.id == material_id).first()
    
    if not material or not material.image:
        raise HTTPException(status_code=404, detail="Image not found")

    # Return raw binary data as an image response
    return Response(content=material.image, media_type="image/png")

@app.get("/get-note/{doc_id}")
async def get_note(doc_id: str):
    material = get_db().query(Material).filter(Material.id == doc_id).first()
    if not material:
        raise HTTPException(status_code=404, detail="Material not found")
    return {"material": material}


@app.post("/upload-material/")
async def upload_material(
    name: Annotated[str, Form()],
    user_id: Annotated[str, Form()],
    file: UploadFile = File(...),
    video_url: Annotated[str | None, Form()] = None  # This makes it optional
):

    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as temp_file:
        shutil.copyfileobj(file.file, temp_file)
        temp_file_path = temp_file.name
    try:
        material_metadata = Material_Metadata(
            video_url=video_url,  # Can be None now
            video_summary=None,
            name=name,
            user_id=user_id
        )
        
        # Only generate video summary if video_url is provided
        if video_url:
            material_metadata.video_summary = gemini.summarize_video(video_url, "video/mp4")
        
        db = next(get_db())
        db.add(material_metadata)
        db.commit()
        db.refresh(material_metadata)

        pages = extract_text_from_file(temp_file_path).pages
        text = ""
        for i, page in enumerate(pages):
            page_text = page.markdown
            embedding = co_client.embed([page_text]).embeddings.float[0]
            text += " " + page_text
            material = Material(
                text=text,
                doc_id=material_metadata.id,  # Use the id from metadata
                chunk_id=i,
                embedding=embedding
            )
            db.add(material)
            db.commit()
        # Generate embeddings for the full text
        summary = gemini.generate_summary(text)
        material_metadata.summary = str(summary.text)
        material_metadata.file_url = get_signed_url(temp_file_path)
        material_metadata.video_url = video_url
        db.commit()
        return {"message": f"Successfully processed and stored {len(pages)} chunks from {file.filename}"}
    finally:
        os.unlink(temp_file_path)

@app.post("/create-user/")
async def create_user(
    user_id: Annotated[str, Form(...)],
    db: Session = Depends(get_db)
):
    new_user = Users(id=user_id)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {"message": "User created successfully", "user_id": new_user.id}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)


# curl -X POST \
#   http://127.0.0.1:8000/upload-document/ \
#   -H "Content-Type: multipart/form-data" \
#   -F "file=@/Users/ambroseling/Desktop/markov.pdf"

