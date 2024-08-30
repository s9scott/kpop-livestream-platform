import React, { useState, useRef, useEffect } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import Messages from './Messages';
import ChatInputForm from './ChatInputForm';
import UserInfoModal from './UserInfoModal';
import { fetchYoutubeDetails } from '../../utils/livestreamsUtils';
import data from '@emoji-mart/data';

/**
 * NativeChat component handles the chat interface for a livestream.
 *
 * @param {Object} props - Component properties.
 * @param {string} props.videoId - ID of the livestream video.
 * @param {Object} props.user - Current user information.
 * @param {Array} props.activeUsers - List of users currently active in the chat.
 * @param {Function} props.toggleActiveUsersModal - Function to toggle active users modal.
 * @returns {JSX.Element} The NativeChat component.
 */
const NativeChat = ({ videoId, user, activeUsers, toggleActiveUsersModal, selectedTab, setSelectedTab }) => {
  // State variables
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showOptions, setShowOptions] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [mentionDropdown, setMentionDropdown] = useState([]);
  const [videoTitle, setVideoTitle] = useState('');
  const messagesEndRef = useRef(null);
  const [isPopupOpen, setIsPopupOpen] = useState(true); 

  useEffect(() => {
    if (videoId) {
      // Listen for new messages
      const q = query(collection(db, 'livestreams', videoId, 'messages'), orderBy('timestamp', 'asc'));
      const unsubscribe = onSnapshot(q, async (snapshot) => {
        const messagesData = await Promise.all(snapshot.docs.map(async (docSnapshot) => {
          const message = docSnapshot.data();
          if (message.authorUid) {
            const userRef = doc(db, 'users', message.authorUid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              const userData = userSnap.data();
              return { ...message, authorPhotoURL: userData.photoURL || userData.profilePicture, userInfo: userData };
            }
          }
          return message;
        }));

        setMessages(messagesData);
      });

      // Fetch video title
      const fetchVideoTitle = async () => {
        const videoDetails = await fetchYoutubeDetails(videoId);
        console.log(videoDetails);
        if (videoDetails) {
          setVideoTitle(videoDetails.title);
        }
      };

      fetchVideoTitle();

      // Cleanup listener on component unmount
      return () => unsubscribe();
    }
  }, [videoId]);

  /**
   * Handles sending a new message.
   * @param {React.FormEvent} e - Form submit event.
   */
  const handleSendClick = async (e) => {
    e.preventDefault();
    if (input.trim() && videoId && user) {
      const convertedText = convertEmojiCodes(input);
      const messageData = {
        text: convertedText,
        authorName: user.displayName,
        authorUid: user.uid,
        timestamp: new Date().toISOString(),
      };
      await addDoc(collection(db, 'livestreams', videoId, 'messages'), messageData);
      setInput('');
    }
  };

  /**
   * Converts emoji shortcodes in the text to native emojis.
   * @param {string} text - Text containing emoji shortcodes.
   * @returns {string} Text with native emojis.
   */
  const convertEmojiCodes = (text) => {
    const emojiMap = data.emojis;
    let result = text;
    Object.keys(emojiMap).forEach((code) => {
      const emoji = emojiMap[code];
      if (result.includes(`:${code}:`)) result = result.replace(`:${code}:`, emoji.skins[0].native);
    });
    return result;
  };

  /**
   * Formats timestamp into a readable time string.
   * @param {string} timestamp - The timestamp to format.
   * @returns {string} Formatted time string.
   */
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  /**
   * Toggles the visibility of message options for a specific message.
   * @param {number} index - Index of the message to toggle options for.
   */
  const toggleOptions = (index) => {
    setShowOptions((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  /**
   * Closes options menu if click is outside the menu.
   * @param {MouseEvent} event - The click event.
   */
  const handleClickOutside = (event) => {
    if (!event.target.closest('.options-menu')) {
      setShowOptions({});
    }
  };

  /**
   * Fetches user data and sets it for the UserInfoModal.
   * @param {string} uid - User ID to fetch information for.
   */
  const handleSeeAccountInfo = async (uid) => {
    if (!uid) return;
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setSelectedUser(userSnap.data());
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  /**
   * Logs index of message to be removed.
   * @param {number} index - Index of message to remove.
   */
  const handleRemoveMessage = (index) => {
    console.log(`Remove message at index: ${index}`);
  };

  /**
   * Handles changes to the chat input field and updates mention suggestions.
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event.
   */
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);

    if (value.includes('@')) {
      const mentionPart = value.split('@').pop().toLowerCase();
      if (mentionPart) {
        const filteredUsers = activeUsers.filter(user => user.displayName.toLowerCase().includes(mentionPart));
        setMentionDropdown(filteredUsers);
      } else {
        setMentionDropdown([]);
      }
    } else {
      setMentionDropdown([]);
    }
  };

  /**
   * Inserts mention into the input field.
   * @param {string} displayName - Display name of the mentioned user.
   */
  const handleMentionClick = (displayName) => {
    const inputParts = input.split('@');
    inputParts.pop();
    const newValue = `${inputParts.join('@')}@${displayName} `;
    setInput(newValue);
    setMentionDropdown([]);
  };

  // Attach and detach click event listener for handling clicks outside options menu
  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex-grow overflow-y-auto">
        {isPopupOpen && (
          <div className="absolute top-24 left-5 right-5 bg-base-100 bg-secondary p-6 rounded-lg shadow-lg z-50">
            <button onClick={() => setIsPopupOpen(false)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">✕</button>
            <h2 className="text-lg font-semibold text-base">Welcome to the private chat!</h2>
            <p className="text-sm text-neutral">Watching: {videoTitle}</p>
            <p className="text-sm dark:text-gray-300">Active Users: {activeUsers.length}</p>
          </div>
        )}

        <Messages
          videoId={videoId}
          messages={messages}
          user={user}
          formatTimestamp={formatTimestamp}
          toggleOptions={toggleOptions}
          showOptions={showOptions}
          handleSeeAccountInfo={handleSeeAccountInfo}
          handleRemoveMessage={handleRemoveMessage}
          isPopupOpen={isPopupOpen}
          setIsPopupOpen={setIsPopupOpen}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
        <div ref={messagesEndRef} />
      </div>
      <ChatInputForm
        input={input}
        handleInputChange={handleInputChange}
        handleSendClick={handleSendClick}
        mentionDropdown={mentionDropdown}
        handleMentionClick={handleMentionClick}
        toggleActiveUsersModal={toggleActiveUsersModal}
      />
      <UserInfoModal
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
      />
    </div>
  );
};

export default NativeChat;
