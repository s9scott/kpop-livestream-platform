import React, { useState, useRef, useEffect } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import Messages from './Messages';
import ChatInputForm from './ChatInputForm';
import UserInfoModal from './UserInfoModal';
import { fetchYoutubeDetails } from '../../utils/firestoreUtils';
import data from '@emoji-mart/data';

const NativeChat = ({ videoId, user, activeUsers, toggleActiveUsersModal }) => {
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

      const fetchVideoTitle = async () => {
        const videoDetails = await fetchYoutubeDetails(videoId);
        console.log(videoDetails);
        if (videoDetails) {
          setVideoTitle(videoDetails.title);
        }
      };

      fetchVideoTitle();

      return () => unsubscribe();
    }
  }, [videoId]);

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

  const convertEmojiCodes = (text) => {
    const emojiMap = data.emojis;
    let result = text;
    Object.keys(emojiMap).forEach((code) => {
      const emoji = emojiMap[code];
      if (result.includes(`:${code}:`)) result = result.replace(`:${code}:`, emoji.skins[0].native);
    });
    return result;
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
    console.log(`Remove message at index: ${index}`);
  };

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

  const handleMentionClick = (displayName) => {
    const inputParts = input.split('@');
    inputParts.pop();
    const newValue = `${inputParts.join('@')}@${displayName} `;
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
