import os
from datetime import datetime
from dotenv import load_dotenv
from sqlalchemy import (
    create_engine, Column, Integer, String, Float, Boolean,
    DateTime, ForeignKey, ARRAY
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid

# Load environment variables
load_dotenv()

# Read from .env

# Create the connection URL
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT", 6543)  # Default to 6543 if not specified
DB_NAME = os.getenv("DB_NAME")

# Create the connection URL
DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
engine = create_engine(DATABASE_URL)
# Base model
Base = declarative_base()

# Table definitions
class Material(Base):
    __tablename__ = 'materials'
    id = Column(Integer, primary_key=True)
    text = Column(String, nullable=True)
    doc_id = Column(ForeignKey('material_metadata.id'), nullable=False)
    chunk_id = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.now)
    embedding = Column(ARRAY(Float), nullable=False)

class Material_Metadata(Base):
    __tablename__ = 'material_metadata'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.now)
    video_url = Column(String, nullable=True)
    video_summary = Column(String, nullable=True)
    file_url = Column(String, nullable=True)
    user_id = Column(ForeignKey('users.id'), nullable=False)
    summary = Column(String, nullable=True)

class Video_Metadata(Base):
    __tablename__ = 'video_metadata'
    id = Column(Integer, primary_key=True)
    user_id = Column(ForeignKey('users.id'), nullable=False)
    video_id = Column(String, nullable=False)
    length = Column(Integer, nullable=False)
    video_summary = Column(String, nullable=True)
    video_url = Column(String, nullable=True)
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
    user_id = Column(ForeignKey('users.id'), nullable=False)
    question = Column(String, nullable=False)
    correct_answer = Column(String, nullable=False)
    choices = Column(ARRAY(String), nullable=False)
    created_at = Column(DateTime, default=datetime.now)
    doc_id = Column(ForeignKey('material_metadata.id'), nullable=False)

class Course(Base):
    __tablename__ = 'courses'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.now)

class Users(Base):
    __tablename__ = 'users'
    id = Column(String, primary_key=True)
    created_at = Column(DateTime, default=datetime.now)
# Run table creation
if __name__ == "__main__":
    Base.metadata.drop_all(engine)  # Add this line
    Base.metadata.create_all(engine)
    print("Tables created successfully.")