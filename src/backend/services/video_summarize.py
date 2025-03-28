import regex as re
from pytube import extract
import vertexai
from vertexai.generative_models import GenerativeModel, Part
from vertexai.preview.vision_models import ImageGenerationModel
from youtube_transcript_api import YouTubeTranscriptApi
from google.cloud import aiplatform
import os
from youtube import Youtube
from google.oauth2 import service_account



credentials = service_account.Credentials.from_service_account_file(
    '/Users/ambroseling/Projects/Athena/service_account.json'
)

# Initialize Vertex AI with credentials
PROJECT_ID = 'genai-genesis-454423'
vertexai.init(project=PROJECT_ID, location="us-central1", credentials=credentials)

text_model = GenerativeModel("gemini-1.5-flash-002")
image_model = ImageGenerationModel.from_pretrained("imagen-3.0-generate-002")

def summarize_video(link, type):
    contents = [
        # Text prompt
        "Generate a simple, one sentence summary for this video",
        #"Provide one caption for this video in a way that is intriguiging and clickbaity."
        #Youtube video of 3blue1brown
        Part.from_uri(link, type),
    ]
    response = text_model.generate_content(contents)
    return response.text

# TODO(developer): Image generation
def image_generation(desc):
    output_file = "input-image.png"
    prompt = f"Generate a cartoon picture for this description with simple colors and solid lines. This is the description: {desc}."
    # The text prompt describing what you want to see.
    print(prompt)
    images = image_model.generate_images(
        prompt=prompt,
        # Optional parameters
        number_of_images=1,
        language="en",
        # You can't use a seed value and watermark at the same time.
        # add_watermark=False,
        # seed=100,
        aspect_ratio="1:1",
        safety_filter_level="block_some",
        person_generation="allow_adult",
    )

    images[0].save(location=output_file, include_generation_parameters=False)

    # Optional. View the generated image in a notebook.
    images[0].show()

    print(f"Created output image using {len(images[0]._image_bytes)} bytes")
    # Example response:
    # Created output image using 1234567 bytes

# Function to get the most important section from the entire transcript
def get_most_important_section(transcript):

    contents = [
        {
            "role": "user",
            "parts": [
                {
                    "text": "Return the most important consequtive sentences of this transcript that talk about the most important topics of the video. Only return the exact sentences from the transcript. Do not go over 60 seconds of content. This is the transcript: " + transcript
                }
            ]
        }
    ]

    response = text_model.generate_content(contents)

    return response.text

if __name__ == "__main__":
    link = "https://www.youtube.com/watch?v=NdBG4gOeLvc"  
    #desc = summarize_video(link, type = "video/mp4")
    #image_generation(desc)
    id = extract.video_id(link)
    ytt_api = YouTubeTranscriptApi()
    fetched_transcript = ytt_api.fetch(id) 
    print(fetched_transcript)
    # Extract text, join it, remove commas, and fix spacing in one go
    #cleaned_text = " ".join(" ".join(snippet.text for snippet in fetched_transcript).replace(",", "").split())
    #print(cleaned_text)

    response = get_most_important_section(fetched_transcript)

    # Extract sentences using regex
    response.strip().lower()
    # print(response)

    time_stamps = [0, 0]
    for snippet in fetched_transcript:
        chunk = snippet.text
        if chunk.strip().lower() in response:
            if time_stamps[0] == 0:
                time_stamps[0] = snippet.start
            else:
                time_stamps[1] = snippet.start + snippet.duration
                
    output_path = "input-video.mp4"
    youtube = Youtube(os.getenv('YOUTUBE_API_KEY'))
    youtube.download_youtube_chunk(id, time_stamps[0], time_stamps[1], output_path)
    
    



