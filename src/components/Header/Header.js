/**
 * @file Header.js
 * @author Paola Bustos, Simon Tenedero, Jonas Matulis
 * @created 2024-XX-XX
 * @lastModified 2025-06-01
 * @desc file containing Header.js
 */

import React from "react";
import { useState } from 'react';
import ProfileMenu from './ProfileMenu';
import VideoHeader from './VideoHeader';
import PagesMenu from './PagesMenu';
import { PlayIcon } from '@heroicons/react/24/solid';

/**
 * Header component for displaying navigation and user options.
 * @param {string} videoId - Current video ID.
 * @param {Function} setVideoId - Function to update the video ID.
 * @param {string} videoUrl - URL of the current video.
 * @param {Function} setVideoUrl - Function to update the video URL.
 * 
 * @returns {JSX.Element} The rendered header component.
 */
const Header = ({
  videoId,
  setVideoId,
  videoUrl,
  setVideoUrl,
}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showMobileInput, setShowMobileInput] = useState(false); 

  /**
   * Toggles the visibility of the popup modal.
   */
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  return (
    <header className="relative flex items-center justify-between w-[100vw] h-[70px]" style={{boxShadow: "0 -1px 10px rgb(0, 0, 0)"}}>
      
      {/* Desktop View */}
      <div className="hidden md:flex items-center">
        <PagesMenu />
        <span className="text-base text-white ml-4 whitespace-nowrap mr-10">livestreaming prototype</span>
      </div>
      <div className="hidden md:flex w-1/2 justify-center">
        <VideoHeader setVideoId={setVideoId} videoId={videoId} videoUrl={videoUrl} setVideoUrl={setVideoUrl} />
      </div>

      <div className="hidden md:flex items-center">
        <ProfileMenu />
      </div>

      {/* Mobile View */}
      <div className="flex md:hidden w-full items-center">
        {!showMobileInput ? (
          <>
        <PagesMenu/>
        <span className="text-sm font-bold text-white ml-2 whitespace-nowrap">livestreaming prototype</span>
          <button 
                onClick={() => setShowMobileInput(true)}
                className="ml-4 mr-auto"
              >
                <PlayIcon className="w-8 h-8 border border-white rounded-full px-1"/>
          </button>
          <ProfileMenu />
        </>
        ) : (
          <div className="w-full flex items-center gap-2 px-4">
            <button 
              onClick={() => setShowMobileInput(false)}
              className="text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex-1 w-full">
              <VideoHeader setVideoId={setVideoId} videoId={videoId} videoUrl={videoUrl} setVideoUrl={setVideoUrl} />
            </div>
          </div>
        )}
      </div>

      {/* Popup Modal for Mobile */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-4 w-11/12 max-w-md">
            <button onClick={togglePopup} className="text-red-500 hover:text-red-800 float-right">✕</button>
            <div className="my-4">
              <VideoHeader setVideoId={setVideoId} videoId={videoId} videoUrl={videoUrl} setVideoUrl={setVideoUrl}/>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
