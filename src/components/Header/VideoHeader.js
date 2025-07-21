import React, { useState } from 'react';
import { getVideoFromFirebase} from '../../utils/livestreamsUtils';
import { useNavigate } from 'react-router-dom'; //useLocation()
import { PlayIcon } from '@heroicons/react/24/solid';

/**
 * `VideoHeader` component handles video URL input, video loading, and video history management.
 * 
 * @param {Function} setVideoId - Function to update the current video ID.
 * @param {string} videoId - The current video ID.
 * @param {string} videoUrl - The current video URL.
 * @param {Function} setVideoUrl - Function to update the current video URL.
 * 
 * @returns {JSX.Element} The rendered `VideoHeader` component.
 */
export const VideoHeader = ({ setVideoId, videoUrl, setVideoUrl}) => {

  const [error, setError] = useState(''); // State to store error messages
  const navigate = useNavigate(); // Hook for navigation
  //const location = useLocation(); // Hook for location information

  const [isInputFocused, setIsInputFocused] = useState(false);

  const history = [{title:'🔴THE K-POP : 24/7 𝗟𝗜𝗩𝗘 (K-POP 24시간 실시간 스트리밍 채널)',url:'https://www.youtube.com/watch?v=JVocS7Yftw8'},]

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
 * Gets video details either from firebase cache or oEmbed API as fallback
 * 
 * @param {string} videoId - The video ID to get details for
 * @returns {Object} Video details object with title and source
 */
const getVideoDetails = async (videoId) => {
  try {
    console.log(`Checking firebase for video ID: ${videoId}`);
    const cachedVideo = await getVideoFromFirebase(videoId);
    
    // Use cached title if it exists and is not a placeholder
    if (cachedVideo && cachedVideo.title) {
      console.log('cache title=', cachedVideo.title);
      if (!/^Video\s[\w-]{6,}$/i.test(cachedVideo.title)) {
        console.log(`Found in firebase: ${cachedVideo.title}`);
        return {
          title: cachedVideo.title,
          source: 'firebase'
        };
      }
    }

    console.log('Not in Firebase, fetching from oEmbed API');
    
    // Get title from oEmbed
    const oEmbedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    
    const response = await fetch(oEmbedUrl);
    
    if (response.ok) {
      const data = await response.json();
      
      if (data.title) {
        console.log(`Fetched from oEmbed: ${data.title}`);
        return {
          title: data.title,
          source: 'oembed'
        };
      }
    }

    // Fallback if oEmbed fails
    console.log('oEmbed failed, using fallback');
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
};



  /**
   * Loads video details based on the provided URL, updates history, and navigates to the load-live route.
   * 
   * @param {string} url - The URL of the video to be loaded.
   */

  const loadVideo = async (url) => {
    const newVideoId = extractVideoId(url);

    if (newVideoId) {

      const videoDetails = await getVideoDetails(newVideoId, url);
      const title = videoDetails.title;

      setVideoId(newVideoId);
      localStorage.setItem('lastVideoId', newVideoId);
      setError('');
      
      if (window.location.hash !== '#/load-live') {
        navigate('/load-live');
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
