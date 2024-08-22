import React, { useState, useEffect, useRef } from 'react';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import users from '../../assets/users.svg';

/**
 * 
 * @param input, handleInputChange, handleSendClick, mentionDropdown, handleMentionClick, togglePrivateUsersModal
 * What they are?
 * input: The current input value in the chat input field
 * handleInputChange: Function to handle input change in the chat input field
 * handleSendClick: Function to handle send button click in the chat input field
 * mentionDropdown: The list of users to mention in the chat
 * handleMentionClick: Function to handle mention click in the chat input field
 * togglePrivateUsersModal: Function to toggle the private users modal
 * @returns PrivateChatInputForm
 * 
 * This component displays the input form for the private chat.
 * It allows users to type messages, mention other users, and send messages.
 * It also displays a dropdown with user suggestions when a user is mentioned.
 * When a user is clicked, the user information modal is displayed.
 * When the private users modal is toggled, the modal is displayed or hidden.
 */

const PrivateChatInputForm = ({
  input,
  handleInputChange,
  handleSendClick,
  mentionDropdown,
  handleMentionClick,
  togglePrivateUsersModal,
}) => {
  const [showDropdown, setShowDropdown] = useState(false); // State for mention dropdown
  const [filteredMentions, setFilteredMentions] = useState([]); // State for filtered mentions
  const inputRef = useRef(input); // Reference to the input field
  const [showEmojiDropdown, setShowEmojiDropdown] = useState(false); // State for emoji picker

  // Update the input reference when the input changes
  useEffect(() => {
    inputRef.current = input;
  }, [input]);

  // Handle key down event
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendClick(e); // Trigger the submit action
    }
  };

  // Add emoji to the input field
  const addEmoji = (emoji) => {
    const value = inputRef.current;
    const newValue = value.replace(/:\w*:*$/, '') + emoji.native;
    handleInputChange({ target: { value: newValue } });
    setShowEmojiDropdown(false);
  };

  // Handle key up event
  const handleKeyUp = (e) => {
    const value = e.target.value;
    if (value.includes('@')) {
      const query = value.split('@').pop().toLowerCase();
      setFilteredMentions(
        mentionDropdown.filter((user) =>
          user.displayName.toLowerCase().includes(query)
        )
      );
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
    if (value.includes(':')) {
      setShowEmojiDropdown(true);
    } else {
      setShowEmojiDropdown(false);
    }
  };

  // Handle mention click event to add the mention to the input field
  const handleMentionClickWrapper = (displayName) => {
    const value = inputRef.current;
    const newValue = value.substring(0, value.lastIndexOf('@')) + `@${displayName} `;
    handleInputChange({ target: { value: newValue } });
    setFilteredMentions([]); // Hide dropdown after selecting a mention
    setShowDropdown(false);
  };

  // Hide dropdown when the input field is blurred
  useEffect(() => {
    if (!input.includes('@')) {
      setShowDropdown(false);
    }
    if (!input.includes(':')) {
      setShowEmojiDropdown(false);
    }
  }, [input]);

  // Render the component
  return (
    <div className="relative">
      <form onSubmit={handleSendClick}>
        <label htmlFor="chat" className="sr-only">Your message</label>
        <div className="flex items-center py-2 px-3 bg-accent rounded-xl mb-5 relative">
          <button
            type="button"
            className="inline-flex justify-center p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
          >
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
          <button
            type="button"
            className="inline-flex justify-center p-2 text-primary rounded-lg cursor-pointer hover:text-gray-900 hover:ghost-btn dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
            onClick={togglePrivateUsersModal}  // Connect the button to the active users modal
          >
            <svg fill="currentColor" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 98.736 98.736" className="w-6 h-6">
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <g>
                  <g>
                    <path d="M26.417,56.739c0-5.115,1.688-9.838,4.528-13.656c-2.974-2.673-6.893-4.313-11.205-4.313 c-9.272,0-16.789,7.518-16.789,16.789c0,0,3.95,35.276,16.789,35.276c4.962,0,8.592-5.274,11.184-11.739 c-3.025-9.953-4.248-19.888-4.488-22.026L26.417,56.739z"></path>
                    <path d="M19.74,37.554c5.617,0,10.503-3.125,13.02-7.729c-2.513-3.413-4.006-7.619-4.006-12.173c0-2.066,0.313-4.06,0.882-5.943 c-2.625-2.358-6.088-3.808-9.896-3.808c-8.188,0-14.826,6.639-14.826,14.827C4.914,30.915,11.552,37.554,19.74,37.554z"></path>
                    <path d="M78.996,38.77c-4.312,0-8.23,1.64-11.205,4.313c2.842,3.818,4.528,8.541,4.528,13.656l-0.019,0.33 c-0.24,2.14-1.463,12.073-4.488,22.026c2.592,6.465,6.222,11.739,11.184,11.739c12.839,0,16.789-35.276,16.789-35.276 C95.785,46.288,88.268,38.77,78.996,38.77z"></path>
                    <path d="M65.977,29.824c2.517,4.604,7.401,7.729,13.02,7.729c8.188,0,14.826-6.639,14.826-14.826 c0-8.188-6.639-14.827-14.826-14.827c-3.809,0-7.271,1.449-9.896,3.808c0.568,1.884,0.883,3.877,0.883,5.943 C69.982,22.205,68.489,26.411,65.977,29.824z"></path>
                    <path d="M49.368,36.751c-11.039,0-19.988,8.949-19.988,19.988c0,0,4.704,41.997,19.988,41.997s19.987-41.997,19.987-41.997 C69.355,45.7,60.407,36.751,49.368,36.751z"></path>
                    <circle cx="49.368" cy="17.651" r="17.651"></circle>
                  </g>
                </g>
              </g>
            </svg>
          </button>
          <button
            type="button"
            className="p-2 text-primary rounded-lg cursor-pointer hover:text-gray-900 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
            onClick={() => { setShowEmojiDropdown(!showEmojiDropdown) }}
          >
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
          <input
            id="chat"
            rows="1"
            className="block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300"
            placeholder="Your message..."
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            autoComplete="off"
          ></input>
          <button
            type="submit"
            className="inline-flex justify-center p-2 text-primary cursor-pointer hover:text-gray-900"
          >
            <svg
              className="w-6 h-6 rotate-90"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
            </svg>
          </button>
        </div>
        {showDropdown && filteredMentions.length > 0 && (
          <ul className="absolute bottom-full mb-2 z-40 text-neutral bg-primary hover:accent border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto w-full">
            {filteredMentions.map((user, index) => (
              <li
                key={index}
                className="px-4 py-2 cursor-pointer font-semibold hover:bg-accent hover:text-lg m-2 rounded-xl"
                onClick={() => handleMentionClickWrapper(user.displayName)}
              >
                @{user.displayName}
              </li>
            ))}
          </ul>
        )}
        {showEmojiDropdown && (
          <div className="absolute bottom-full mb-2 rounded-lg">
            <Picker data={data} onEmojiSelect={addEmoji} theme="device" />
          </div>
        )}
      </form>
    </div>
  );
};

export default PrivateChatInputForm;
