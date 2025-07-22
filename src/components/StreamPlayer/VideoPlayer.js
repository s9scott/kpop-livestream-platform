/**
 * @file VideoPlayer.js
 * @author Simon Tenedero, Jonas Matulis
 * @created 2024-XX-XX
 * @lastModified 2025-06-04
 * @desc file containing VideoPlayer
 */

import React from 'react';

/**
 * `VideoPlayer` component renders an embedded YouTube video player.
 * 
 * @param {string} videoId - The ID of the YouTube video to be played.
 * @param {Boolean} chatOpen - StateVariable tracking if chat is open or not
 * 
 * @returns {JSX.Element} The rendered `VideoPlayer` component.
 */
const VideoPlayer = ({ videoId, chatOpen}) => {
  // Constructs the URL for the YouTube iframe embed with the provided videoId
  const videoSrc = `https://www.youtube.com/embed/${videoId}?controls=1&rel=0&modestbranding=1&playsinline=1`;

  //video-container fixed rounded-border border-accent md:w-video-desktop md:h-video-desktop w-video-mobile h-video-mobile md:top-video-desktop-top md:left-video-desktop-left

  return (
    <div className={`
      rounded-xl overflow-hidden
      aspect-video mb-3

      desktop:w-[55vw]
      xl:w-video-iPadPro-landscape
      ipadpro-portrait:w-[78vw]
      lg:w-video-tablet-landscape
      ipadmini-landscape:w-[39vw]
      ipadmini-portrait:w-[78vw]
      iphone-landscape:w-[350px]
      sm:w-video-mobile-landscape
      w-video-mobile-portrait

      ${!chatOpen && 'landscape:!w-[75vw]'}

      `}
    >
      {/*iphone-landscape:min-h-[300px] iphone-landscape:max-w-[425px] - this style is to help with iPhone landscape styles, since md styles apply to it too*/}

      {/* Iframe to display the YouTube video */}
      <iframe
        width="100%"
        height="100%"
        src={videoSrc}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Video Player"
      ></iframe>
    </div>
  );
};

export default VideoPlayer;
