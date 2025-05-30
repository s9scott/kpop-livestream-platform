/**
 * @file PrivateChatTabs.js
 * @author Simon Tenedero, Jonas Matulis
 * @created 2024-XX-XX
 * @lastModified 2025-05-28
 * @desc file containing ChatTabs
 */

import React from 'react';

/**
 * This component displays a list of chat tabs (messages, invitations)
 * It allows users to switch between different tabs.
 * When a tab is clicked, the corresponding pane will appear in switchable chat
 * 
 * @param {Array} privateTabs - Array of objects representing tabs {id:,name:}
 * @param {Function} selectedTab - state variable representing current selected tab
 * @param {Function} onSelectTab - Function handling behaviour of selecting a tab
 * 
 * @returns PrivateChatTabs 
 * 
 */
const PrivateChatTabs = ({ privateTabs, selectedPrivateTab, onSelectPrivateTab}) => {
  
  return (
    <div className="flex w-full border-b pt-2 px-3 py-1">
      {privateTabs.length > 0 ? (
        privateTabs.map((tab) => (
          <button
            key={tab.id}
            className={`${tab.id==='messagesTab'?'mr-auto':''} p-1 fit-content flex items-center justify-between cursor-pointer text-xs ${selectedPrivateTab === tab.id ? 'text-primary' : 'text-base-content'}`}
            onClick={() => {console.log(typeof(onSelectPrivateTab));onSelectPrivateTab(tab.id)}}
          >
            <span className="flex-grow truncate font-bold">{tab.name}</span>
          </button>
        ))
      ) : (
        <div className="flex items-center justify-between p-2 flex-1 text-sm text-base-content">
          <span className="flex-grow truncate">No private tabs Available</span>
        </div>
      )}
    </div>
  );
};

export default PrivateChatTabs;
