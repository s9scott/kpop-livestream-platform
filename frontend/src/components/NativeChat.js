import React, { useState, useRef, useEffect } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import '../styles/NativeChat.css';
import { Tooltip } from 'react-tooltip';

const NativeChat = ({ videoId, settings, onResizeStop, onDragStop, user }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [hoveredUser, setHoveredUser] = useState(null);
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
              return { ...message, authorPhotoURL: userData.photoURL, userInfo: userData };
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

  const handleMouseEnter = async (uid) => {
    if (!uid) return;

    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setHoveredUser(userSnap.data());
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  const handleMouseLeave = () => {
    setHoveredUser(null);
  };

  return (
    <div className="native-chat" style={{ width: '100%', height: '100%' }}>
      <div className="chat-header">Live Chat</div>
      <div className="messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className="message"
            data-tooltip-id={`user-tooltip-${index}`}
            onMouseEnter={() => handleMouseEnter(message.authorUid)}
            onMouseLeave={handleMouseLeave}
          >
            <img src={message.authorPhotoURL || 'default-profile-pic-url'} alt="Profile" className="profile-pic" />
            <div className="message-info">
              <span className="author">{message.authorName}</span>
              <div className="message-content">
                <div className="text">{message.text}</div>
                <span className="timestamp">{formatTimestamp(message.timestamp)}</span>
              </div>
            </div>
            {hoveredUser && (
              <Tooltip id={`user-tooltip-${index}`} place="top" type="dark" effect="solid">
                <div className="tooltip-content">
                  <p><strong>{hoveredUser.displayName}</strong></p>
                  <p>{hoveredUser.email}</p>
                  <p>Joined: {new Date(hoveredUser.createdAt.seconds * 1000).toDateString()}</p>
                </div>
              </Tooltip>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {user ? ( 
          <form onSubmit={handleSendClick} className="chat-input">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message"
            className="chat-input-field"
          />
          <button type="submit" className="chat-input-button">Send</button>
        </form>
        ) : (
          <div className="chat-input">
            <span className="chat-input-message">Sign in to chat</span>
          </div>
        )}
    </div>
  );
};

export default NativeChat;


/*
{user ? ( 
  <form onSubmit={handleSendClick} className="chat-input">
  <input
    value={input}
    onChange={(e) => setInput(e.target.value)}
    placeholder="Type a message"
    className="chat-input-field"
  />
  <button type="submit" className="chat-input-button">Send</button>
</form>
) : (
  <div className="chat-input">
    <span className="chat-input-message">Sign in to chat</span>
  </div>
)}
*/