import React from 'react';

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
