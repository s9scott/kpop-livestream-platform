/**
 * @file Header.js
 * @author Paola Bustos, Simon Tenedero, Jonas Matulis
 * @created 2024-XX-XX
 * @lastModified 2025-06-01
 * @desc file containing Header.js
 */

import { useState, useEffect } from 'react';
import LightMode from '../../assets/LightMode.svg';
import NightMode from '../../assets/NightMode.svg';
import ProfileMenu from './ProfileMenu';
import VideoHeader from './VideoHeader';
import PagesMenu from './PagesMenu';
import LiveStreamsButton from './LiveStreamsButton';
import './styles/Header.css';
import { PlayIcon } from '@heroicons/react/24/solid';

/**
 * Header component for displaying navigation and user options.
 * @param {Object} props - Component properties.
 * @param {Object} props.user - Current user object.
 * @param {Function} props.setUser - Function to update the user state.
 * @param {string} props.videoId - Current video ID.
 * @param {Function} props.setVideoId - Function to update the video ID.
 * @param {string} props.videoUrl - URL of the current video.
 * @param {Function} props.setVideoUrl - Function to update the video URL.
 * @param {Array} props.activeUsers - List of active users.
 * @param {Array} props.privateChats - List of private chats.
 * @param {Array} props.invitations - List of chat invitations.
 * @param {Array} props.selectedChats - List of selected chats.
 * @param {Function} props.setSelectedChats - Function to update the selected chats.
 * @param {string} props.selectedChatId - ID of the selected chat.
 * @param {Function} props.setSelectedChatId - Function to update the selected chat ID.
 * @returns {JSX.Element} The rendered header component.
 */
const Header = ({
  user,
  setUser,
  videoId,
  setVideoId,
  videoUrl,
  setVideoUrl,
}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(true);
  const [showMobileInput, setShowMobileInput] = useState(false); 

  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'kpop_light') {
      setIsChecked(true);
    } else {
      setIsChecked(false);
    }
  }, []);

  /**
   * Toggles between light and dark theme based on the checkbox state.
   * @param {Object} e - The event object.
   */
  const handleThemeToggle = (e) => {
    //document.documentElement.setAttribute('data-theme', 'kpop_light');
    if (e.target.checked) {
      document.documentElement.setAttribute('data-theme', 'kpop_light');
      setIsChecked(true);
    } else {
      document.documentElement.setAttribute('data-theme', 'kpop_dark');
      setIsChecked(false);
    }
  };

  /**
   * Toggles the visibility of the popup modal.
   */
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  return (
    <header className="relative flex items-center justify-between w-[100vw] py-1" style={{boxShadow: "0 -1px 10px rgb(0, 0, 0)"}}>
      
      {/* Desktop View */}
      <div className="hidden md:flex items-center">
        <PagesMenu />
        <span className="text-md font-bold text-white ml-4 whitespace-nowrap mr-10">livestreaming prototype</span>
      </div>
      <div className="hidden md:flex w-1/2 justify-center">
        <VideoHeader setVideoId={setVideoId} videoId={videoId} videoUrl={videoUrl} setVideoUrl={setVideoUrl} user={user} />
      </div>

      <div className="hidden md:flex my-4">
        <LiveStreamsButton setVideoId={setVideoId}/>
      </div>
      <div className="hidden md:flex items-center">
        <ProfileMenu user={user} setUser={setUser} />
      </div>
      
      
      {/* Theme Toggle Button 
      <label className="swap swap-rotate md:mr-1">
        <input type="checkbox" className="theme-controller" onChange={handleThemeToggle} checked={isChecked} />
        <img src={LightMode} alt="Day Mode" className="swap-off h-8 w-8 md:h-12 md:w-12" />
        <img src={NightMode} alt="Night Mode" className="swap-on h-8 w-8 md:h-12 md:w-12" />
      </label>
      */}

      {/* Mobile View */}
      <div className="flex md:hidden w-full items-center">
        {!showMobileInput ? (
          <>
        <PagesMenu/>
        <span className="text-sm font-bold text-white ml-1 whitespace-nowrap">livestreaming prototype</span>
          <button 
                onClick={() => setShowMobileInput(true)}
                className="ml-auto mr-10"
              >
                <PlayIcon className="w-8 h-8 border border-white rounded-full px-1"/>
          </button>
          <ProfileMenu user={user} setUser={setUser} />
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
              <VideoHeader setVideoId={setVideoId} videoId={videoId} videoUrl={videoUrl} setVideoUrl={setVideoUrl} user={user} />
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
              <VideoHeader setVideoId={setVideoId} videoId={videoId} videoUrl={videoUrl} setVideoUrl={setVideoUrl} user={user}/>
            </div>
            <div className="my-4">
              <LiveStreamsButton setVideoId={setVideoId}/>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
