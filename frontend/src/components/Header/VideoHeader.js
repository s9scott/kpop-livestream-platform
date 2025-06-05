import React, { useState, useEffect } from 'react';
import { fetchActiveStreams, addLiveStream, fetchYoutubeDetails, logWebsiteUsage, getVideoFromFirebase} from '../../utils/livestreamsUtils';
import { useNavigate, useLocation } from 'react-router-dom';
import { PlayCircleIcon } from '@heroicons/react/24/outline';
import { PlayIcon } from '@heroicons/react/24/solid';

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
export const VideoHeader = ({ setVideoId, videoId, videoUrl, setVideoUrl, user}) => {
  const [url, setUrl] = useState(''); // State to store the current URL input
  const [history, setHistory] = useState([]); // State to store video history
  const [error, setError] = useState(''); // State to store error messages
  const navigate = useNavigate(); // Hook for navigation
  const location = useLocation(); // Hook for location information

  const [isInputFocused, setIsInputFocused] = useState(false);


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
   * Gets video details either from firebase cache or youtube API as fallback
   * @param {string} videoId - The video ID to get details for
   * @returns {Object|null} Video details object or null if not found
   */

  const getVideoDetails = async (videoId) => {
    try{
      console.log(`Checking firebase for video ID: ${videoId}`);
      const cachedVideo = await getVideoFromFirebase(videoId);
      
      if (cachedVideo && cachedVideo.title) {
        console.log(`Found in firebase: ${cachedVideo.title}`);
        return {
          title: cachedVideo.title,
          source: 'firebase' // For debugging purposes
        };
      }

      console.log('Not in Firebase fetching from youtube API');
      const videoDetails = await fetchYoutubeDetails(videoId);
      
      if (videoDetails && videoDetails.title) {
        console.log(`Fetched from YouTube: ${videoDetails.title}`);
        return {
          title: videoDetails.title,
          source: 'youtube' // For debugging purposes
        };
      }

      console.log('Could not get details, using fallback');
      return {
        title: `Video ${videoId}`,
        source: 'fallback'
      };


    } catch (error) {
      console.error('Error getting video details:', error);
      return {
        title: `Video ${videoId}`,
        source: 'error'
      };
    }
  }



  /**
   * Loads video details based on the provided URL, updates history, and navigates to the load-live route.
   * 
   * @param {string} url - The URL of the video to be loaded.
   */

  const loadVideo = async (url) => {
    const newVideoId = extractVideoId(url);
    if (newVideoId) {

      //const videoDetails = await fetchYoutubeDetails(newVideoId);
      //const title = videoDetails ? videoDetails.title : `Video ${newVideoId}`;

      const videoDetails = await getVideoDetails(newVideoId);
      const title = videoDetails.title;

      setVideoId(newVideoId);
      localStorage.setItem('lastVideoId', newVideoId);
      updateHistory(title, url);

      await addLiveStream(newVideoId, title, url); //setDoc() in addLiveStream() handles duplicates if video has been added before
      fetchActiveStreams().then(setHistory);
      setError('');
      
      if (window.location.hash !== '#/load-live') {
        navigate('/load-live');
      }
      if (user) {
        logWebsiteUsage(user.uid, `User loaded video ID: ${newVideoId}, URL: ${url}, TITLED: ${title}.`)
      }
      console.log(`Video loaded - Source: ${videoDetails.source}, Title: ${title}`);
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
    <div className="w-full items-center justify-center bg-transparent">
      {/* Form for submitting a YouTube URL */}
      <form onSubmit={handleSubmit} className="relative justify-center w-full">
        <div className="flex items-center w-full rounded-lg overflow-hidden"
        
        >
          <input
          type="text"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setTimeout(() => setIsInputFocused(false), 200)} // Delay to allow click on dropdown
          placeholder="Enter YouTube URL"
          className="h-7 w-11/12 px-4 text-sm text-left text-zinc-400 focus:outline-none bg-white rounded-l-xl"
          style={{boxShadow: 'inset 0 6px 16px rgba(0, 0, 0, 0.2)'}}
        />

        <button 
          type="submit" 
          className="px-4 py-1 h-7 bg-white mr-2 my-1 focus:outline-none rounded-r-xl"
        >
          <PlayIcon className="w-5 h-5 text-gray-600 hover:text-gray-900 bg-transparent"/>
        </button>

        {isInputFocused && history.length > 0 && (
          <div className="absolute top-full mt-1 bg-gray-200 rounded-md shadow-lg border border-gray-300 max-h-60 overflow-y-auto z-50 w-11/12">
            {history.map((item, index) => (
              <div
                key={index}
                onMouseDown={() => handleHistoryClick(item.url)}
                className="flex justify-between items-center px-4 py-2 cursor-pointer hover:bg-gray-300 hover:text-black text-black"
              >
                <span className="flex-grow truncate pr-2">{item.title}</span>

                <span 
                  onMouseDown={(e) => {
                    e.stopPropagation(); 
                  }}
                  className="text-red-500 hover:text-red-600 text-xs cursor-pointer flex-shrink-0"
                >
                  delete
                </span>
              </div>
            ))}
          </div>
        )}
        </div>
        
      </form>
      {/* Display error message if there is an error */}
      {error && <span className="absolute bottom-0 ml-3 text-xs text-red-500">{error}</span>}
    </div>
  );
};

export default VideoHeader;
