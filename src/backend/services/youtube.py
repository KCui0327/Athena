import yt_dlp
import os
import requests
import googleapiclient.discovery
from youtube_transcript_api import YouTubeTranscriptApi
from dotenv import load_dotenv
from datatype import VideoSegment
from gemini import Gemini, GeminiModel, GeminiEmbeddingModel
load_dotenv()   

max_results = 10
page_token = None
query = "python"
SIMLIARITY_THRESHOLD = 0.84

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

    def download_youtube_transcript(self, video_id:str):
        ytt_api = YouTubeTranscriptApi()
        response = ytt_api.fetch(video_id)
        return response
    
    def process_transcript(self, video_id:str, target_str:str, transcript:list[dict], gemini:Gemini) -> list[VideoSegment]:
        # The transcript is a list of dictionaries, not an object with snippets attribute
        snippets = transcript
        target_embedding = gemini.generate_embedding(target_str)
        if not snippets:
            return []
            
        video_segment = {
            "text": "",
            "start_time": snippets[0].start,
            "end_time": snippets[0].start + snippets[0].duration,
            "video_id": video_id,
            "download": False
        }
        
        video_segments = []
        for i, snippet in enumerate(snippets):
            current_chunk = snippet.text
            
            # Add current chunk to the current segment
            if i == 0:
                video_segment["text"] += current_chunk
            else:
                video_segment["text"] += " " + current_chunk
                
            video_segment["end_time"] = snippet.start + snippet.duration
            if i > 0 and i < len(snippets) - 1:
                past_chunk = snippets[i-1].text
                next_chunk = snippets[i+1].text
                is_sentence_end = gemini.sentence_slicer(past_chunk, current_chunk, next_chunk).parsed
                if is_sentence_end and (video_segment["end_time"] - video_segment["start_time"] > 30):
                    video_segment["embedding"] = gemini.generate_embedding(video_segment["text"])
                    similarity = gemini.cosine_similarity(video_segment["embedding"], target_embedding)
                    video_segment["download"] = float(similarity) > float(SIMLIARITY_THRESHOLD)
                    video_segments.append(VideoSegment(**video_segment))
                    video_segment = {
                        "text": "",
                        "start_time": snippet.start + snippet.duration,
                        "end_time": snippet.start + snippet.duration,
                        "video_id": video_id,
                        "download": False
                    }
        
        # Add the last segment if it has content and isn't already added
        if video_segment["text"] and (not video_segments or video_segments[-1].text != video_segment["text"]):
            video_segment["embedding"] = gemini.generate_embedding(video_segment["text"])
            similarity = gemini.cosine_similarity(video_segment["embedding"], target_embedding)
            video_segment["download"] = float(similarity) > float(SIMLIARITY_THRESHOLD)
            video_segments.append(VideoSegment(**video_segment))
            
        return video_segments

    def download_youtube_chunk(self, url:str, start_time:float, end_time:float, output_path:str):
        """Download a specific chunk of a YouTube video as MP4"""
        os.makedirs(output_path, exist_ok=True)
        chunk_filename = f"{output_path}/chunk_{start_time}_{end_time}.mp4"
        
        # Skip if the file already exists
        if os.path.exists(chunk_filename):
            print(f"File {chunk_filename} already exists, skipping download")
            return chunk_filename
        def download_range_func(info_dict, ydl):
            return [{
                'start_time': start_time,
                'end_time': end_time
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
                ydl.download([f"https://www.youtube.com/watch?v={url}"])
            return chunk_filename
        except Exception as e:
            print(f"Error downloading chunk {start_time}-{end_time}: {e}")
            return None
     
if __name__ == "__main__":
    video_id_visited = []
    target_str = input("Enter the target string: ")
    youtube = Youtube(os.getenv('YOUTUBE_API_KEY'))
    search_response = youtube.search_youtube(target_str)

    while search_response.next_page_token or search_response.prev_page_token:
        for search_result in search_response.search_results:
            if search_result.video_id not in video_id_visited:
                print(f"\nProcessing video {search_result.video_id}...")
                print(f"__________________________________________________________")
                video_id_visited.append(search_result.video_id)
                video_id = search_result.video_id
                transcript = youtube.download_youtube_transcript(video_id)
                gemini = Gemini(os.getenv('GEMINI_API_KEY'), GeminiModel.FLASH, GeminiEmbeddingModel.EMBEDDING)
                video_segments = youtube.process_transcript(video_id, target_str, transcript, gemini)
                for i, segment in enumerate(video_segments):
                    if segment.download:
                        print(f"Downloading chunk {i} of {len(video_segments)}")
                        youtube.download_youtube_chunk(video_id, segment.start_time, segment.end_time, f'chunks/{i}')
                    