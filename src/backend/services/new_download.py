import os
import yt_dlp

def download_youtube_video(video_id:str, output_path:str, cookies_file:str=None, browser_cookies:str=None):
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
    

if __name__ == "__main__":
    download_youtube_video("Pt5_GSKIWQM", "downloads")
