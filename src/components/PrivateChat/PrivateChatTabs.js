import React from 'react';

/**
 * 
 * @param chats, selectedChat, onSelectChat, onCloseChat
 * What they are?
 * chats: Array of private chat objects
 * selectedChat: ID of the selected chat
 * onSelectChat: Function to select a chat
 * onCloseChat: Function to close a chat
 * @returns PrivateChatTabs 
 * 
 * This component displays a list of private chat tabs.
 * It allows users to switch between different private chats.
 * Each tab displays the chat name or URL and a close button.
 * When a tab is clicked, the chat is selected.
 */

const PrivateChatTabs = ({ chats, selectedChat, onSelectChat, onCloseChat }) => {
  return (
    <div className="flex bg-base-200 border-b border-gray-200 dark:border-gray-700">
      {chats.length > 0 ? (
        chats.map((chat) => (
          <div
            key={chat.id}
            className={`flex items-center justify-between p-2 cursor-pointer flex-1 text-sm ${selectedChat === chat.id ? 'bg-base-100 text-primary' : 'bg-base-200 text-base-content'} hover:bg-base-300`}
            onClick={() => onSelectChat(chat.id)}
          >
            <span className="flex-grow truncate">{chat.name || chat.url}</span>
            {chat.id !== 'youtubeChat' && chat.id !== 'nativeChat' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseChat(chat.id);
                }}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            )}
          </div>
        ))
      ) : (
        <div className="flex items-center justify-between p-2 flex-1 text-sm bg-base-200 text-base-content">
          <span className="flex-grow truncate">No private chats open</span>
        </div>
      )}
    </div>
  );
};

export default PrivateChatTabs;
