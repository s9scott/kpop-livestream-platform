import React, { useState, useRef, useEffect } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { getActiveUsers } from '../firestoreUtils';
import '../styles/NativeChat.css';

const NativeChat = ({ videoId, settings, onResizeStop, onDragStop, user, activeUsers }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showOptions, setShowOptions] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [mentionDropdown, setMentionDropdown] = useState([]);
  const messagesEndRef = useRef(null);

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
              return { ...message, authorPhotoURL: userData.profilePicture, userInfo: userData };
            }
          }
          return message;
        }));
        setMessages(messagesData);
      });
      return () => unsubscribe();
    }
  }, [videoId]);

  const handleSendClick = async (e) => {
    e.preventDefault();
    if (input.trim() && videoId && user) {
      const messageData = {
        text: input,
        authorName: user.displayName,
        authorUid: user.uid,
        timestamp: new Date().toISOString(),
      };
      await addDoc(collection(db, 'livestreams', videoId, 'messages'), messageData);
      setInput('');
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

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

  const handleInputChange = (e) => {
    const value = e.target.value;
    //activeUsers = getActiveUsers();
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
    <div className="native-chat" style={{ width: '100%', height: '100%' }}>
      <div className="chat-header">Live Chat</div>
      <div className="messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.text.toLowerCase().includes(`@${user.displayName.toLowerCase()}`) ? 'highlight' : ''}`}
          >
            <img src={message.authorPhotoURL || 'default-profile-pic-url'} alt="Profile" className="profile-pic" />
            <div className="message-info">
              <span className="author">{message.authorName}</span>
              <div className="message-content">
                <div className="text">{message.text}</div>
                <span className="timestamp">{formatTimestamp(message.timestamp)}</span>
              </div>
            </div>
            <div className="options-menu" onClick={() => toggleOptions(index)}>
              <span className="three-dots">⋮</span>
              {showOptions[index] && (
                <div className="options">
                  <p onClick={() => console.log("Mute account")}>Mute account</p>
                  <p onClick={() => handleSeeAccountInfo(message.authorUid)}>See account info</p>
                  <p onClick={() => console.log("Add to chat")}>Add to chat</p>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendClick} className="chat-input-container">
        <div className="chat-input">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Type a message"
            className="chat-input-field"
          />
          <button type="submit" className="chat-input-button">Send</button>
        </div>
        {mentionDropdown.length > 0 && (
          <ul className="mention-dropdown">
            {mentionDropdown.map((user, index) => (
              <li key={index} onClick={() => handleMentionClick(user.username)}>
                {user.username}
              </li>
            ))}
          </ul>
        )}
      </form>
      {selectedUser && (
        <div className="user-info-modal">
          <div className="user-info-content">
            <span className="close" onClick={() => setSelectedUser(null)}>&times;</span>
            <p><strong>{selectedUser.displayName}</strong></p>
            <p>{selectedUser.email}</p>
            <p>Joined: {new Date(selectedUser.createdAt.seconds * 1000).toDateString()}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NativeChat;
