/**
 * @file ChatTabs.js
 * @author Simon Tenedero, Jonas Matulis
 * @created 2024-XX-XX
 * @lastModified 2025-05-28
 * @desc file containing ChatTabs
 */

import React from 'react';

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
 * 
 */
const ChatTabs = ({ tabs, selectedTab, onSelectTab}) => {
  
  return (
    <div className="flex">
      {tabs.length > 0 ? (
        tabs.map((tab) => (
          <button
            key={tab.id}
            className={`rounded-full mx-3 flex items-center justify-between p-1 cursor-pointer flex-grow flex-1 text-xs ${selectedTab === tab.id ? 'bg-neutral border-2 border-primary' : 'text-neutral bg-accent'}`}
            onClick={() => {console.log(tab);onSelectTab(tab.id)}}
          >
            <span className="flex-grow truncate font-bold">{tab.name || tab.url}</span>
          </button>
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
