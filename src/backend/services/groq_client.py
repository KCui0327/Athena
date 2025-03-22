from typing import List, Optional
import json
import os
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv
load_dotenv()
groq = Groq(api_key=os.getenv("GROQ_API_KEY"))

class SentenceSlicer(BaseModel):
    is_sentence_end: bool


def sentence_slicer(past_chunk: str, current_chunk: str, next_chunk: str) -> SentenceSlicer:
    chat_completion = groq.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": "You are a sentence slicer that outputs a boolean value. Please output true (lowercase) if the current chunk is the end of a sentence, and false (lowercase) otherwise. Make sure to use JSON-compliant boolean values (true/false, not True/False).\n"
                f"The JSON object must use the schema: {json.dumps(SentenceSlicer.model_json_schema(), indent=2)}"
            },
            {
                "role": "user",
                "content": f"Past chunk: {past_chunk}\nCurrent chunk: {current_chunk}\nNext chunk: {next_chunk}",
            },
        ],
        model="llama3-70b-8192",
        temperature=0,
        # Streaming is not supported in JSON mode
        stream=False,
        # Enable JSON mode by setting the response format
        response_format={"type": "json_object"},
    )
    json_content = chat_completion.choices[0].message.content
    return SentenceSlicer.model_validate_json(json_content)


def print_sentence_slicer(sentence_slicer: SentenceSlicer):
    print("Sentence slicer:", sentence_slicer.is_sentence_end)

if __name__ == "__main__":
    result_1 = sentence_slicer("Hello my name is", "John", "Doe")
    print_sentence_slicer(result_1)


    result_2 = sentence_slicer("what is going on", "I am going to sleep", "have a good night!")
    print_sentence_slicer(result_2)
