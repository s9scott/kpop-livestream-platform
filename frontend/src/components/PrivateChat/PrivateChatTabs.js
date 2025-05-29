/**
 * @file PrivateChatTabs.js
 * @author Simon Tenedero
 * @created 2025-05-26
 * @lastModified 2025-05-27
 * @desc file containing PrivateChatTabs component
 */

import React from 'react';
import TreasureLogo from '../../assets/Treasure_logo_2023.png'; //placeholder image, need to update to be customizable

/**
 * This component displays a list of the users' privateChats - it is the pane displayed when private chat is selected from the main tabs
 * Each tab has an image for the chat, the title, and a recently sent message (deciding if we will include the name of the livestreams)
 * 
 * @param {object} chats - array containing chat objects (have fields such as id, title, etc.)
 * @param {Function} onSelectChat - function that handles opening the chat when clicking the corresponding tab
 * @param {Function} onCloseChat - (NOTE: STILL NEED TO IMPLEMENT) function that handles leaving chats 
 * 
 * @returns {JSX.Element} PrivateChatTabs 
 */
const PrivateChatTabs = ({ chats, onSelectChat, onCloseChat}) => {

  return (
    <div className="flex-col h-full bg-base-200 border-b p-2 border-gray-200 dark:border-gray-700 overflow-scroll">
      {chats.length > 0 ? (

        chats.map((chat) => (
          <div
            key={chat.id}
            className="w-full flex items-center px-4 mb-3"
            onClick={() => {onSelectChat(chat.id)}}
          >

            <img className="w-11 h-11 mr-3 border-white rounded-full" src={TreasureLogo} alt={chat.id + " logo"} />
            <div className="flex flex-wrap items-center justify-between p-2 cursor-pointer flex-1 text-sm">
              <span className="flex-grow truncate font-bold">
                {chat.name || chat.url}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseChat(chat.id);
                }}
                className="ml-2 text-base w-5 h-6"
              >
                ⋮
              </button>
              <span className="flex-grow truncate w-full">userA: this is placeholder text</span>
            </div>
            
          </div>))

        ) : (

        <div className="flex items-center justify-between p-2 flex-1 text-sm bg-base-200 text-base-content">
          <span className="flex-grow truncate">No private chats open</span>
        </div>

      )}
    </div>
  );
};

export default PrivateChatTabs;
