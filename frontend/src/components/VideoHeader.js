import React from 'react';
import { useState } from 'react';


const Header = ({ videoId, setVideoId, }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newVideoId = extractVideoId(url);
    setVideoId(newVideoId);
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
      let hidden = header.getAttribute("hidden");

      if (hidden) {
        header.removeAttribute("hidden");
        toggleBtn.classList.remove('slide');
        toggleBtn.classList.add('slideReverse')
      } else {
        toggleBtn.classList.add('slide');
        toggleBtn.classList.remove('slideReverse')
        header.setAttribute("hidden", "hidden");

      }
    }
  }

  

  return (
    <div className="header-container">
      <button type="button" className="toggle-btn" onClick={toggle}>↔</button>
      <form onSubmit={handleSubmit} className='header'>
        <button type="button" className="home" onClick={() => window.location.reload() }>Home</button>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter video URL"
          className="url-input"
        />
        <button type="submit">Load Video</button>
        <button type="button" onClick={handleReset}>Reset Settings</button>
      </form>
    </div>
  );
};

export default Header;