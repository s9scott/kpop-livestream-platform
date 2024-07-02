import React, { useState } from 'react';
import axios from 'axios';

const VideoHeader = ({ setVideoId, videoId }) => {
  const [url, setUrl] = useState('');
  const [isShowing, setShowing] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newVideoId = extractVideoId(url);
    setVideoId(newVideoId);

    try {
      const response = await axios.post('http://localhost:3001/setVideoId', { videoId: newVideoId });
      console.log('Response from backend:', response.data);
    } catch (error) {
      console.error('Error sending video ID to the backend:', error);
    }
  };

  const handleReset = () => {
    localStorage.removeItem('videoPlayerSettings');
    localStorage.removeItem('chatSettings');
    
    localStorage.setItem('lastVideoId', videoId);
    window.location.reload();
  };

  const extractVideoId = (url) => {
    const urlParams = new URLSearchParams(new URL(url).search);
    return urlParams.get('v'); // Extracts 'v' parameter from YouTube URL
  };

  const toggle = () => {
    const header = document.getElementsByClassName("header")[0];
    const toggleBtn = document.getElementsByClassName("toggle-btn")[0];
    if (header) {
      if (!isShowing) {
        header.classList.remove('slide');
        toggleBtn.classList.remove('slide');
        header.classList.add('slideReverse');
        toggleBtn.classList.add('slideReverse')
        setShowing(true);
      } else {
        header.classList.add('slide');
        toggleBtn.classList.add('slide');
        header.classList.remove('slideReverse');
        toggleBtn.classList.remove('slideReverse');
        setShowing(false);
      }
    }
  };
  
  const handleAuthorizeClick = async () => {
    try {
      window.location.href = 'http://localhost:3001/authorize';
    } catch (error) {
      console.error('Error authorizing:', error);
    }
  };

  return (
    <div className="header-container">
      <button type="button" className="toggle-btn" onClick={toggle}>↔</button>
      <form onSubmit={handleSubmit} className='header'>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter YouTube URL"
          className="url-input"
        />
        <button type="submit">Load Video</button>
        <button type="button" onClick={handleReset}>Reset Settings</button>
        <button type="button" onClick={handleAuthorizeClick} id="authorizeButton" className="auth">Authorize</button>
      </form>
    </div>
  );
};

export default VideoHeader;
