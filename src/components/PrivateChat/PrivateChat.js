import React, { useState, useRef, useEffect } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import PrivateMessages from './PrivateMessages';
import PrivateChatInputForm from './PrivateChatInputForm';
import UserInfoModal from '../StreamPlayer/UserInfoModal';
import Popup from './Popup';
import { fetchMessages, sendMessage, fetchActiveUsers, fetchPrivateChatVideoTitle, fetchPrivateChatVideoUrl, fetchPrivateChatVideoId } from '../../utils/privateChatUtils';

const PrivateChat = ({ privateChatId, user, updateVideoId, videoId, togglePrivateUsersModal}) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showOptions, setShowOptions] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [mentionDropdown, setMentionDropdown] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const [videoTitle, setVideoTitle] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(true);
  const [privateChatVideoId, setPrivateChatVideoId] = useState(null);

  useEffect(() => {
    const fetchVideoId = async () => {
      if (privateChatId) {
        const videoId = await fetchPrivateChatVideoId(privateChatId);
        console.log('Fetched Video ID:', videoId);
        setPrivateChatVideoId(videoId);
      }
    };

    if (privateChatId) {
      const unsubscribeMessages = fetchMessages(privateChatId, setMessages);
      const unsubscribeVideoTitle = fetchPrivateChatVideoTitle(privateChatId, setVideoTitle);
      fetchVideoId();

      return () => {
        unsubscribeMessages();
        unsubscribeVideoTitle();
      };
    }
  }, [privateChatId]);


  useEffect(() => {
    const fetchUsers = async () => {
      await fetchActiveUsers(setActiveUsers);
    };

    fetchUsers();
    const interval = setInterval(fetchUsers, 30000); // Refresh active users every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleSendClick = async (e) => {
    e.preventDefault();
    await sendMessage(privateChatId, user, input, setInput);
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const toggleOptions = (index) => {
    setShowOptions((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleClickOutside = (event) => {
    if (!event.target.closest('.options-menu')) {
      setShowOptions({});
    }
  };

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

  const handleRemoveMessage = (index) => {
    setMessages(prevMessages => prevMessages.filter((_, i) => i !== index));
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);

    if (value.includes('@')) {
      const mentionPart = value.split('@').pop().toLowerCase();
      if (mentionPart) {
        const filteredUsers = activeUsers.filter(user => user.username.toLowerCase().includes(mentionPart));
        setMentionDropdown(filteredUsers);
      } else {
        setMentionDropdown([]);
      }
    } else {
      setMentionDropdown([]);
    }
  };

  const handleMentionClick = (username) => {
    const inputParts = input.split('@');
    inputParts.pop();
    const newValue = `${inputParts.join('@')}@${username} `;
    setInput(newValue);
    setMentionDropdown([]);
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col w-full h-full">
      {isPopupOpen && (
        <div className="absolute top-24 left-5 right-5 bg-base-100 bg-secondary p-6 rounded-lg shadow-lg z-50">
          <button onClick={() => setIsPopupOpen(false)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">✕</button>
          <h2 className="text-lg font-semibold text-base">Welcome to the private chat!</h2>
          <p className="text-sm text-neutral">Watching: {videoTitle}</p>
          {(videoId !== privateChatVideoId && privateChatVideoId !== null) && (
            <button onClick={() => updateVideoId(privateChatId)} className="mt-4 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
              Update Video
            </button>
          )}
        </div>
      )}


      <div className="flex-grow overflow-y-auto">
        <PrivateMessages
          videoId={videoId}
          privateChatId={privateChatId}
          messages={messages}
          user={user}
          formatTimestamp={formatTimestamp}
          toggleOptions={toggleOptions}
          showOptions={showOptions}
          handleSeeAccountInfo={handleSeeAccountInfo}
          handleRemoveMessage={handleRemoveMessage}
          isPopupOpen={isPopupOpen}
          setIsPopupOpen={setIsPopupOpen}
        />
        <div ref={messagesEndRef} />
      </div>
      <PrivateChatInputForm
        input={input}
        handleInputChange={handleInputChange}
        handleSendClick={handleSendClick}
        mentionDropdown={mentionDropdown}
        handleMentionClick={handleMentionClick}
        togglePrivateUsersModal={togglePrivateUsersModal}
      />
      <UserInfoModal
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
      />
    </div>
  );
};

export default PrivateChat;
