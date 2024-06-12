import React from 'react';
import DraggableResizable from './DraggableResizable';

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
      <div className="chat-container" style={{ width: '100%', height: '100%' }}>
        <iframe
          width="100%"
          height="100%"
          src={chatSrc}
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Live Chat"
        ></iframe>
      </div>
    </DraggableResizable>
  );
};

export default Chat;
