import React from 'react';

const ChatTabs = ({ chats, selectedChat, onSelectChat, onCloseChat }) => {
  return (
    <div className="flex bg-gray-800 text-white">
      {chats.map((chat) => (
        <div key={chat.id} className={`flex items-center p-2 cursor-pointer ${selectedChat === chat.id ? 'bg-gray-700' : ''}`} onClick={() => onSelectChat(chat.id)}>
          <span>{chat.name || chat.url}</span>
          <button onClick={(e) => { e.stopPropagation(); onCloseChat(chat.id); }} className="ml-2 text-red-500">x</button>
        </div>
      ))}
    </div>
  );
};

export default ChatTabs;
