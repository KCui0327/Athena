from fastapi import FastAPI
from pydantic import BaseModel
from google.cloud import storage, secretmanager
from google.oauth2 import service_account
from dotenv import load_dotenv
import os
import json

# Load environment variables from .env
load_dotenv()

# Get project ID and credentials path from .env
project_id = os.environ.get("GOOGLE_CLOUD_PROJECT")
key_path = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")

# Create credentials and clients
credentials = service_account.Credentials.from_service_account_file(key_path)
storage_client = storage.Client(project=project_id, credentials=credentials)
secret_client = secretmanager.SecretManagerServiceClient(credentials=credentials)

# Cached bucket name
bucket_name = None

def get_bucket_name():
    global bucket_name
    if bucket_name is None:
        bucket_name = os.environ.get("BUCKET_NAME")
        if not bucket_name:
            # fallback: try fetching from secret manager
            secret_name = f"projects/{project_id}/secrets/BUCKET_NAME/versions/latest"
            response = secret_client.access_secret_version(name=secret_name)
            bucket_name = response.payload.data.decode("UTF-8")
    return bucket_name

class FileRequest(BaseModel):
    filename: str

app = FastAPI()

@app.get("/storage-get")
def list_files():
    bucket = storage_client.bucket(get_bucket_name())
    files = [blob.name for blob in bucket.list_blobs()]
    return {"files": files}

@app.post("/storage-post")
def generate_signed_url(data: FileRequest):
    bucket = storage_client.bucket(get_bucket_name())
    blob = bucket.blob(data.filename)
    url = blob.generate_signed_url(
        version="v4",
        expiration=300,
        method="PUT"
    )
    return {"upload_url": url}

@app.delete("/storage-delete")
def delete_file(data: FileRequest):
    bucket = storage_client.bucket(get_bucket_name())
    blob = bucket.blob(data.filename)
    if blob.exists():
        blob.delete()
        return {"message": f"File '{data.filename}' deleted successfully."}
    else:
        return {"error": f"File '{data.filename}' not found."}, 404
