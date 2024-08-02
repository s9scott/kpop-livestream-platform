import React from 'react';
import DraggableResizable from './DraggableResizable';

const VideoPlayer = ({ videoId, settings, onResizeStop, onDragStop }) => {
  const videoSrc = `https://www.youtube.com/embed/${videoId}`;

  return (
    <DraggableResizable
      defaultWidth={settings.width}
      defaultHeight={settings.height}
      defaultX={settings.x}
      defaultY={settings.y}
      onResizeStop={onResizeStop}
      onDragStop={onDragStop}
    >
      <div className="video-container rounded-border size-full absolute">
        <iframe
          width="100%"
          height="100%"
          src={videoSrc}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          title="Video Player"
        ></iframe>
      </div>
    </DraggableResizable>
  );
};

export default VideoPlayer;
