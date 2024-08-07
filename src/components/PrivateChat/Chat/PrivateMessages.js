import React from 'react';

const Messages = ({
  messages,
  user,
  formatTimestamp,
  toggleOptions,
  showOptions,
  handleSeeAccountInfo,
  handleRemoveMessage
}) => {
  return (
    <div className="p-4">
      {messages.map((message, index) => (
        <div key={index} className="flex items-start gap-2 mb-6 relative group w-full">
          <img
            className="w-10 h-10 rounded-full"
            src={message.authorPhotoURL || 'default-profile-pic-url'}
            alt="Profile"
          />
          <div className="flex-grow">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-2">
                <span className={`text-sm font-bold ${message.authorUid === user.uid ? 'text-blue-600' : 'text-accent'}`}>{message.authorName}</span>
                <span className="text-xs font-light">{formatTimestamp(message.timestamp)}</span>
              </div>
              <div className="relative">
                <span className="three-dots cursor-pointer" onClick={() => toggleOptions(index)}>
                  ⋮
                </span>
                {showOptions[index] && (
                  <div className="absolute z-10 mt-1 bg-white rounded-lg shadow-lg w-48 right-0">
                    <ul className="py-2 text-sm">
                      {message.authorUid === user.uid && (
                        <li>
                          <p onClick={() => handleRemoveMessage(index)} className="block px-4 py-2 hover:bg-gray-100">Remove message</p>
                        </li>
                      )}
                      <li>
                        <p onClick={() => handleSeeAccountInfo(message.authorUid)} className="block px-4 py-2 hover:bg-gray-100">See account info</p>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-1">
              <p className="text-sm font-normal break-all">{message.text}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Messages;
