import React from 'react';

/**
 * `VideoPlayer` component renders an embedded YouTube video player.
 * 
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.videoId - The ID of the YouTube video to be played.
 * @returns {JSX.Element} The rendered `VideoPlayer` component.
 */
const VideoPlayer = ({ videoId }) => {
  // Constructs the URL for the YouTube iframe embed with the provided videoId
  const videoSrc = `https://www.youtube.com/embed/${videoId}?controls=1`;

  return (
    <div className="video-container fixed rounded-border border-accent md:w-video-desktop md:h-video-desktop w-video-mobile h-video-mobile md:top-video-desktop-top md:left-video-desktop-left">
      {/* Iframe to display the YouTube video */}
      <iframe
        width="100%"
        height="100%"
        src={videoSrc}
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Video Player"
      ></iframe>
    </div>
  );
};

export default VideoPlayer;
