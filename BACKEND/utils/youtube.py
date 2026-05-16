import os
import requests
import logging

log = logging.getLogger(__name__)

def fetch_youtube_data():
    """
    YouTube API system has been removed as per user request.
    Users should manage channel stats manually in the admin panel.
    """
    return None

def _format_count(count_str):
    try:
        count = int(count_str)
        if count >= 1000000:
            return f"{count/1000000:.1f}M+"
        if count >= 1000:
            return f"{count/1000:.1f}K+"
        return str(count)
    except:
        return count_str
