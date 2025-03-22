from pydantic import BaseModel

class Quiz(BaseModel):
    question: str
    answer: str
    choices: list[str]

class VideoSegment(BaseModel):
    start_time: float
    end_time: float
    text: str
    video_id: str
    download: bool = False
    chunk_id: int
