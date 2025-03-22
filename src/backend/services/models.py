import os
from datetime import datetime
from dotenv import load_dotenv
from sqlalchemy import (
    create_engine, Column, Integer, String, Float, Boolean,
    DateTime, ForeignKey, ARRAY
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

# Load environment variables
load_dotenv()

# Read from .env
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT", 5432)
DB_NAME = os.getenv("DB_NAME")

# Create the connection URL
DATABASE_URL = f"postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
engine = create_engine(DATABASE_URL)

# Base model
Base = declarative_base()

# Table definitions
class Material(Base):
    __tablename__ = 'materials'
    id = Column(Integer, primary_key=True)
    text = Column(String, nullable=True)
    doc_id = Column(ForeignKey('material_metadata.id'), nullable=False)
    created_at = Column(DateTime, default=datetime.now)
    embedding = Column(ARRAY(Float), nullable=False)

class Material_Metadata(Base):
    __tablename__ = 'material_metadata'
    id = Column(Integer, primary_key=True)
    material_id = Column(Integer, ForeignKey('materials.id'), nullable=False)
    created_at = Column(DateTime, default=datetime.now)

class Video_Metadata(Base):
    __tablename__ = 'video_metadata'
    id = Column(Integer, primary_key=True)
    video_id = Column(String, nullable=False)
    length = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.now)

class Video_Transcript(Base):
    __tablename__ = 'video_transcript'
    id = Column(Integer, primary_key=True)
    video_id = Column(ForeignKey('video_metadata.id'), nullable=False)
    chunk_id = Column(Integer, nullable=False)
    start_time = Column(Float, nullable=False)
    end_time = Column(Float, nullable=False)
    text = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.now)
    embedding = Column(ARRAY(Float), nullable=False)

class Questions(Base):
    __tablename__ = 'questions'
    id = Column(Integer, primary_key=True)
    question = Column(String, nullable=False)
    correct_answer = Column(String, nullable=False)
    choices = Column(ARRAY(String), nullable=False)
    created_at = Column(DateTime, default=datetime.now)

# Run table creation
if __name__ == "__main__":
    Base.metadata.create_all(engine)
    print("Tables created successfully.")
