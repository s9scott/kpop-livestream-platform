import React, { useState, useEffect } from 'react';
import { fetchActiveStreams, addLiveStream, fetchYoutubeDetails } from '../../utils/firestoreUtils';
import { useNavigate, useLocation } from 'react-router-dom';
import VideoHistoryDropdown from './VideoHistoryDropdown';

/**
 * `VideoHeader` component handles video URL input, video loading, and video history management.
 * 
 * @param {Object} props - The properties passed to the component.
 * @param {Function} props.setVideoId - Function to update the current video ID.
 * @param {string} props.videoId - The current video ID.
 * @param {string} props.videoUrl - The current video URL.
 * @param {Function} props.setVideoUrl - Function to update the current video URL.
 * @returns {JSX.Element} The rendered `VideoHeader` component.
 */
export const VideoHeader = ({ setVideoId, videoId, videoUrl, setVideoUrl }) => {
  const [url, setUrl] = useState(''); // State to store the current URL input
  const [history, setHistory] = useState([]); // State to store video history
  const [error, setError] = useState(''); // State to store error messages
  const navigate = useNavigate(); // Hook for navigation
  const location = useLocation(); // Hook for location information

  useEffect(() => {
    // Load video history from local storage and fetch active streams on component mount
    const savedHistory = JSON.parse(localStorage.getItem('videoHistory')) || [];
    setHistory(savedHistory);
    fetchActiveStreams().then(setHistory);
  }, []);

  /**
   * Handles form submission by loading the video based on the current video URL.
   * 
   * @param {React.FormEvent<HTMLFormElement>} e - The form event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    await loadVideo(videoUrl);
  };

  /**
   * Loads video details based on the provided URL, updates history, and navigates to the load-live route.
   * 
   * @param {string} url - The URL of the video to be loaded.
   */
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
      }
    } else {
      setError('Invalid YouTube URL');
    }
  };

  /**
   * Handles the click event on a history item, updating the video URL and loading the selected video.
   * 
   * @param {string} url - The URL of the selected video.
   */
  const handleHistoryClick = async (url) => {
    setVideoUrl(url);
    await loadVideo(url);
  };

  /**
   * Extracts the video ID from a given YouTube URL.
   * 
   * @param {string} url - The YouTube video URL.
   * @returns {string|null} The extracted video ID or null if extraction fails.
   */
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
      console.log("Error with video id extraction!");
      return null;
    }
  };

  /**
   * Updates the video history with the new video title and URL.
   * 
   * @param {string} title - The title of the video.
   * @param {string} url - The URL of the video.
   */
  const updateHistory = (title, url) => {
    const newHistory = [{ title, url }, ...history.filter((item) => item.url !== url)];
    setHistory(newHistory);
    localStorage.setItem('videoHistory', JSON.stringify(newHistory));
  };

  /**
   * Clears the video history from both state and local storage.
   */
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('videoHistory');
  };

  return (
    <div className="md:bg-base-100 content-center w-9/12 items-center justify-center p-4 rounded-lg md:shadow-md">
      {/* Form for submitting a YouTube URL */}
      <form onSubmit={handleSubmit} className="flex items-center space-x-4 w-full">
        <input
          type="text"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="Enter YouTube URL"
          className="flex-grow w-fit p-2 text-sm text-left border border-gray-300 text-zinc-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="px-4 py-2 text-xsm bg-primary text-black whitespace-nowrap font-semibold rounded-md hover:bg-accent focus:outline-none focus:ring-2 focus:ring-blue-500">
          Load Video
        </button>
        {/* Dropdown for selecting video from history */}
        <VideoHistoryDropdown setVideoUrl={setVideoUrl} />
      </form>
      {/* Display error message if there is an error */}
      {error && <p className="ml-4 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default VideoHeader;
