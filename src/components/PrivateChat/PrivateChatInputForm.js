import React, { useState, useEffect, useRef } from 'react';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

const PrivateChatInputForm = ({
  input,
  handleInputChange,
  handleSendClick,
  mentionDropdown,
  handleMentionClick
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredMentions, setFilteredMentions] = useState([]);
  const inputRef = useRef(input);
  const [showEmojiDropdown, setShowEmojiDropdown] = useState(false); // State for emoji picker

  useEffect(() => {
    inputRef.current = input;
  }, [input]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendClick(e); // Trigger the submit action
    }
  };

  const addEmoji = (emoji) => {
    const value = inputRef.current;
    const newValue = value.replace(/:\w*:*$/, '') + emoji.native;
    handleInputChange({ target: { value: newValue } });
    setShowEmojiDropdown(false);
  };

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

  const handleMentionClickWrapper = (displayName) => {
    const value = inputRef.current;
    const newValue = value.substring(0, value.lastIndexOf('@')) + `@${displayName} `;
    handleInputChange({ target: { value: newValue } });
    setFilteredMentions([]); // Hide dropdown after selecting a mention
    setShowDropdown(false);
  };

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
            className="p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
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
          <button
            type="button"
            className="p-2 text-primary rounded-lg cursor-pointer hover:text-gray-900 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
            onClick={() => {setShowEmojiDropdown(!showEmojiDropdown)}}
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
