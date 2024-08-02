import React from 'react';
import LightMode from '../../assets/LightMode.svg';
import NightMode from '../../assets/NightMode.svg';
import LoginHeader from './LoginHeader';
import VideoHeader from './VideoHeader';
import HeaderMenu from './HeaderMenu';
import './styles/Header.css';

const Header = ({ user, setUser, videoId, setVideoId, videoUrl, setVideoUrl  }) => {

  const handleThemeToggle = (e) => {
    if (e.target.checked) {
      document.documentElement.setAttribute('data-theme', 'lemonade');
    } else {
      document.documentElement.setAttribute('data-theme', 'dracula');
    }
  };

  return (
    <header className="navbar flex items-center justify-between p-4 bg-neutral text-base-content">
      <div className="flex items-center">
        <HeaderMenu />
      </div>
      <div className="w-9/12 z-40 flex justify-center">
        <VideoHeader setVideoId={setVideoId} videoId={videoId} videoUrl={videoUrl} setVideoUrl={setVideoUrl} />
      </div>
      <label className="swap swap-rotate">
        <input type="checkbox" className="theme-controller" onChange={handleThemeToggle} />
        <img src={LightMode} alt="Day Mode" className="swap-off h-12 w-12"/>
        <img src={NightMode} alt="Night Mode" className="swap-on h-12 w-12"/>
      </label>
      <div className="flex items-center">
        <LoginHeader user={user} setUser={setUser} />
      </div>
    </header>
  );
};

export default Header;
