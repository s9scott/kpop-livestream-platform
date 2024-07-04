// Chat.js
import React, { useState } from 'react';
import DraggableResizable from './DraggableResizable';
import NativeChat from './NativeChat';

const Chat = ({ videoId, settings, onResizeStop, onDragStop }) => {
  const [useNativeChat, setUseNativeChat] = useState(false); // State to toggle between YouTube chat and native chat

  const toggleChat = () => {
    setUseNativeChat(prev => !prev);
  };

  const chatSrc = `https://www.youtube.com/live_chat?v=${videoId}&embed_domain=localhost`;

  return (
    <DraggableResizable
      defaultWidth={settings.width}
      defaultHeight={settings.height}
      defaultX={settings.x}
      defaultY={settings.y}
      onResizeStop={onResizeStop}
      onDragStop={onDragStop}
    >
      <div className="chat-container" style={{ width: '100%', height: '100%', position: 'relative' }}>
        <button onClick={toggleChat} className="toggle-chat-button">
          {useNativeChat ? 'Switch to YouTube Chat' : 'Switch to Native Chat'}
        </button>
        {useNativeChat ? (
          <NativeChat videoId={videoId} settings={settings} />
        ) : (
          <iframe
            width="100%"
            height="100%"
            src={chatSrc}
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Live Chat"
          ></iframe>
        )}
      </div>
    </DraggableResizable>
  );
};

export default Chat;
