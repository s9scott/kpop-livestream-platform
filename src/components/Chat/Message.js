import React, { useState } from 'react';
import { deleteMessage, muteUser, addReaction } from '../../utils/firestoreUtils';
import addEmoji from "../../assets/emoji-add.svg";
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

/**
 * Message component represents an individual chat message with options to delete, mute user,
 * add reactions, and view user information.
 * 
 * @param {Object} props - The component props.
 * @param {string} props.videoId - The ID of the video associated with the message.
 * @param {Object} props.message - The message object containing text, timestamp, author details, and reactions.
 * @param {Object} props.user - The current user object.
 * @param {number} props.index - The index of the message in the message list.
 * @param {function} props.formatTimestamp - Function to format the message timestamp.
 * @param {function} props.toggleOptions - Function to toggle the options dropdown visibility.
 * @param {boolean} props.showOptions - Boolean to indicate whether the options dropdown is visible.
 * @param {function} props.handleSeeAccountInfo - Function to handle viewing the account information of the message author.
 * @param {function} props.handleRemoveMessage - Function to handle the removal of a message.
 * 
 * @returns {JSX.Element} The rendered Message component.
 */
const Message = ({
  videoId,
  message,
  user,
  index,
  formatTimestamp,
  toggleOptions,
  showOptions,
  handleSeeAccountInfo,
  handleRemoveMessage,
  selectedTab, 
  setSelectedTab
}) => {
  let isUserMessage = null;
  let messageClasses = null;
  if (user !== null) { 
    isUserMessage = message.authorUid === user.uid // Checks if the message was authored by the current user
    messageClasses = message.text.includes(`@${user.displayName}`) ? 'text-current bg-secondary rounded-xl p-1' : 'text-current';  // Adds highlighting if the message mentions the user
  } else {
    setSelectedTab("youtubeChat")
  }
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // Controls the visibility of the emoji picker
  const [showDropdown, setShowDropdown] = useState(false); // Controls the visibility of the options dropdown

  /**
   * Hides the options dropdown when the mouse leaves the dropdown area.
   */
  const handleMouseLeave = () => {
    setShowDropdown(false);
  };

  /**
   * Toggles the visibility of the options dropdown.
   */
  const handleThreeDotsClick = () => {
    setShowDropdown(!showDropdown);
  };

  /**
   * Handles the removal of a message by calling the deleteMessage function.
   * Logs the videoId and handles errors if the removal fails.
   */
  const handleRemoveClick = async () => {
    try {
      console.log('Message removed:', videoId);
      await deleteMessage(videoId, message.text, message.timestamp);
    } catch (error) {
      console.error('Error removing message: ', error);
    }
  };

  /**
   * Handles muting the user who authored the message.
   * Prompts the user for the mute duration and mutes the user for that duration.
   */
  const handleMuteUserClick = async () => {
    const muteDuration = prompt('Enter mute duration in minutes:');
    if (muteDuration) {
      try {
        await muteUser(message.videoId, message.authorUid, parseInt(muteDuration));
        alert(`User ${message.authorName} has been muted for ${muteDuration} minutes.`);
      } catch (error) {
        console.error('Error muting user: ', error);
      }
    }
  };

  /**
   * Handles adding a reaction to the message.
   * Closes the emoji picker after a reaction is added.
   * 
   * @param {string} reaction - The emoji reaction to add.
   */
  const handleAddReaction = async (reaction) => {
    try {
      await addReaction(videoId, message.text, message.timestamp, reaction);
      setShowEmojiPicker(false); // Hide the emoji picker after selection
    } catch (error) {
      console.error('Error adding reaction: ', error);
    }
  };

  return (
    <div className="flex items-start gap-2 mb-6 relative group w-full">
      {/* Author's profile image */}
      <img
        className="w-10 h-10 rounded-full"
        src={message.authorPhotoURL || 'default-profile-pic-url'}
        alt="Profile"
      />
      <div className="flex-grow">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2">
            {/* Author's name and message timestamp */}
            <span className={`text-sm font-bold ${isUserMessage ? 'text-primary' : 'text-secondary '}`}>{message.authorName}</span>
            <span className="text-xs font-light text-current">{formatTimestamp(message.timestamp)}</span>
          </div>
          <div className="relative">
            {/* Options (three dots) button */}
            <span className="three-dots cursor-pointer text-current" onClick={handleThreeDotsClick}>
              ⋮
            </span>
            {showDropdown && (
              <div className="bg-primary absolute z-10 mt-1 rounded-lg shadow-lg w-48 right-0" onMouseLeave={handleMouseLeave}>
                <ul className="py-2 text-sm text-current rounded-xl">
                  {isUserMessage && (
                    <li>
                      {/* Option to remove the message */}
                      <p onClick={handleRemoveClick} className="rounded-xl block p-2 m-2 hover:bg-accent dark:hover:bg-gray-600 dark:hover:text-white">Remove message</p>
                    </li>
                  )}
                  {/* Option to mute the user */}
                  <li>
                    <p onClick={handleMuteUserClick} className="rounded-xl block p-2 m-2 hover:bg-accent dark:hover:bg-gray-600 dark:hover:text-white">Mute account</p>
                  </li>
                  {/* Option to view the author's account information */}
                  <li>
                    <p onClick={() => handleSeeAccountInfo(message.authorUid)} className="rounded-xl block p-2 m-2 hover:bg-accent dark:hover:bg-gray-600 dark:hover:text-white">See account info</p>
                  </li>
                  {/* Placeholder option to add to chat */}
                  <li>
                    <p onClick={() => console.log("Add to chat")} className="rounded-xl block p-2 m-2 hover:bg-accent dark:hover:bg-gray-600 dark:hover:text-white">Add to chat</p>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
        {/* Message text with optional highlighting */}
        <div className={`flex flex-col gap-2 ${messageClasses} mt-1`}>
          <p className="text-sm font-normal break-all w-full">{message.text}</p>
          {/* Display reactions if any */}
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
        {/* Divider line */}
        <div className="h-px bg-secondary w-full my-2"></div>
        {/* Emoji reaction button and picker */}
        <div className="flex flex-row gap-2 mt-1">
          <img src={addEmoji} alt="Reaction" onClick={() => setShowEmojiPicker(!showEmojiPicker)} />
          {showEmojiPicker && (
            <div className="absolute mt-5 z-10">
              <Picker data={data} onEmojiSelect={(emoji) => { handleAddReaction(emoji.native); }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
