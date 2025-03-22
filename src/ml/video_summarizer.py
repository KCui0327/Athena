import vertexai
from vertexai.generative_models import GenerativeModel, Part

# TODO (developer): update project id
PROJECT_ID = 'gen-lang-client-0178361373'
vertexai.init(project=PROJECT_ID, location="us-central1")

model = GenerativeModel("gemini-1.5-flash-002")

contents = [
    "Summarize this video.",
    Part.from_uri("https://www.youtube.com/watch?v=aircAruvnKk&t=1s&ab_channel=3Blue1Brown", "video/mp4"),
]

response = model.generate_content(contents)
print(response.text)
