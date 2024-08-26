import React, { useEffect, useRef } from 'react';
import PrivateMessage from './PrivateMessage';
import info from '../../assets/info.svg';

/**
 * @param videoId, privateChatId, messages, user, formatTimestamp, toggleOptions, showOptions, handleSeeAccountInfo, handleRemoveMessage, isPopupOpen, setIsPopupOpen
 * What they are?
 * videoId: The ID of the video
 * privateChatId: The ID of the private chat
 * messages: The messages in the private chat
 * user: The current user information 
 * formatTimestamp: Function to format the timestamp
 * toggleOptions: Function to toggle the message options
 * showOptions: State to show the message options
 * handleSeeAccountInfo: Function to see the account information of the user
 * handleRemoveMessage: Function to remove the message
 * isPopupOpen: State to show the account information popup
 * setIsPopupOpen: Function to set the account information popup state
 * @returns PrivateMessages
 * 
 * This component displays the messages in the private chat.
 * It shows the messages in the private chat and allows the user to see the account information of the user, remove the message, and toggle the message options.
 * The component also allows the user to see the account information popup.
 */
const PrivateMessages = ({ videoId, privateChatId, messages, user, formatTimestamp, toggleOptions, showOptions, handleSeeAccountInfo, handleRemoveMessage, isPopupOpen, setIsPopupOpen, selectedTab, setSelectedTab}) => {
  const messagesEndRef = useRef(null); // Reference to the last message

  // Scroll to the bottom of the messages
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
      <div className="flex-grow overflow-y-auto p-4 bg-base-200 rounded-lg mb-5 no-scrollbar">
        {messages.map((message, index) => (
          <PrivateMessage 
            privateChatId={privateChatId}
            key={index}
            message={message}
            user={user}
            index={index}
            formatTimestamp={formatTimestamp}
            toggleOptions={toggleOptions}
            showOptions={showOptions}
            handleSeeAccountInfo={handleSeeAccountInfo}
            handleRemoveMessage={handleRemoveMessage}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default PrivateMessages;
