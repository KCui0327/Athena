import yt_dlp
import os
import requests
import googleapiclient.discovery
from dotenv import load_dotenv

load_dotenv()   

max_results = 10
page_token = None
query = "python"

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
    def display_yt_results(search_response:str):
        for search_result in search_response.search_results:
            print(f'Video ID: {search_result.video_id}')
            print(f'Title: {search_result.title}')
            print()

    def download_youtube_chunk(url, start_time, duration, output_path):
        """Download a specific chunk of a YouTube video"""
        chunk_filename = f"{output_path}/chunk_{start_time}_{duration}.mp3"
        ydl_opts = {
            'format': 'bestaudio/best',
            'outtmpl': chunk_filename,
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '128',
            }],
            'download_ranges': {
                'ranges': [(start_time, start_time + duration)],
            },
            'force_keyframes_at_cuts': True,
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
        
        return chunk_filename
     
if __name__ == "__main__":
    youtube = Youtube(os.getenv('YOUTUBE_API_KEY'))
    search_response = youtube.search_youtube('Linear regression')
    youtube.display_yt_results(search_response)
    video_id = search_response.search_results[0].video_id
    youtube.download_youtube_video(f'https://www.youtube.com/watch?v={video_id}', 'output')