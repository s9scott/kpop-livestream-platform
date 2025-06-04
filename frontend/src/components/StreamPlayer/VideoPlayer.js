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

  //video-container fixed rounded-border border-accent md:w-video-desktop md:h-video-desktop w-video-mobile h-video-mobile md:top-video-desktop-top md:left-video-desktop-left
  return (
    <div className="
      xl:w-video-desktop xl:h-video-desktop 
      lg:w-video-tablet-landscape lg:h-video-tablet-landscape
      ipadpro-portrait:min-w-[80vw] ipadpro-portrait:max-h-[35vh]
      md:w-video-tablet-portrait md:h-video-tablet-portrait
      iphone-landscape:min-h-[300px] iphone-landscape:max-w-[425px]
      sm:w-video-mobile-landscape sm:h-video-mobile-landscape 
      w-video-mobile-portrait h-video-mobile-portrait 
      rounded-xl overflow-hidden mb-10"
    >
      {/*iphone-landscape:min-h-[300px] iphone-landscape:max-w-[425px] - this style is to help with iPhone landscape styles, since md styles apply to it too*/}

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
