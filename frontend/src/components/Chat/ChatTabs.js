/**
 * @file ChatTabs.js
 * @author Simon Tenedero, Jonas Matulis
 * @created 2024-XX-XX
 * @lastModified 2025-06-04
 * @desc file containing ChatTabs
 */

import React from 'react';
import './styles/ChatTabs.css'

/**
 * This component displays a list of chat tabs (youtube, native, private) - also used for the messages/invites
 * It allows users to switch between different tabs.
 * When a tab is clicked, the corresponding pane will appear in switchable chat
 * 
 * @param {Array} tabs - Array of objects representing tabs {id:,name:}
 * @param {Function} selectedTab - state variable representing current selected tab
 * @param {Function} onSelectTab - Function handling behaviour of selecting a tab
 * 
 * @returns PrivateChatTabs 
 */
const ChatTabs = ({ tabs, selectedTab, onSelectTab}) => {
  
  return (
    <div className="flex gap-8">
      {tabs.length > 0 ? (
        tabs.map((tab) => (
          <div className={`rounded-full button-container flex items-center justify-between flex-grow flex-1 ${selectedTab === tab.id ? 'active-tab-container p-0.5' : ''}`}>
          <button
            key={tab.id}
            className={`rounded-full p-1 cursor-pointer w-full text-xs font-bold ${selectedTab === tab.id ? 'active-tab bg-neutral' : 'text-neutral bg-accent'}`}
            onClick={() => {console.log(tab);onSelectTab(tab.id)}}
          >
            {tab.name || tab.url}
          </button>
          </div>
        ))
      ) : (
        <div className="flex items-center justify-between p-2 flex-1 text-sm text-base-content">
          <span className="flex-grow truncate">No Tabs Available</span>
        </div>
      )}
    </div>
  );
};

export default ChatTabs;
