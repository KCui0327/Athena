import regex as re
from pytube import extract
import vertexai
from vertexai.generative_models import GenerativeModel, Part
from vertexai.preview.vision_models import ImageGenerationModel
from youtube_transcript_api import YouTubeTranscriptApi
from google.cloud import aiplatform
import os
from youtube import Youtube

# TODO (developer): update project id
PROJECT_ID = 'genai-454502'
vertexai.init(project=PROJECT_ID, location="us-central1")

text_model = GenerativeModel("gemini-1.5-flash-002")
image_model = ImageGenerationModel.from_pretrained("imagen-3.0-generate-002")

def summarize_video(link, type):
    contents = [
        # Text prompt
        "Describe this video in a few sentences.",
        #"Provide one caption for this video in a way that is intriguiging and clickbaity."
        #Youtube video of 3blue1brown
        Part.from_uri(link, type),
    ]

    response = text_model.generate_content(contents)
    #match = re.search(r"\*\*(.*?)\*\*", response.text)
    #caption = ''
    #if match:
    #    caption = match.group(1)
    #    print(caption)"""
    return response.text

# TODO(developer): Image generation
def image_generation(desc):
    output_file = "input-image.png"
    prompt = f"Generate a simple image based on the description. Ensure that there are absolutely no words, letters, or text in the image. The image should be purely visual with no readable content. This is the description: {desc}."
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
                    "text": "Return the most important consequtive sentences of this transcript that talk about the most important topics of the video. Only return the exact sentences from the transcript. This is the transcript: " + transcript
                }
            ]
        }
    ]

    response = text_model.generate_content(contents)

    return response.text

if __name__ == "__main__":
    link = "https://www.youtube.com/watch?v=_eh1conN6YM&ab_channel=BrianDouglas"  
    #desc = summarize_video(link, type = "video/mp4")
    #image_generation(desc)
    id = extract.video_id(link)
    ytt_api = YouTubeTranscriptApi()
    fetched_transcript = ytt_api.fetch(id) 
    print(fetched_transcript)
    # Extract text, join it, remove commas, and fix spacing in one go
    cleaned_text = " ".join(" ".join(snippet.text for snippet in fetched_transcript).replace(",", "").split())
    #print(cleaned_text)

    response = get_most_important_section(cleaned_text)

    # Extract sentences using regex
    response.strip().lower()
    print(response)

    time_stamps = [0, 0]
    for snippet in fetched_transcript:
        #print(snippet)
        chunk = snippet.text
        if chunk.strip().lower() in response:
            # Append the start time for the first match
            if time_stamps[0] == 0:
                time_stamps[0] = snippet.start
            # Always append the end time for subsequent matches
            else:
                time_stamps[1] = snippet.start + snippet.duration
                
    output_path = "input-video.mp4"
    youtube = Youtube(os.getenv('YOUTUBE_API_KEY'))
    youtube.download_youtube_chunk(id, time_stamps[0], time_stamps[1], output_path)
    
    



