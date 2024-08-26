import React, { useEffect, useRef } from 'react';
import Message from './Message';
import info from '../../assets/info.svg';

/**
 * Messages component renders a list of Message components and manages the scroll behavior.
 * It also provides a button to toggle the visibility of a popup, such as an info panel.
 * 
 * @param {Object} props - The component props.
 * @param {string} props.videoId - The ID of the video associated with the messages.
 * @param {Array} props.messages - Array of message objects to display.
 * @param {Object} props.user - The current user object.
 * @param {function} props.formatTimestamp - Function to format the message timestamp.
 * @param {function} props.toggleOptions - Function to toggle the options dropdown visibility.
 * @param {boolean} props.showOptions - Boolean indicating whether the options dropdown is visible.
 * @param {function} props.handleSeeAccountInfo - Function to handle viewing the account information of the message author.
 * @param {function} props.handleRemoveMessage - Function to handle the removal of a message.
 * @param {boolean} props.isPopupOpen - Boolean indicating whether the popup is currently open.
 * @param {function} props.setIsPopupOpen - Function to set the state of the popup visibility.
 * 
 * @returns {JSX.Element} The rendered Messages component.
 */
const Messages = ({
  videoId,
  messages,
  user,
  formatTimestamp,
  toggleOptions,
  showOptions,
  handleSeeAccountInfo,
  handleRemoveMessage,
  isPopupOpen,
  setIsPopupOpen,
  selectedTab, 
  setSelectedTab
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
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
        ))}
        {/* Empty div used as a scroll target to ensure the latest message is visible */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default Messages;
