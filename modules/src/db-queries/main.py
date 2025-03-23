from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, Material, Material_Metadata, Video_Metadata, Video_Transcript, Questions
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv
import uvicorn
from fastapi import FastAPI, APIRouter

# Load .env
load_dotenv()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")

DATABASE_URL = f"postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

app = FastAPI()

# -------------------- SCHEMAS --------------------
class MaterialSchema(BaseModel):
    text: Optional[str]
    doc_id: int
    embedding: List[float]

class MaterialMetadataSchema(BaseModel):
    material_id: int

class VideoMetadataSchema(BaseModel):
    video_id: str
    length: int

class VideoTranscriptSchema(BaseModel):
    video_id: int
    chunk_id: int
    start_time: float
    end_time: float
    text: str
    embedding: List[float]

# -------------------- ENDPOINTS --------------------
# MATERIAL

class AlloyDB:
    def __init__(self):
        self.router = APIRouter()
        self.router.add_api_route("/material-post", self.create_material, methods=["POST"])
        self.router.add_api_route("/material-get", self.get_all_materials, methods=["GET"])
        self.router.add_api_route("/material-delete", self.delete_material, methods=["DELETE"])
        self.router.add_api_route("/material-metadata-post", self.create_material_metadata, methods=["POST"])
        self.router.add_api_route("/material-metadata-get", self.get_all_material_metadata, methods=["GET"])
        self.router.add_api_route("/material-metadata-delete", self.delete_material_metadata, methods=["DELETE"])
        self.router.add_api_route("/video-metadata-post", self.create_video_metadata, methods=["POST"])
        self.router.add_api_route("/video-metadata-get", self.get_all_video_metadata, methods=["GET"])
        self.router.add_api_route("/video-metadata-delete", self.delete_video_metadata, methods=["DELETE"])
        self.router.add_api_route("/video-transcript-post", self.create_video_transcript, methods=["POST"])
        self.router.add_api_route("/video-transcript-get", self.get_all_video_transcripts, methods=["GET"])
        self.router.add_api_route("/video-transcript-delete", self.delete_video_transcript, methods=["DELETE"])

    async def create_material(self, material: MaterialSchema, db: Session = Depends(get_db)):
        db_material = Material(**material.model_dump())
        db.add(db_material)
        db.commit()
        db.refresh(db_material)
        return db_material

    async def get_all_materials(self, db: Session = Depends(get_db)):
        return db.query(Material).all()

    async def delete_material(self, material_id: int, db: Session = Depends(get_db)):
        material = db.query(Material).get(material_id)
        if not material:
            raise HTTPException(status_code=404, detail="Material not found")
        db.delete(material)
        db.commit()
        return {"message": "Material deleted"}

    async def create_material_metadata(self, meta: MaterialMetadataSchema, db: Session = Depends(get_db)):
        db_meta = Material_Metadata(**meta.dict())
        db.add(db_meta)
        db.commit()
        db.refresh(db_meta)
        return db_meta

    async def get_all_material_metadata(self, db: Session = Depends(get_db)):
        return db.query(Material_Metadata).all()

    async def delete_material_metadata(self, meta_id: int, db: Session = Depends(get_db)):
        meta = db.query(Material_Metadata).get(meta_id)
        if not meta:
            raise HTTPException(status_code=404, detail="Metadata not found")
        db.delete(meta)
        db.commit()
        return {"message": "Metadata deleted"}

    async def create_video_metadata(self, video: VideoMetadataSchema, db: Session = Depends(get_db)):
        db_video = Video_Metadata(**video.dict())
        db.add(db_video)
        db.commit()
        db.refresh(db_video)
        return db_video

    async def get_all_video_metadata(self, db: Session = Depends(get_db)):
        return db.query(Video_Metadata).all()

    async def delete_video_metadata(self, video_id: int, db: Session = Depends(get_db)):
        video = db.query(Video_Metadata).get(video_id)
        if not video:
            raise HTTPException(status_code=404, detail="Video metadata not found")
        db.delete(video)
        db.commit()
        return {"message": "Video metadata deleted"}

    async def create_video_transcript(self, transcript: VideoTranscriptSchema, db: Session = Depends(get_db)):
        db_transcript = Video_Transcript(**transcript.dict())
        db.add(db_transcript)
        db.commit()
        db.refresh(db_transcript)
        return db_transcript

    async def get_all_video_transcripts(self, db: Session = Depends(get_db)):
        return db.query(Video_Transcript).all()

    async def delete_video_transcript(self, transcript_id: int, db: Session = Depends(get_db)):
        transcript = db.query(Video_Transcript).get(transcript_id)
        if not transcript:
            raise HTTPException(status_code=404, detail="Transcript not found")
        db.delete(transcript)
        db.commit()
        return {"message": "Transcript deleted"}

app = FastAPI()
alloy_db = AlloyDB()
app.include_router(alloy_db.router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)