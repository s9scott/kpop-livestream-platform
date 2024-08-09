import React, { useState, useEffect } from 'react';
import { fetchActiveStreams, addLiveStream, fetchYoutubeDetails } from '../../utils/firestoreUtils';
import { useNavigate, useLocation } from 'react-router-dom';
import VideoHistoryDropdown from './VideoHistoryDropdown';

export const VideoHeader = ({ setVideoId, videoId, videoUrl, setVideoUrl }) => {
  const [url, setUrl] = useState('');
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('videoHistory')) || [];
    setHistory(savedHistory);
    fetchActiveStreams().then(setHistory);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await loadVideo(videoUrl);
  };

  const loadVideo = async (url) => {
    const newVideoId = extractVideoId(url);
    if (newVideoId) {
      const videoDetails = await fetchYoutubeDetails(newVideoId);
      const title = videoDetails ? videoDetails.title : `Video ${newVideoId}`;
      setVideoId(newVideoId);
      localStorage.setItem('lastVideoId', newVideoId);
      updateHistory(title, url);
      await addLiveStream(newVideoId, title, url);
      fetchActiveStreams().then(setHistory);
      setError('');
      if (window.location.hash !== '#/load-live') {
        navigate('/load-live');
      } else {
      }
    } else {
      setError('Invalid YouTube URL');
    }
  };

  const handleHistoryClick = async (url) => {
    setVideoUrl(url);
    await loadVideo(url);
  };


  const extractVideoId = (url) => {
    try {
      const parsedUrl = new URL(url);
      const urlParams = new URLSearchParams(new URL(url).search);
      let id;
      // Case 1: Standard YouTube URL with 'v' query parameter
      if ((id = urlParams.get('v'))) {
        return id;
      }
      // Case 2: YouTube Shorts URL
      if (parsedUrl.pathname.startsWith('/shorts/')) {
        id = parsedUrl.pathname.split('/shorts/')[1];
        return id;
      }
      // Case 3: YouTube Live URL with 'live' query parameter
      if ((id = urlParams.get('live'))) {
        return id;
      }
      // Case 4: YouTube Live or other path-based URLs
      if (parsedUrl.pathname.startsWith('/live/')) {
        id = parsedUrl.pathname.split('/live/')[1];
        return id;
      }
      // Case 5: YouTube URL with shortened format
      if (parsedUrl.hostname === 'youtu.be') {
        id = parsedUrl.pathname.slice(1);
        return id;
      }
    } catch {
      console.log("Error with video id extraction!")
      return null;
    }
  };

  const updateHistory = (title, url) => {
    const newHistory = [{ title, url }, ...history.filter((item) => item.url !== url)];
    setHistory(newHistory);
    localStorage.setItem('videoHistory', JSON.stringify(newHistory));
  };


  const handleReset = () => {
    localStorage.removeItem('videoPlayerSettings');
    localStorage.removeItem('chatSettings');
    localStorage.setItem('lastVideoId', videoId);
    window.location.reload();
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('videoHistory');
  };

  return (
    <div className="bg-base-100 content-center w-9/12 items-center justify-center p-4 rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="flex items-center space-x-4 w-full">
        <input
          type="text"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="Enter YouTube URL"
          className="flex-grow w-fit p-2 text-sm text-left border border-gray-300 text-zinc-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="px-4 py-2 text-black whitespace-nowrap font-semibold bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
          Load Video
        </button>
        <button type="button" onClick={handleReset} className="px-4 py-2 text-black whitespace-nowrap font-semibold bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500">
          Reset Settings
        </button>
        <VideoHistoryDropdown setVideoUrl={setVideoUrl} />
      </form>
      {error && <p className="ml-4 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default VideoHeader;
