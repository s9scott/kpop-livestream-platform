import React, { useState, useRef, useEffect } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import Messages from './PrivateMessages';
import ChatInputForm from './PrivateChatInputForm';
import UserInfoModal from '../../StreamPlayer/UserInfoModal';
import { fetchMessages, sendMessage, fetchActiveUsers } from '../../../utils/privateChatUtils';
import DraggableResizable from '../../StreamPlayer/DraggableResizable';


const PrivateChat = ({ privateChatId, user, handleInviteNotification }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showOptions, setShowOptions] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [mentionDropdown, setMentionDropdown] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const messagesEndRef = useRef(null);


  const calculateDefaultSettings = () => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight - 150;
    const videoPlayerWidth = screenWidth * 0.65;
    const chatWidth = screenWidth * 0.35 - 50;

    return {
      videoPlayerSettings: { width: videoPlayerWidth, height: screenHeight, x: 20, y: 20 },
      chatSettings: { width: chatWidth, height: screenHeight, x: videoPlayerWidth + 40, y: 20 }
    };
  };

  const { videoPlayerSettings: defaultVideoPlayerSettings, chatSettings: defaultChatSettings } = calculateDefaultSettings();

  const [videoId, setVideoId] = useState('');
  const [videoPlayerSettings, setVideoPlayerSettings] = useState(defaultVideoPlayerSettings);
  const [chatSettings, setChatSettings] = useState(defaultChatSettings);

  const handleResizeStop = (type, data) => {
    const { size, position } = data;
    if (type === 'video') {
      const newSettings = { ...videoPlayerSettings, width: size.width, height: size.height, x: position.x, y: position.y };
      setVideoPlayerSettings(newSettings);
      localStorage.setItem('videoPlayerSettings', JSON.stringify(newSettings));
    } else {
      const newSettings = { ...chatSettings, width: size.width, height: size.height, x: position.x, y: position.y };
      setChatSettings(newSettings);
      localStorage.setItem('chatSettings', JSON.stringify(newSettings));
    }
  };

  const handleDragStop = (type, data) => {
    const { x, y } = data;
    if (type === 'video') {
      const newSettings = { ...videoPlayerSettings, x, y };
      setVideoPlayerSettings(newSettings);
      localStorage.setItem('videoPlayerSettings', JSON.stringify(newSettings));
    } else {
      const newSettings = { ...chatSettings, x, y };
      setChatSettings(newSettings);
      localStorage.setItem('chatSettings', JSON.stringify(newSettings));
    }
  };

  useEffect(() => {
    if (privateChatId) {
      const unsubscribe = fetchMessages(privateChatId, setMessages);
      return () => unsubscribe();
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
    <DraggableResizable
      defaultWidth={chatSettings.width}
      defaultHeight={chatSettings.height}
      defaultX={chatSettings.x}
      defaultY={chatSettings.y}
      onResizeStop={(data) => handleResizeStop('chat', data)}
      onDragStop={(data) => handleDragStop('chat', data)}
    >
      <div className="flex flex-col w-full h-full">
        <div className="flex items-center justify-between p-3 bg-gray-800 text-white">
          <h2 className="text-lg font-bold">Private Chat</h2>
          <span>{activeUsers.length} active users</span>
        </div>
        <div className="flex-grow overflow-y-auto">
          <Messages
            messages={messages}
            user={user}
            formatTimestamp={formatTimestamp}
            toggleOptions={toggleOptions}
            showOptions={showOptions}
            handleSeeAccountInfo={handleSeeAccountInfo}
            handleRemoveMessage={handleRemoveMessage}
          />
          <div ref={messagesEndRef} />
        </div>
        <ChatInputForm
          input={input}
          handleInputChange={handleInputChange}
          handleSendClick={handleSendClick}
          mentionDropdown={mentionDropdown}
          handleMentionClick={handleMentionClick}
        />
        <UserInfoModal
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
      </div>
    </DraggableResizable>
  );
};

export default PrivateChat;
