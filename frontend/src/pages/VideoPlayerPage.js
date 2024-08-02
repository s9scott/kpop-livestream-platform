import React, { useState, useEffect } from 'react';
import VideoPlayer from '../components/StreamPlayer/VideoPlayer';
import SwitchableChat from '../components/StreamPlayer/SwitchableChat';
import { logWebsiteUsage } from '../utils/firestoreUtils';

const VideoPlayerPage = ({ user }) => {
  const calculateDefaultSettings = () => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight - 150;
    const videoPlayerWidth = screenWidth * 0.65;
    const chatWidth = screenWidth * 0.35 - 50;

    return {
      videoPlayerSettings: { width: videoPlayerWidth, height: screenHeight, x: 20, y: 20 },
      chatSettings: { width: chatWidth, height: screenHeight, x: videoPlayerWidth + 40, y: 20 }
    };
  };

  const { videoPlayerSettings: defaultVideoPlayerSettings, chatSettings: defaultChatSettings } = calculateDefaultSettings();

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

  useEffect(() => {
    if (user) {
      logWebsiteUsage(user.uid, 'Visited VideoPlayerPage');
    }
  }, [user]);

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
    <div className="app-container">
      {videoId && (
        <>
          <VideoPlayer
            videoId={videoId}
            settings={videoPlayerSettings}
            onResizeStop={(data) => handleResizeStop('video', data)}
            onDragStop={(data) => handleDragStop('video', data)}
          />
          <SwitchableChat
            videoId={videoId}
            settings={chatSettings}
            onResizeStop={(data) => handleResizeStop('chat', data)}
            onDragStop={(data) => handleDragStop('chat', data)}
            user={user} // Pass user to SwitchableChat
          />
        </>
      )}
    </div>
  );
};

export default VideoPlayerPage;
