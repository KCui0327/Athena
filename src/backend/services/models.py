import sqlalchemy
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, ARRAY
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

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

