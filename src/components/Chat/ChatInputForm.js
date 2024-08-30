import React, { useState, useEffect, useRef } from 'react';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

/**
 * ChatInputForm component handles user input for chat messages,
 * including support for mentions and emoji selection.
 * 
 * @param {Object} props - The component props.
 * @param {string} props.input - The current value of the chat input.
 * @param {function} props.handleInputChange - Function to handle changes to the chat input value.
 * @param {function} props.handleSendClick - Function to handle sending the chat message.
 * @param {Array} props.mentionDropdown - List of users for the mention dropdown.
 * @param {function} props.handleMentionClick - Function to handle selecting a mention.
 * @param {function} props.toggleActiveUsersModal - Function to toggle the active users modal.
 * 
 * @returns {JSX.Element} The rendered ChatInputForm component.
 */
const ChatInputForm = ({
  input,
  handleInputChange,
  handleSendClick,
  mentionDropdown,
  handleMentionClick,
  toggleActiveUsersModal,
}) => {
  const [showDropdown, setShowDropdown] = useState(false); // Controls the visibility of the mention dropdown
  const [filteredMentions, setFilteredMentions] = useState([]); // Stores filtered mentions based on user input
  const inputRef = useRef(input); // Reference to keep track of the current input value
  const [showEmojiDropdown, setShowEmojiDropdown] = useState(false); // Controls the visibility of the emoji picker

  /**
   * Updates the input reference whenever the input prop changes.
   */
  useEffect(() => {
    inputRef.current = input;
  }, [input]);

  /**
   * Handles keydown events for the input field. If the Enter key is pressed without Shift,
   * it prevents the default behavior and triggers the send action.
   * 
   * @param {object} e - The keydown event object.
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendClick(e);
    }
  };

  /**
   * Adds the selected emoji to the current input value and hides the emoji picker.
   * 
   * @param {object} emoji - The selected emoji object.
   */
  const addEmoji = (emoji) => {
    const value = inputRef.current;
    const newValue = value.replace(/:\w*:*$/, '') + emoji.native;
    handleInputChange({ target: { value: newValue } });
    setShowEmojiDropdown(false);
  };

  /**
   * Handles keyup events to trigger the mention or emoji dropdowns.
   * 
   * @param {object} e - The keyup event object.
   */
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

  /**
   * Handles the selection of a mention from the dropdown, replacing the
   * query with the selected mention in the input field.
   * 
   * @param {string} displayName - The display name of the selected mention.
   */
  const handleMentionClickWrapper = (displayName) => {
    const value = inputRef.current;
    const newValue = value.substring(0, value.lastIndexOf('@')) + `@${displayName} `;
    handleInputChange({ target: { value: newValue } });
    setFilteredMentions([]);
    setShowDropdown(false);
  };

  /**
   * Closes the dropdowns when '@' or ':' are removed from the input.
   */
  useEffect(() => {
    if (!input.includes('@')) {
      setShowDropdown(false);
    }
    if (!input.includes(':')) {
      setShowEmojiDropdown(false);
    }
  }, [input]);

  return (
    <div className="relative">
      <form onSubmit={handleSendClick}>
        <label htmlFor="chat" className="sr-only">Your message</label>
        <div className="flex items-center py-2 px-3 bg-accent rounded-xl mb-5 relative">
          {/* Button to toggle the active users modal */}
          <button
            type="button"
            className="inline-flex justify-center p-2 text-primary rounded-lg cursor-pointer hover:text-gray-900 hover:ghost-btn dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
            onClick={toggleActiveUsersModal}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="2 2 20 20"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          {/* Emoji picker toggle button */}
          <button
            type="button"
            className="p-2 text-primary rounded-lg cursor-pointer hover:text-gray-900 hover:ghost-btn dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
            onClick={() => setShowEmojiDropdown(!showEmojiDropdown)}
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
          {/* Chat input field */}
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
          />
          {/* Send message button */}
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
        {/* Mention dropdown list */}
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
        {/* Emoji picker */}
        {showEmojiDropdown && (
          <div className="absolute bottom-full mb-2 rounded-lg">
            <Picker data={data} onEmojiSelect={addEmoji} theme="device" />
          </div>
        )}
      </form>
    </div>
  );
};

export default ChatInputForm;
