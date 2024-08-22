import React, { useState } from 'react';
import { deletePrivateMessage, addPrivateReaction } from '../../utils/privateChatUtils';
import addEmoji from "../../assets/emoji-add.svg";
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

/**
 * 
 * @param privateChatId, message, user, index, formatTimestamp, toggleOptions, showOptions, handleSeeAccountInfo, handleRemoveMessage
 * What they are?
 * privateChatId: The ID of the private chat
 * message: The message object
 * user: The current user
 * index: The index of the message
 * formatTimestamp: Function to format the timestamp
 * toggleOptions: Function to toggle the message options
 * showOptions: State to show the message options
 * handleSeeAccountInfo: Function to see the account information of the user
 * handleRemoveMessage: Function to remove the message
 * @returns PrivateMessage
 * 
 * This component displays a private message in the private chat.
 * It shows the user's profile picture, name, message, and timestamp.
 * It also displays the message options when the user hovers over the message.
 * The message options include seeing the user's account information, removing the message, and muting the user.
 * The component also allows the user to add reactions to the message.
 */

const PrivateMessage = ({
  privateChatId,
  message,
  user,
  index,
  formatTimestamp,
  toggleOptions,
  showOptions,
  handleSeeAccountInfo,
  handleRemoveMessage
}) => {
  const isUserMessage = message.authorUid === user.uid; // Check if the message is from the current user
  const messageClasses = message.text.includes(`@${user.displayName}`) ? 'text-current bg-secondary rounded-xl p-1' : 'text-current'; // Add highlighting class
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // State for emoji picker
  const [showDropdown, setShowDropdown] = useState(false); // State for message options dropdown


  // Handle mouse enter event to show message options
  const handleMouseLeave = () => {
    setShowDropdown(false);
  };

 // Handle three dots click to show message options
  const handleThreeDotsClick = () => {
    setShowDropdown(!showDropdown);
  };

  // Handle remove message click
  const handleRemoveClick = async () => {
    try {
      console.log('Message removed:', privateChatId);
      await deletePrivateMessage(privateChatId, message.text, message.timestamp);
    } catch (error) {
      console.error('Error removing message: ', error);
    }
  };

  // Handle add reaction click to show emoji picker 
  const handleAddReaction = async (reaction) => {
    try {
      await addPrivateReaction(privateChatId, message.text, message.timestamp, reaction);
      setShowEmojiPicker(false); // Hide the emoji picker after selection
    } catch (error) {
      console.error('Error adding reaction: ', error);
    }
  };

  // Handle emoji picker click to show emoji picker
  return (
    <div className="flex items-start gap-2 mb-6 relative group w-full">
      <img
        className="w-10 h-10 rounded-full"
        src={message.authorPhotoURL || 'default-profile-pic-url'}
        alt="Profile"
      />
      <div className="flex-grow">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2">
            <span className={`text-sm font-bold ${isUserMessage ? 'text-primary' : 'text-secondary '}`}>{message.authorName}</span>
            <span className="text-xs font-light text-current">{formatTimestamp(message.timestamp)}</span>
          </div>
          <div className="relative">
            <span className="three-dots cursor-pointer text-current" onClick={handleThreeDotsClick}>
              ⋮
            </span>
            {showDropdown && (
              <div className="bg-primary absolute z-10 mt-1 rounded-lg shadow-lg w-48 right-0" onMouseLeave={handleMouseLeave}>
                <ul className="py-2 text-sm text-current rounded-xl">
                  {isUserMessage && (
                    <li>
                      <p onClick={handleRemoveClick} className="rounded-xl block p-2 m-2 hover:bg-accent dark:hover:bg-gray-600 dark:hover:text-white">Remove message</p>
                    </li>
                  )}
                  <li>
                    <p onClick={() => handleSeeAccountInfo(message.authorUid)} className="rounded-xl block p-2 m-2 hover:bg-accent dark:hover:bg-gray-600 dark:hover:text-white">See account info</p>
                  </li>
                  <li>
                    <p onClick={() => console.log("Add to chat")} className="rounded-xl block p-2 m-2 hover:bg-accent dark:hover:bg-gray-600 dark:hover:text-white">Add to chat</p>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className={`flex flex-col gap-2 ${messageClasses} mt-1`}>
          <p className="text-sm font-normal break-all w-full">{message.text}</p>
          {message.reactions && (
            <div className="flex space-x-2 mt-2">
              {Object.entries(message.reactions).map(([reaction, count]) => (
                <div key={reaction} className="flex items-center space-x-1 btn btn-sm" onClick={() => { handleAddReaction(reaction); }}>
                  <span>{reaction}</span>
                  <span>{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="h-px bg-secondary w-full my-2"></div>
        <div className="flex flex-row gap-2 mt-1">
          <img src={addEmoji} alt="Reaction" onClick={() => setShowEmojiPicker(!showEmojiPicker)} />
          {showEmojiPicker && (
            <div className="absolute z-10">
              <Picker data={data} onEmojiSelect={(emoji) => { handleAddReaction(emoji.native); }} />
            </div>
          )}
        </div>
      </div>
    </div >
  );
};

export default PrivateMessage;
