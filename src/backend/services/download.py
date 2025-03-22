import os
from youtube import Youtube

if __name__ == "__main__":
    youtube = Youtube(os.getenv('YOUTUBE_API_KEY'))
    
    # The URL format should be just the video ID, not including the playlist parameter
    video_id = "-9lP95Qo-I0"  # Extracted from your original URL
    
    # Add authentication options
    cookies_file = os.path.expanduser("~/cookies.txt")  # Path to your cookies file
    
    # You can use either cookies_file or browser cookies
    # youtube.download_youtube_video(video_id, "downloads", cookies_file=cookies_file)
    
    # Or use browser cookies (choose one: chrome, firefox, edge, safari, etc.)
    youtube.download_youtube_video(video_id, "downloads", browser_cookies="chrome")