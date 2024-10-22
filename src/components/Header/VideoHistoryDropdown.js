import React, { useState, useEffect } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import "./styles/VideoHistoryDropdown.css";

/**
 * `VideoHistoryDropdown` component displays a dropdown menu with the user's video history.
 * Allows users to select a video from the history to load.
 * 
 * @param {Object} props - The properties passed to the component.
 * @param {Function} props.setVideoUrl - Function to update the current video URL.
 * @returns {JSX.Element} The rendered `VideoHistoryDropdown` component.
 */
const VideoHistoryDropdown = ({ setVideoUrl }) => {
  const [history, setHistory] = useState([]); // State to store video history

  useEffect(() => {
    // Load video history from local storage on component mount
    const savedHistory = JSON.parse(localStorage.getItem('videoHistory')) || [];
    setHistory(savedHistory);
  }, []);

  /**
   * Handles the click event on a history item, updating the video URL and storing the last video ID in local storage.
   * 
   * @param {string} url - The URL of the selected video.
   */
  const handleHistoryClick = (url) => {
    setVideoUrl(url);
    localStorage.setItem('lastVideoId', extractVideoId(url));
  };

  /**
   * Extracts the video ID from a given YouTube URL.
   * 
   * @param {string} url - The YouTube video URL.
   * @returns {string|null} The extracted video ID or null if extraction fails.
   */
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
      console.log("Error with video id extraction!");
      return null;
    }
  };

  return (
    <Menu as="div" className="relative inline-block text-left z-40 border-radius-0 ">
      {/* Button to open the dropdown menu */}
      <MenuButton className="flex items-center justify-between text-left md:w-full md:text-sm text-xxxs btn btn-secondary hover:btn-accent transform hover:-translate-y-1 hover:scale-110 delay-100 duration-200 font-semibold">
        <span className="flex items-center space-x-2">
          <span className="text-left">Video History</span>
        </span>
      </MenuButton>

      {/* Dropdown menu displaying video history */}
      <MenuItems className="absolute text-sm left-0 z-10 mt-2 w-56 origin-top-left rounded-md bg-primary shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none max-h-80 overflow-y-auto no-scrollbar">
        <div className="py-1">
          {history.map((item, index) => (
            <MenuItem key={index}>
              {({ active }) => (
                <div
                  onClick={() => handleHistoryClick(item.url)}
                  className={`block px-4 py-2 text-xsm rounded-md m-1 cursor-pointer ${active ? 'bg-accent text-black' : 'text-white'}`}
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
