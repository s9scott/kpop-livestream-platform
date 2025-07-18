/**
 * @file Messages.js
 * @author Simon Tenedero, Jonas Matulis
 * @created 2024-XX-XX
 * @lastModified 2025-05-27
 * @desc file containing Messages
 */

import React, { useEffect, useRef } from 'react';
import { deleteMessage, muteUser, addReaction } from '../../utils/livestreamsUtils';
import { deletePrivateChatMessage, addPrivateChatReaction } from '../../utils/privateChatUtils';
import Message from './Message';
import info from '../../assets/info.svg';

/**
 * Messages component renders a list of Message components and manages the scroll behavior.
 * It also provides a button to toggle the visibility of a popup, such as an info panel.
 * Depending on value of privacyLevel argument, the messages are either native or private
 * 
 * @param {string} privacyLevel - string stating if messages are public or private (can be 'public' or 'private')
 * @param {string} chatId - The ID of the video associated with the messages.
 * @param {Array} messages - Array of message objects to display.
 * @param {function} formatTimestamp - Function to format the message timestamp.
 * @param {function} handleSeeAccountInfo - Function to handle viewing the account information of the message author.
 * @param {boolean} isPopupOpen - Boolean indicating whether the popup is currently open.
 * @param {function} setIsPopupOpen - Function to set the state of the popup visibility.
 * 
 * @returns {JSX.Element} The rendered Messages component.
 */
const Messages = ({
  privacyLevel,
  chatId,
  messages,
  formatTimestamp,
  handleSeeAccountInfo,
  isPopupOpen,
  setIsPopupOpen,
}) => {

  const messagesEndRef = useRef(null); // Ref to track the end of the messages list

  /**
   * useEffect hook to scroll to the latest message whenever the messages array changes.
   */
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [messages]);
  


  return (
    <div className="relative flex flex-col w-full h-full">
      {/* Button to open the info popup, only visible if the popup is currently closed */}
      {!isPopupOpen && (
        <button onClick={() => setIsPopupOpen(true)} className="absolute bottom-10 right-4 p-2 text-white bg-blue-500 rounded-full hover:bg-blue-600">
          <img src={info} alt="info" className="w-4 h-4" />
        </button>
      )}
      {/* Container for the messages list with scrolling enabled */}
      <div className="flex-grow overflow-y-auto p-4 bg-neutral mb-5 no-scrollbar">

        {messages.map((message, index) => (
          <Message
            key={index}
            chatId={chatId}
            message={message}
            formatTimestamp={formatTimestamp}
            handleSeeAccountInfo={handleSeeAccountInfo}
            removeMessageDB={privacyLevel==='public'?deleteMessage:deletePrivateChatMessage}
            addReactionDB={privacyLevel==='public'?addReaction:addPrivateChatReaction}
            muteUserDB={privacyLevel==='public'?muteUser:()=>{}} //implement mute function for priv
          />
        ))}
        {/* Empty div used as a scroll target to ensure the latest message is visible */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default Messages;
