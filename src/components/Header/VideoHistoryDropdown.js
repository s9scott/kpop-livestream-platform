import React, { useState, useEffect } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import "./styles/VideoHistoryDropdown.css";

const VideoHistoryDropdown = ({ setVideoUrl }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('videoHistory')) || [];
    setHistory(savedHistory);
  }, []);

  const handleHistoryClick = (url) => {
    setVideoUrl(url);
    localStorage.setItem('lastVideoId', extractVideoId(url));
  };

  const extractVideoId = (url) => {
    try {
      const urlParams = new URLSearchParams(new URL(url).search);
      return urlParams.get('v');
    } catch {
      return null;
    }
  };

  return (
    <Menu as="div" className="relative inline-block text-left z-[1001]">
      <MenuButton className="text-lg btn btn-secondary hover:btn-accent transform hover:-translate-y-1 hover:scale-110 delay-100 duration-200 inline-flex items-center justify-center gap-x-1.5 rounded-md font-semibold">
        Video History
        <ChevronDownIcon className="w-5 h-5" aria-hidden="true" />
      </MenuButton>

      <MenuItems className="absolute left-0 z-10 mt-2 w-56 origin-top-left rounded-md bg-primary shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none max-h-80 overflow-y-auto no-scrollbar">
        <div className="py-1">
          {history.map((item, index) => (
            <MenuItem key={index}>
              {({ active }) => (
                <div
                  onClick={() => handleHistoryClick(item.url)}
                  className={`block px-4 py-2 text-sm rounded-md m-1 cursor-pointer ${active ? 'bg-accent text-black' : 'text-white'}`}
                >
                  {item.title}
                </div>
              )}
            </MenuItem>
          ))}
        </div>
      </MenuItems>
    </Menu>
  );
};

export default VideoHistoryDropdown;
