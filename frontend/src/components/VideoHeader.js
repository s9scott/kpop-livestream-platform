import React, { useState, useEffect } from 'react';
import '../styles/VideoHeader.css' 

const VideoHeader = ({ setVideoId, videoId }) => {
  const [url, setUrl] = useState('');
  const [isShowing, setShowing] = useState(true);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('videoHistory')) || [];
    setHistory(savedHistory);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newVideoId = extractVideoId(url);
    if (newVideoId) {
      setVideoId(newVideoId);
      localStorage.setItem('lastVideoId', newVideoId);
      updateHistory(url);
      setError('');
    } else {
      setError('Invalid YouTube URL');
    }
  };

  const handleReset = () => {
    localStorage.removeItem('videoPlayerSettings');
    localStorage.removeItem('chatSettings');
    localStorage.setItem('lastVideoId', videoId);
    window.location.reload();
  };

  const extractVideoId = (url) => {
    try {
      const urlParams = new URLSearchParams(new URL(url).search);
      return urlParams.get('v'); // Extracts 'v' parameter from YouTube URL
    } catch {
      return null;
    }
  };

  const updateHistory = (url) => {
    const newHistory = [url, ...history.filter((item) => item !== url)];
    setHistory(newHistory);
    localStorage.setItem('videoHistory', JSON.stringify(newHistory));
  };

  const handleHistoryClick = (url) => {
    setUrl(url);
    const newVideoId = extractVideoId(url);
    setVideoId(newVideoId);
    localStorage.setItem('lastVideoId', newVideoId);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('videoHistory');
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
        <button type="button" onClick={clearHistory}>Clear History</button>
      </form>
      {error && <p className="error-message">{error}</p>}
      <div className="video-history">
        <h4>Video History</h4>
        <ul>
          {history.map((item, index) => (
            <li key={index} onClick={() => handleHistoryClick(item)}>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VideoHeader;
