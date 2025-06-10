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
const PrivateChatTabs = ({ privateTabs, selectedPrivateTab, onSelectPrivateTab, invitations}) => {
  
  return (
    <div className="flex w-full border-b pt-2 px-3 py-1">
      {privateTabs.length > 0 ? (
        privateTabs.map((tab) => (
          <button
            key={tab.id}
            className={`${tab.id==='messagesTab'?'mr-auto':''} p-1 fit-content flex items-center justify-between cursor-pointer text-sm ${selectedPrivateTab === tab.id ? 'text-primary' : 'text-base-content'}`}
            onClick={() => {console.log(typeof(onSelectPrivateTab));onSelectPrivateTab(tab.id)}}
          >
            <div className="flex">
              <span className="flex-grow truncate">{tab.name}</span>
              {/*render a red circle to say theres an invitation pending*/}
              {tab.id==='invitationsTab' && invitations.length>0 && (<div className="bg-red-500 text-white rounded-full w-2 h-2 flex justify-center items-center text-xs"></div>)}
            </div>
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
