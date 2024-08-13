import React from 'react';
import Split from 'react-split';
import DraggableResizable from './DraggableResizable';

const VideoPlayer = ({ videoId, settings, onResizeStop, onDragStop }) => {
  const videoSrc = `https://www.youtube.com/embed/${videoId}`;

  return (
    
      <div className="video-container rounded-border border-accent size-full fixed">
        <iframe
          width="70%"
          height="90%"
          src={videoSrc}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          title="Video Player"
        ></iframe>
      </div>
  );
};

export default VideoPlayer;
