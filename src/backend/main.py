import os
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, Request, Form, File, UploadFile, Depends
from fastapi.middleware.cors import CORSMiddleware
from src.backend.services.ocr_mistral import extract_text_from_file
from src.backend.services.gemini_client import Gemini, GeminiModel, GeminiEmbeddingModel
from src.backend.services.models import Base, Material, Material_Metadata, Course, Video_Metadata, Video_Transcript, Questions, Users
from src.backend.services.youtube import Youtube
from fastapi.exceptions import HTTPException
from typing import Annotated    
import tempfile
import shutil

# SQLAlchemy imports
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

# Create SQLAlchemy engine and session
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://athena_user:youaremysunshine@localhost:5432/athena")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables
Base.metadata.create_all(bind=engine)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

app = FastAPI()
gemini = Gemini(os.getenv('GEMINI_API_KEY'), GeminiModel.FLASH, GeminiEmbeddingModel.EMBEDDING)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Athena backend is running"}

@app.post("/summarize")
async def summarize(notes: str = Form(...)):
    summary = gemini.generate_summary(notes)
    return {"summary": summary}

@app.post('/generate-video')
async def generate_video(user_id:Annotated[str, Form(...)], course_id:Annotated[str, Form(...)]):
    # Get all materials for this user and course
    
    materials = get_db().query(Material).join(
        Material_Metadata,
        Material.id == Material_Metadata.material_id
    ).filter(
        Material_Metadata.user_id == user_id,
        Material_Metadata.course_id == course_id
    ).all()

    if not materials:
        raise HTTPException(status_code=404, detail="No materials found for this user and course")
    
    combined_text = " ".join(material.content for material in materials)
    youtube = Youtube(os.getenv('YOUTUBE_API_KEY'))
    video_segments = youtube.process_transcript(combined_text)
    for video_segment in video_segments:
        if video_segment.download:
            youtube.download_youtube_chunk(video_segment.video_id, video_segment.start_time, video_segment.end_time, "chunks", video_segment.subtitles)
    return {"message": "Video generated"}

@app.post("/generate-quiz")
async def generate_quiz(user_id:Annotated[str, Form(...)], course_id:Annotated[str, Form(...)], material_id:Annotated[str, Form(...)]):
    materials = get_db().query(Material).join(
        Material_Metadata,
        Material.id == Material_Metadata.material_id
    ).filter(
        Material_Metadata.user_id == user_id,
        Material_Metadata.course_id == course_id,
        Material_Metadata.material_id = material_id
    ).all()

    if not materials:
        raise HTTPException(status_code=404, detail="No materials found for this user and course")
    


@app.post("/upload-document/")
async def upload_document(user_id:Annotated[str, Form(...)], course_id:Annotated[str, Form(...)], file: UploadFile = File(...), db: Session = Depends(get_db)):
    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as temp_file:
        shutil.copyfileobj(file.file, temp_file)
        temp_file_path = temp_file.name
    try:
        extracted_text = extract_text_from_file(temp_file_path)
        text = ""
        for i, chunk in enumerate(extracted_text):
            text += " " + chunk[0].markdown
            material = Material(
                filename=file.filename,
                chunk_index=i,
                content=text,
                embedding=chunk[1] if len(chunk) > 1 else None
            )
            db.add(material)
            db.commit()
        summary = gemini.generate_summary(text)
        material_metadata = Material_Metadata(
            user_id=user_id,
            course_id=course_id,
            material_id=material.id,
            summary=summary
        )
        db.add(material_metadata)
        db.commit()
        return {"message": f"Successfully processed and stored {len(extracted_text)} chunks from {file.filename}"}
    finally:
        os.unlink(temp_file_path)

@app.post("/create-user/")
async def create_user(
    username: Annotated[str, Form(...)],
    email: Annotated[str, Form(...)],
    password: Annotated[str, Form(...)],
    db: Session = Depends(get_db)
):
    existing_user = db.query(Users).filter(Users.email == email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User with this email already exists")
    
    # Create new user
    new_user = Users(
        username=username,
        email=email,
        password=password  # In a real app, you should hash this password
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {"message": "User created successfully", "user_id": new_user.id}

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)


# curl -X POST \
#   http://127.0.0.1:8000/upload-document/ \
#   -H "Content-Type: multipart/form-data" \
#   -F "file=@/Users/ambroseling/Desktop/markov.pdf"