import functions_framework
import json
from flask import jsonify, request
from google.cloud import storage
from google.cloud import secretmanager

secret_client = None
bucket_name = None

def get_bucket_name():
    if bucket_name is None and secret_client is None:
        secret_client = secretmanager.SecretManagerServiceClient()
    
        name = "projects/genai-449/secrets/BUCKET_NAME/versions/latest"
        response = secret_client.access_secret_version(name=name)
        bucket_name = response.payload.data.decode("UTF-8")

    return bucket_name     

@functions_framework.http
def storage_api(request):
    # Get bucket and file information
    bucket_name = get_bucket_name()
    
    # Initialize storage client
    client = storage.Client()
    bucket = client.bucket(bucket_name)
    
    # List files
    if request.method == 'GET':
        files = [blob.name for blob in bucket.list_blobs()]
        return jsonify({"files": files})
    
    # Generate signed URL for upload
    elif request.method == 'POST':
        # Check if JSON was provided
        if not request.is_json:
            return jsonify({"error": "Missing JSON in request"}), 400
            
        request_json = request.get_json()
        file_name = request_json.get('filename')
        
        if not file_name:
            return jsonify({"error": "Missing filename in request"}), 400
            
        blob = bucket.blob(file_name)
        url = blob.generate_signed_url(
            version="v4",
            expiration=300,  # 5 minutes
            method="PUT"
        )
        return jsonify({"upload_url": url})
    
    return jsonify({"error": "Method not allowed"}), 405