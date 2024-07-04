// SwitchableChat.js
import React, { useState } from 'react';
import DraggableResizable from './DraggableResizable';
import NativeChat from './NativeChat';
import '../styles/SwitchableChat.css';

const SwitchableChat = ({ videoId, settings, onResizeStop, onDragStop }) => {
  const [useNativeChat, setUseNativeChat] = useState(false);

  const toggleChat = () => {
    setUseNativeChat((prev) => !prev);
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
      <div className="switchable-chat-container" style={{ width: '100%', height: '100%', position: 'relative' }}>
        <div className="chat-toggle">
          <button onClick={toggleChat} className="toggle-chat-button">
            {useNativeChat ? 'Switch to YouTube Chat' : 'Switch to Native Chat'}
          </button>
        </div>
        <div className="chat-content" style={{ width: '100%', height: '100%' }}>
          {useNativeChat ? (
            <NativeChat settings={settings} onResizeStop={onResizeStop} onDragStop={onDragStop} />
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
      </div>
    </DraggableResizable>
  );
};

export default SwitchableChat;
