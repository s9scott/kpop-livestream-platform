// NativeChat.js
import React, { useState, useRef, useEffect } from 'react';
import '../styles/NativeChat.css';

const NativeChat = ({ settings, onResizeStop, onDragStop }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const handleSendClick = (e) => {
    e.preventDefault();
    const messageData = {
      text: input,
      author: 'You',
      timestamp: new Date().toISOString(),
    };
    setMessages((prevMessages) => [...prevMessages, messageData]);
    setInput('');
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

  return (
    <div className="native-chat" style={{ width: '100%', height: '100%' }}>
      <div className="chat-header">Live Chat</div>
      <div className="messages">
        {messages.map((message, index) => (
          <div key={index} className="message">
            <img src="your-profile-image-url" alt="Profile" className="profile-pic" />
            <div className="message-info">
              <span className="author">{message.author}</span>
              <div className="message-content">
                <div className="text">{message.text}</div>
                <span className="timestamp">{formatTimestamp(message.timestamp)}</span>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendClick} className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
          className="chat-input-field"
        />
        <button type="submit" className="chat-input-button">Send</button>
      </form>
    </div>
  );
};

export default NativeChat;
