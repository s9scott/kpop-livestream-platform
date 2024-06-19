// Chat.js
import React from 'react';
import DraggableResizable from './DraggableResizable';
import NativeChat from './NativeChat';

const Chat = ({ videoId, settings, onResizeStop, onDragStop }) => {
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
        <iframe
          width="100%"
          height="100%"
          src={chatSrc}
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Live Chat"
        ></iframe>
        <div className="native-chat-overlay" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          <NativeChat videoId={videoId} />
        </div>
      </div>
    </DraggableResizable>
  );
};

export default Chat;
