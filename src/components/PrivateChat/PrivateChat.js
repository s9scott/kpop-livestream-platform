import React, { useState, useRef, useEffect } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import PrivateMessages from './PrivateMessages';
import PrivateChatInputForm from './PrivateChatInputForm';
import UserInfoModal from '../Chat/UserInfoModal';
import Popup from './Popup';
import { fetchPrivateChatMessages, sendPrivateChatMessage, fetchActiveUsers, fetchPrivateChatVideoTitle, fetchPrivateChatVideoUrl, fetchPrivateChatVideoId } from '../../utils/privateChatUtils';

/**
 * 
 * @param privateChatId, user, updateVideoId, videoId, togglePrivateUsersModal
 * What they are?
 * privateChatId: The ID of the private chat room
 * user: The current user object
 * updateVideoId: Function to update the video ID in the chat room
 * videoId: The ID of the video being watched in the chat room
 * togglePrivateUsersModal: Function to toggle the private users modal
 * @returns PrivateChat
 * 
 * This component displays the private chat room for a specific private chat.
 * It fetches and displays the messages in the chat room.
 * It allows users to send messages, mention other users, and view user information.
 * It also displays the active users in the chat room.
 * When a user is mentioned, a dropdown with user suggestions is displayed.
 * When a user is clicked, a modal with user information is displayed.
 * When the video ID is updated, the video being watched is updated in the chat room.
 * When the private users modal is toggled, the modal is displayed or hidden.
 */

const PrivateChat = ({ privateChatId, user, updateVideoId, videoId, togglePrivateUsersModal, selectedTab, setSelectedTab }) => {
  const [messages, setMessages] = useState([]); // State variable for the messages in the chat
  const [input, setInput] = useState(''); // State variable for the input message
  const [showOptions, setShowOptions] = useState({}); // State variable for the user options modal
  const [selectedUser, setSelectedUser] = useState(null); // State variable for the selected user
  const [mentionDropdown, setMentionDropdown] = useState([]); // State variable for the mention dropdown
  const [activeUsers, setActiveUsers] = useState([]); // State variable for the active users in the chat
  const messagesEndRef = useRef(null); // Reference to the end of the messages container
  const [videoTitle, setVideoTitle] = useState(''); // State variable for the video title
  const [isPopupOpen, setIsPopupOpen] = useState(true); // State variable for the popup
  const [privateChatVideoId, setPrivateChatVideoId] = useState(null); // State variable for the video ID

  // Fetch messages, video title, and video ID when the component mounts
  useEffect(() => {
    const fetchVideoId = async () => {
      if (privateChatId) {
        const videoId = await fetchPrivateChatVideoId(privateChatId);
        console.log('Fetched Video ID:', videoId);
        setPrivateChatVideoId(videoId);
      }
    };

    if (privateChatId) {
      const unsubscribeMessages = fetchPrivateChatMessages(privateChatId, setMessages);
      const unsubscribeVideoTitle = fetchPrivateChatVideoTitle(privateChatId, setVideoTitle);
      fetchVideoId();

      return () => {
        unsubscribeMessages();
        unsubscribeVideoTitle();
      };
    }
  }, [privateChatId]);

 // Fetch active users every 30 seconds
  useEffect(() => {
    const fetchUsers = async () => {
      await fetchActiveUsers(setActiveUsers);
    };

    fetchUsers();
    const interval = setInterval(fetchUsers, 30000); // Refresh active users every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Scroll to the bottom of the messages container when new messages are added
  const handleSendClick = async (e) => {
    e.preventDefault();
    await sendPrivateChatMessage(privateChatId, user, input, setInput);
  };

  // Format the timestamp to display the time
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Toggle the user options modal
  const toggleOptions = (index) => {
    setShowOptions((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  // Close the user options modal when clicking outside of it
  const handleClickOutside = (event) => {
    if (!event.target.closest('.options-menu')) {
      setShowOptions({});
    }
  };

  // Handle the mention dropdown
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
 
  // Handle the mention dropdown
  const handleRemoveMessage = (index) => {
    setMessages(prevMessages => prevMessages.filter((_, i) => i !== index));
  };

  // Handle the mention dropdown
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

  // Handle the mention dropdown
  const handleMentionClick = (username) => {
    const inputParts = input.split('@');
    inputParts.pop();
    const newValue = `${inputParts.join('@')}@${username} `;
    setInput(newValue);
    setMentionDropdown([]);
  };

  // Handle the mention dropdown
  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Handle the mention dropdown
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
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
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
