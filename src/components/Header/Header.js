import React, { useState } from 'react';
import LightMode from '../../assets/LightMode.svg';
import NightMode from '../../assets/NightMode.svg';
import LoginHeader from './LoginHeader';
import VideoHeader from './VideoHeader';
import HeaderMenu from './HeaderMenu';
import PrivateChatHeader from './PrivateChatHeader';
import './styles/Header.css';

const Header = ({
  user,
  setUser,
  videoId,
  setVideoId,
  videoUrl,
  setVideoUrl,
  activeUsers,
  privateChats,
  invitations,
  selectedChats,
  setSelectedChats,
  selectedChatId,
  setSelectedChatId,
}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleThemeToggle = (e) => {
    document.documentElement.setAttribute('data-theme', 'kpop_light');
    if (e.target.checked) {
      document.documentElement.setAttribute('data-theme', 'kpop_light');
    } else {
      document.documentElement.setAttribute('data-theme', 'kpop_dark');
    }
  };

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  return (
    <header className="navbar flex items-center justify-between p-1 bg-neutral text-base-content">
      {/* Desktop View */}
      <div className="hidden md:flex items-center">
        <HeaderMenu />
      </div>
      <div className="hidden md:flex w-8/12 justify-center">
        <VideoHeader setVideoId={setVideoId} videoId={videoId} videoUrl={videoUrl} setVideoUrl={setVideoUrl} />
      </div>
      <div className="hidden md:flex items-center">
        <PrivateChatHeader 
          user={user} 
          privateChats={privateChats} 
          invitations={invitations} 
          selectedChats={selectedChats} 
          setSelectedChats={setSelectedChats} 
          selectedChatId={selectedChatId} 
          setSelectedChatId={setSelectedChatId} 
        />
      </div>
      <div className="hidden md:flex items-center">
        <LoginHeader user={user} setUser={setUser} />
      </div>
      <label className="swap swap-rotate md:mr-1">
        <input type="checkbox" className="theme-controller" onChange={handleThemeToggle} />
        <img src={LightMode} alt="Day Mode" className="swap-off h-8 w-8 md:h-12 md:w-12" />
        <img src={NightMode} alt="Night Mode" className="swap-on h-8 w-8 md:h-12 md:w-12" />
      </label>

      {/* Mobile View */}
      <div className="flex md:hidden w-full justify-between items-center p-2">
        <HeaderMenu />
        <button onClick={togglePopup} className="btn btn-primary">
          Open Menu
        </button>
        <LoginHeader user={user} setUser={setUser} />
      </div>

      {/* Popup Modal for Mobile */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-4 w-11/12 max-w-md">
            <button onClick={togglePopup} className="text-red-500 hover:text-red-800 float-right">✕</button>
            <div className="my-4">
              <VideoHeader setVideoId={setVideoId} videoId={videoId} videoUrl={videoUrl} setVideoUrl={setVideoUrl} />
            </div>
            <div className="my-4">
              <PrivateChatHeader 
                user={user} 
                privateChats={privateChats} 
                invitations={invitations} 
                selectedChats={selectedChats} 
                setSelectedChats={setSelectedChats} 
                selectedChatId={selectedChatId} 
                setSelectedChatId={setSelectedChatId} 
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
