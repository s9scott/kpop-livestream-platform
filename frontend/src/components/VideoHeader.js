import React, { useState, useEffect } from 'react';
import { fetchActiveStreams, addLiveStream, fetchVideoDetails } from '../utils/firestoreUtils';
import '../styles/VideoHeader.css';

const VideoHeader = ({ setVideoId, videoId }) => {
  const [url, setUrl] = useState('');
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');
  const [activeStreams, setActiveStreams] = useState([]);
  const [isHistoryOpen, setHistoryOpen] = useState(false);
  const [isStreamsOpen, setStreamsOpen] = useState(false);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('videoHistory')) || [];
    setHistory(savedHistory);
    fetchActiveStreams().then(setActiveStreams);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newVideoId = extractVideoId(url);
    if (newVideoId) {
      const videoDetails = await fetchVideoDetails(newVideoId);
      const title = videoDetails ? videoDetails.title : `Video ${newVideoId}`;
      setVideoId(newVideoId);
      localStorage.setItem('lastVideoId', newVideoId);
      updateHistory(title, url);
      await addLiveStream(newVideoId, title, url);
      fetchActiveStreams().then(setActiveStreams);
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
      return urlParams.get('v');
    } catch {
      return null;
    }
  };

  const updateHistory = (title, url) => {
    const newHistory = [{ title, url }, ...history.filter((item) => item.url !== url)];
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

  const handleActiveStreamClick = (videoId) => {
    setVideoId(videoId);
    localStorage.setItem('lastVideoId', videoId);
  };

  const toggleHistory = () => setHistoryOpen(!isHistoryOpen);
  const toggleStreams = () => setStreamsOpen(!isStreamsOpen);

  return (
    <header className="header-container">
      <form onSubmit={handleSubmit} className="header">
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
      
      <div className="dropdowns">
        <div className="dropdown">
          <button className="dropdown-toggle" onClick={toggleHistory}>Video History</button>
          {isHistoryOpen && (
            <div className="dropdown-content">
              <ul>
                {history.map((item, index) => (
                  <li key={index} onClick={() => handleHistoryClick(item.url)}>
                    {item.title}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="dropdown">
          <button className="dropdown-toggle" onClick={toggleStreams}>Active Live Streams</button>
          {isStreamsOpen && (
            <div className="dropdown-content">
              <ul>
                {activeStreams.map((stream) => (
                  <li key={stream.id} onClick={() => handleActiveStreamClick(stream.id)}>
                    {stream.title || stream.id}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default VideoHeader;
