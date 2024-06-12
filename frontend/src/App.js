import React, { useState, useEffect } from 'react';
import VideoPlayer from './components/VideoPlayer';
import Chat from './components/Chat';
import './styles.css';

const App = () => {
  const defaultVideoPlayerSettings = { width: 750, height: 500, x: 100, y: 100 };
  const defaultChatSettings = { width: 300, height: 500, x: 900, y:  100};

  const [url, setUrl] = useState('');
  const [videoId, setVideoId] = useState('');
  const [videoPlayerSettings, setVideoPlayerSettings] = useState(defaultVideoPlayerSettings);
  const [chatSettings, setChatSettings] = useState(defaultChatSettings);

  useEffect(() => {
    const savedVideoPlayerSettings = JSON.parse(localStorage.getItem('videoPlayerSettings'));
    const savedChatSettings = JSON.parse(localStorage.getItem('chatSettings'));

    if (savedVideoPlayerSettings) setVideoPlayerSettings(savedVideoPlayerSettings);
    if (savedChatSettings) setChatSettings(savedChatSettings);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const videoId = extractVideoId(url);
    setVideoId(videoId);
  };

  const extractVideoId = (url) => {
    const urlParams = new URLSearchParams(new URL(url).search);
    return urlParams.get('v'); // Extracts 'v' parameter from YouTube URL
  };

  const handleResizeStop = (type, data) => {
    const { size, position } = data;
    if (type === 'video') {
      const newSettings = { ...videoPlayerSettings, width: size.width, height: size.height, x: position.x, y: position.y };
      setVideoPlayerSettings(newSettings);
      localStorage.setItem('videoPlayerSettings', JSON.stringify(newSettings));
    } else {
      const newSettings = { ...chatSettings, width: size.width, height: size.height, x: position.x, y: position.y };
      setChatSettings(newSettings);
      localStorage.setItem('chatSettings', JSON.stringify(newSettings));
    }
  };

  const handleDragStop = (type, data) => {
    const { x, y } = data;
    if (type === 'video') {
      const newSettings = { ...videoPlayerSettings, x, y };
      setVideoPlayerSettings(newSettings);
      localStorage.setItem('videoPlayerSettings', JSON.stringify(newSettings));
    } else {
      const newSettings = { ...chatSettings, x, y };
      setChatSettings(newSettings);
      localStorage.setItem('chatSettings', JSON.stringify(newSettings));
    }
  };
  const handleRefresh = () => {
    window.location.reload(); 
  }

  const handleReset = () => {
    setVideoPlayerSettings(defaultVideoPlayerSettings);
    setChatSettings(defaultChatSettings);
    localStorage.removeItem('videoPlayerSettings');
    localStorage.removeItem('chatSettings');
  };

  return (
    <div className="app-container">
      <form onSubmit={handleSubmit}>
        <button type="button" class="Home" onClick={handleRefresh}>Home</button>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter video URL"
          className="url-input"
        />
        <button type="submit">Load Video</button>
        <button type="button" onClick={handleReset}>Reset</button>
      </form>
      {videoId && (
        <VideoPlayer
          videoId={videoId}
          settings={videoPlayerSettings}
          onResizeStop={(data) => handleResizeStop('video', data)}
          onDragStop={(data) => handleDragStop('video', data)}
        />
      )}
      {videoId && (
        <Chat
          videoId={videoId}
          settings={chatSettings}
          onResizeStop={(data) => handleResizeStop('chat', data)}
          onDragStop={(data) => handleDragStop('chat', data)}
        />
      )}
    </div>
  );
};

export default App;
