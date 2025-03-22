import os
from dotenv import load_dotenv
# Load .env variables
load_dotenv()

from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from services.summarizer import summarize_text
from services.ocr_mistral import extract_text_from_file


app = FastAPI()

# Allow frontend access
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
    summary = summarize_text(notes)
    return {"summary": summary}

@app.post("/upload-document/")
async def upload_document(file: UploadFile = File(...)):
    file_path = f"uploads/{file.filename}"
    contents = await file.read()

    with open(file_path, "wb") as f:
        f.write(contents)

    extracted_text = extract_text_from_file(file_path)
    return {"extracted_text": extracted_text}
