import json
import random
import yt_dlp
import os
from pytube import extract
import requests
import googleapiclient.discovery
from youtube_transcript_api import YouTubeTranscriptApi
from dotenv import load_dotenv
from src.backend.services.pydantic_models import VideoSegment
from src.backend.services.gemini_client import Gemini, GeminiModel, GeminiEmbeddingModel
from src.backend.services.cohere_client import Cohere
from src.backend.services.groq_client import sentence_slicer, SentenceSlicer
import numpy as np
load_dotenv()   

max_results = 10
page_token = None
query = "python"
SIMLIARITY_THRESHOLD = 0.3

def cosine_similarity(a:list[float], b:list[float]) -> float:
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

class Search_Result:
    def __init__(self, search_result:dict) -> None:
        self.video_id=     search_result['id']['videoId']
        self.title=        search_result['snippet']['title']
        self.description=  search_result['snippet']['description']
        self.thumbnails=   search_result['snippet']['thumbnails']['default']['url']

class Search_Response:
    def __init__(self, search_response:dict) -> None:
        self.prev_page_token = search_response.get('prevPageToken')
        self.next_page_token = search_response.get('nextPageToken')
        items = search_response.get('items')

        self.search_results = []
        for item in items:
            search_result = Search_Result(item)
            self.search_results.append(search_result)


