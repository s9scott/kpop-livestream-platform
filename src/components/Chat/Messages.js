import React, { useEffect, useRef } from 'react';
import Message from './Message';
import info from '../../assets/info.svg';

const Messages = ({ videoId, messages, user, formatTimestamp, toggleOptions, showOptions, handleSeeAccountInfo, handleRemoveMessage, isPopupOpen, setIsPopupOpen }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [messages]);

  return (
    <div className="relative flex flex-col w-full h-full">
      {!isPopupOpen && (
        <button onClick={() => setIsPopupOpen(true)} className="absolute bottom-10 right-4 p-2 text-white bg-blue-500 rounded-full hover:bg-blue-600">
        <img src={info} alt="info" className="w-4 h-4" />
      </button>
      )}
      <div className="flex-grow overflow-y-auto p-4 bg-base-200 rounded-xl mb-5 no-scrollbar">
        {messages.map((message, index) => (
          <Message
            videoId={videoId}
            key={index}
            message={message}
            user={user}
            index={index}
            formatTimestamp={formatTimestamp}
            toggleOptions={toggleOptions}
            showOptions={showOptions}
            handleSeeAccountInfo={handleSeeAccountInfo}
            handleRemoveMessage={handleRemoveMessage}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default Messages;
