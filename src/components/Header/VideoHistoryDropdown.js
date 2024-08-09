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
      const parsedUrl = new URL(url);
      const urlParams = new URLSearchParams(new URL(url).search);
      let id;
      // Case 1: Standard YouTube URL with 'v' query parameter
      if ((id = urlParams.get('v'))) {
        return id;
      }
      // Case 2: YouTube Shorts URL
      if (parsedUrl.pathname.startsWith('/shorts/')) {
        id = parsedUrl.pathname.split('/shorts/')[1];
        return id;
      }
      // Case 3: YouTube Live URL with 'live' query parameter
      if ((id = urlParams.get('live'))) {
        return id;
      }
      // Case 4: YouTube Live or other path-based URLs
      if (parsedUrl.pathname.startsWith('/live/')) {
        id = parsedUrl.pathname.split('/live/')[1];
        return id;
      }
      // Case 5: YouTube URL with shortened format
      if (parsedUrl.hostname === 'youtu.be') {
        id = parsedUrl.pathname.slice(1);
        return id;
      }
    } catch {
      console.log("Error with video id extraction!")
      return null;
    }
  };


  return (
    <Menu as="div" className="relative inline-block text-left z-[1001]">
      <MenuButton className="flex items-center justify-between w-full text-lg btn btn-secondary hover:btn-accent transform hover:-translate-y-1 hover:scale-110 delay-100 duration-200 font-semibold">
        <span className="flex items-center space-x-2">
          <span className="truncate">Video History</span>
          <ChevronDownIcon className="w-5 h-5" aria-hidden="true" />
        </span>
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