class Youtube:
    def __init__(self, api_key:str):
        self.api_key = api_key
        self.youtube = googleapiclient.discovery.build(serviceName='youtube', version='v3', developerKey=os.getenv('YOUTUBE_API_KEY'))

    def search_youtube(self, query:str, max_results:int=10, page_token:str=None):
        request = self.youtube.search().list(
            part="snippet", # search by keyword
            maxResults=max_results,
            pageToken=page_token, # optional, for going to next/prev result page
            q=query,
            videoCaption='closedCaption', # only include videos with captions
            type='video',   # only include videos, not playlists/channels
        )
        response = request.execute()
        search_response = Search_Response(response)
        return search_response
    
    def display_yt_results(self, search_response:Search_Response):
        for search_result in search_response.search_results:
            print(f'Video ID: {search_result.video_id}')
            print(f'Title: {search_result.title}')  
            print()

    def get_most_important_section(self, transcript, gemini):
        prompt = f"Return the most important consecutive sentences of this transcript that talk about the most important topics of the video. Only return the exact sentences from the transcript. Do not go over 60 seconds of content. This is the transcript: {transcript}"
        response = gemini.client.models.generate_content(model=gemini.model, contents=prompt)
        return response.text

    def download_youtube_transcript(self, video_id:str):
        ytt_api = YouTubeTranscriptApi()
        response = ytt_api.fetch(video_id)
        return response

    def process_transcript_alternative(self, video_id:str, gemini:Gemini):
        fetched_transcript = self.download_youtube_transcript(video_id)
        cleaned_text = " ".join(" ".join(snippet.text for snippet in fetched_transcript).replace(",", "").split())
        response = self.get_most_important_section(cleaned_text, gemini).strip().lower()
        time_stamps = [0, 0]
        transcript_segment = []
        
        for snippet in fetched_transcript:
            chunk = snippet.text
            if chunk.strip().lower() in response:
                if time_stamps[0] == 0:
                    time_stamps[0] = snippet.start
                else:
                    time_stamps[1] = snippet.start + snippet.duration
                transcript_segment.append({
                    "text": snippet.text,
                    "start": snippet.start,
                    "duration": snippet.duration
                })
        brainrot_video_path = os.path.join("src/backend/services/downloads", os.listdir("src/backend/services/downloads")[random.randint(0, len(os.listdir("src/backend/services/downloads")) - 1)])
        self.download_youtube_chunk(video_id, time_stamps[0], time_stamps[1], "src/backend/services/chunks", transcript_segment, overlay_video_path=brainrot_video_path)
   
    def process_transcript(self, video_id:str, target_str:str, transcript:list[dict], co_client:Cohere) -> list[VideoSegment]:
        # The transcript is a list of dictionaries, not an object with snippets attribute
        snippets = transcript
        target_embedding = co_client.embed([target_str]).embeddings.float[0]
        if not snippets:
            return []
        video_segment = {
            "text": "",
            "start_time": snippets[0].start,
            "end_time": snippets[0].start + snippets[0].duration,
            "video_id": video_id,
            "download": False,
            "embedding": [],
            "subtitles": []  # Add a field to store segment subtitles
        }
        video_segments = []
        chunk_id = 0
        for i, snippet in enumerate(snippets):
            current_chunk = snippet.text
            if i == 0:
                video_segment["text"] += current_chunk
                continue
            else:
                video_segment["text"] += " " + current_chunk
                
            video_segment["end_time"] = snippet.start + snippet.duration
            current_duration = video_segment["end_time"] - video_segment["start_time"]
            if i > 0 and i < len(snippets) - 1:
                past_chunk = snippets[i-1].text
                next_chunk = snippets[i+1].text
                is_sentence_end = sentence_slicer(past_chunk, current_chunk, next_chunk).is_sentence_end
                if (is_sentence_end and current_duration > 20) or current_duration >= 60:
                    chunk_id += 1
                    embedding = co_client.embed([video_segment["text"]]).embeddings.float[0]
                    video_segment["embedding"] = embedding
                    similarity = cosine_similarity(embedding, target_embedding)
                    print(f"Similarity: {similarity}")
                    if similarity > SIMLIARITY_THRESHOLD:
                        video_segment["download"] = True
                        video_segment["subtitles"] = self.extract_segment_subtitles(snippets, video_segment["start_time"], video_segment["end_time"])
                        random_int = random.randint(0, len(os.listdir("src/backend/services/downloads")) - 1)
                        brainrot_video_path = os.path.join("src/backend/services/downloads", os.listdir("src/backend/services/downloads")[random_int])
                        self.download_youtube_chunk(video_id, video_segment["start_time"], video_segment["end_time"], "chunks", video_segment["subtitles"], overlay_video_path=brainrot_video_path)
                        video_segment["chunk_id"] = chunk_id
                        video_segments.append(VideoSegment(**video_segment))
                    video_segment = {
                        "text": snippet.text,
                        "start_time": snippet.start,
                        "end_time": snippet.start + snippet.duration,
                        "video_id": video_id,
                        "download": False,
                        "embedding": [],
                        "subtitles": []  # Initialize as empty, will be calculated when needed
                    }

        if video_segment["text"] and (not video_segments or video_segments[-1].text != video_segment["text"]):
            embedding = co_client.embed([video_segment["text"]]).embeddings.float[0]
            video_segment["embedding"] = embedding
            if cosine_similarity(embedding, target_embedding) > SIMLIARITY_THRESHOLD:
                print(f"Found a segment: {video_segment['text']}")
                video_segment["download"] = True
                video_segment["subtitles"] = self.extract_segment_subtitles(snippets, video_segment["start_time"], video_segment["end_time"])
                self.download_youtube_chunk(video_id, video_segment["start_time"], video_segment["end_time"], "chunks", video_segment["subtitles"])
                video_segments.append(VideoSegment(**video_segment))
        return video_segments

    def extract_segment_subtitles(self, transcript:list[dict], start_time:float, end_time:float) -> list[dict]:
        """Extract subtitles for a specific segment of the video"""
        segment_subtitles = []
        for snippet in transcript:
            snippet_start = snippet.start
            snippet_end = snippet.start + snippet.duration
            
            # Check if this subtitle overlaps with our segment
            if snippet_end > start_time and snippet_start < end_time:
                segment_subtitles.append({
                    "text": snippet.text,
                    "start": max(snippet_start - start_time, 0),  # Relative to segment start
                    "duration": snippet.duration
                })
        
        return segment_subtitles

    def download_youtube_chunk(self, video_id:str, start_time:float, end_time:float, output_path:str, subtitles=None, overlay_video_path=None):
        """
        Download a specific chunk of a YouTube video as MP4 and optionally overlay another video with subtitles
        
        Args:
            url: YouTube video ID
            start_time: Start time in seconds
            end_time: End time in seconds
            output_path: Directory to save the output
            subtitles: List of subtitle dictionaries with text, start, and duration
            overlay_video_path: Path to the video to overlay (if None, no overlay is added)
        """
        os.makedirs(output_path, exist_ok=True)
        
        original_end_time = end_time
        duration = end_time - start_time
        if duration > 60:
            end_time = start_time + 60
            print(f"Limiting chunk duration to 60 seconds (1 minute), new end time: {end_time}")
        chunk_filename = f"{output_path}/chunk_{start_time}_{end_time}.mp4"
        final_output = f"{output_path}/final_{start_time}_{end_time}.mp4"
        
        # Skip if the final file already exists
        if os.path.exists(final_output):
            print(f"File {final_output} already exists, skipping processing")
            return final_output
            
        # Download the original chunk if it doesn't exist
        if not os.path.exists(chunk_filename):
            def download_range_func(info_dict, ydl):
                return [{
                    'start_time': start_time,
                    'end_time': end_time  # Using the potentially adjusted end_time
                }]
            
            ydl_opts = {
                'format': 'best[ext=mp4]/best',  # Get the best MP4 format
                'outtmpl': chunk_filename,
                'download_ranges': download_range_func,
                'force_keyframes_at_cuts': True,
                'quiet': True,  # Reduce output verbosity
                'no_warnings': True,
                'nooverwrites': True,  # Don't overwrite existing files
                'external_downloader_args': ['-loglevel', 'warning'],  # Reduce ffmpeg verbosity
            }
            
            try:
                with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                    ydl.download([f"https://www.youtube.com/watch?v={video_id}"])
            except Exception as e:
                print(f"Error downloading chunk {start_time}-{end_time}: {e}")
                return None
        
        # If no overlay video is specified, return the original chunk
        if not overlay_video_path:
            return chunk_filename
            
        # Create subtitles file if provided
        subtitles_file = None
        if subtitles:
                # Filter subtitles to only include those within our adjusted time range
            adjusted_subtitles = []
            for sub in subtitles:
                if sub['start'] < (end_time - start_time):
                    # Make sure subtitle end doesn't exceed our 60-second limit
                    sub_end = sub['start'] + sub['duration']
                    if sub_end > 60:
                        sub['duration'] = 60 - sub['start']
                    adjusted_subtitles.append(sub)
                
            subtitles_file = f"{output_path}/subs_{start_time}_{end_time}.srt"
            self.create_srt_file(adjusted_subtitles, subtitles_file)
        
        chunk_duration = end_time - start_time
        
        # Use ffmpeg to create the final video with overlay and subtitles
        try:
            import subprocess
            
            # Verify the chunk file exists and get its actual duration
            if not os.path.exists(chunk_filename):
                print(f"Error: Downloaded chunk file {chunk_filename} does not exist")
                return None
            
            duration_cmd = [
                'ffprobe', '-v', 'error', '-show_entries', 'format=duration', 
                '-of', 'default=noprint_wrappers=1:nokey=1', chunk_filename
            ]
            actual_chunk_duration = float(subprocess.check_output(duration_cmd).decode('utf-8').strip())
            print(f"Actual chunk duration: {actual_chunk_duration} seconds")
            
            # Get the duration of the overlay video to calculate loop
            overlay_duration_cmd = [
                'ffprobe', '-v', 'error', '-show_entries', 'format=duration', 
                '-of', 'default=noprint_wrappers=1:nokey=1', overlay_video_path
            ]
            overlay_duration = float(subprocess.check_output(overlay_duration_cmd).decode('utf-8').strip())
            
            # Build the ffmpeg command
            cmd = [
                'ffmpeg', '-y',  # Overwrite output files
                '-i', chunk_filename,  # Input 1: YouTube chunk
                '-i', overlay_video_path,  # Input 2: Overlay video
                '-filter_complex',
                # Stack the videos vertically, loop the bottom video as needed
                f'[0:v]setpts=PTS-STARTPTS,trim=0:{min(actual_chunk_duration, 60)}[top];' +
                f'[1:v]loop={max(1, int(min(actual_chunk_duration, 60)/overlay_duration))}:size={int(min(actual_chunk_duration, 60)*25)}:' +
                f'start=0,setpts=PTS-STARTPTS,trim=0:{min(actual_chunk_duration, 60)}[bottom];' +
                f'[top][bottom]vstack=inputs=2[v]'
            ]
            
            if subtitles_file:
                cmd[-1] += f';[v]subtitles={subtitles_file}:force_style=\'FontSize=24,Alignment=2\'[outv]'
                cmd.extend(['-map', '[outv]'])
            else:
                cmd.extend(['-map', '[v]'])
            
            cmd.extend([
                '-map', '0:a', 
                '-af', f'atrim=0:{min(actual_chunk_duration, 60)}', 
                '-t', f'{min(actual_chunk_duration, 60)}',  # Explicitly limit output duration
                final_output
            ])
            
            subprocess.run(cmd, check=True)
            
            # Verify the final output duration
            final_duration_cmd = [
                'ffprobe', '-v', 'error', '-show_entries', 'format=duration', 
                '-of', 'default=noprint_wrappers=1:nokey=1', final_output
            ]
            final_duration = float(subprocess.check_output(final_duration_cmd).decode('utf-8').strip())
            print(f"Final output duration: {final_duration} seconds")
            
            # Remove the chunk file after successful creation of the final output
            if os.path.exists(chunk_filename) and os.path.exists(final_output):
                os.remove(chunk_filename)
                print(f"Removed temporary chunk file: {chunk_filename}")
                
                # Also remove subtitle file if it exists
                if subtitles_file and os.path.exists(subtitles_file):
                    os.remove(subtitles_file)
                    print(f"Removed temporary subtitle file: {subtitles_file}")
            
            return final_output
            
        except Exception as e:
            print(f"Error creating overlay video: {e}")
            # Return the original chunk if overlay fails
            return chunk_filename
            
    def download_youtube_video(self, video_id, output_path, cookies_file=None, browser_cookies=None):
        """
        Download a YouTube video
        
        Args:
            video_id: YouTube video ID
            output_path: Directory to save the output
            cookies_file: Path to cookies file for authentication
            browser_cookies: Browser name to extract cookies from (e.g., 'chrome', 'firefox')
        """
        os.makedirs(output_path, exist_ok=True)
        output_file = f"{output_path}/{video_id}.mp4"
        
        ydl_opts = {
            'format': 'best[ext=mp4]/best',
            'outtmpl': output_file,
            'quiet': True,
            'no_warnings': True,
            'nooverwrites': True,
        }
        
        # Add authentication options
        if cookies_file and os.path.exists(cookies_file):
            ydl_opts['cookiefile'] = cookies_file
        elif browser_cookies:
            ydl_opts['cookiesfrombrowser'] = (browser_cookies,)
        
        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                ydl.download([f"https://www.youtube.com/watch?v={video_id}"])
            return output_file
        except Exception as e:
            print(f"Error downloading video {video_id}: {e}")
            return None

    def create_srt_file(self, subtitles:list[dict], output_file:str):
        """Create an SRT subtitle file from a list of subtitle dictionaries"""
        with open(output_file, 'w', encoding='utf-8') as f:
            for i, sub in enumerate(subtitles, 1):
                start_time_str = self.format_time(sub['start'])
                end_time_str = self.format_time(sub['start'] + sub['duration'])
                
                f.write(f"{i}\n")
                f.write(f"{start_time_str} --> {end_time_str}\n")
                f.write(f"{sub['text']}\n\n")
                
    def format_time(self, seconds:float) -> str:
        """Format seconds as HH:MM:SS,mmm for SRT files"""
        hours = int(seconds // 3600)
        minutes = int((seconds % 3600) // 60)
        seconds = seconds % 60
        return f"{hours:02d}:{minutes:02d}:{int(seconds):02d},{int((seconds % 1) * 1000):03d}"

if __name__ == "__main__": 
    video_id_visited = []
    target_str = input("Enter the target string: ")
    youtube = Youtube(os.getenv('YOUTUBE_API_KEY'))
    search_response = youtube.search_youtube(target_str)
    gemini    = Gemini(os.getenv('GEMINI_API_KEY'), GeminiModel.FLASH, GeminiEmbeddingModel.EMBEDDING)
    co_client = Cohere(os.getenv('COHERE_API_KEY'))
    while search_response.next_page_token or search_response.prev_page_token:
        for i,search_result in enumerate(search_response.search_results):
            if search_result.video_id not in video_id_visited:
                print(f"\nProcessing video {search_result.video_id}...")
                print(f"__________________________________________________________")
                video_id_visited.append(search_result.video_id)
                video_id = search_result.video_id
                transcript = youtube.download_youtube_transcript(video_id)
                random_int = random.randint(0, 1)
                if random_int == 0:
                    video_segments = youtube.process_transcript(video_id, target_str, transcript, co_client)
                else:
                    video_segments = youtube.process_transcript_alternative(video_id, gemini)
                if len(video_segments) > 0:
                    print(f"Found {len(video_segments)} segments")
                    for segment in video_segments:
                        print(segment.text)
