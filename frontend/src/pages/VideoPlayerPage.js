import React, { useState, useEffect } from 'react';
import VideoPlayer from '../components/VideoPlayer';
import Chat from '../components/Chat';
import VideoHeader from '../components/VideoHeader';

const VideoPlayerPage = () => {
  const defaultVideoPlayerSettings = { width: 750, height: 500, x: 70, y: 100 };
  const defaultChatSettings = { width: 300, height: 500, x: 900, y: 100 };

  const [videoId, setVideoId] = useState('');
  const [videoPlayerSettings, setVideoPlayerSettings] = useState(defaultVideoPlayerSettings);
  const [chatSettings, setChatSettings] = useState(defaultChatSettings);

  useEffect(() => {
    const savedVideoPlayerSettings = JSON.parse(localStorage.getItem('videoPlayerSettings'));
    const savedChatSettings = JSON.parse(localStorage.getItem('chatSettings'));
    const lastVideoId = localStorage.getItem('lastVideoId');

    if (savedVideoPlayerSettings) setVideoPlayerSettings(savedVideoPlayerSettings);
    if (savedChatSettings) setChatSettings(savedChatSettings);
    if (lastVideoId) {
      setVideoId(lastVideoId);
      localStorage.removeItem('lastVideoId');
    }
  }, []);

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

  return (
    <div className="video-player-page">
      <VideoHeader videoId={videoId} setVideoId={setVideoId} />
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

export default VideoPlayerPage;
