import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../styles/HybridChat.css';

const HybridChat = ({ videoId, settings, onResizeStop, onDragStop }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const iframeRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/fetchChatMessages?videoId=${videoId}`);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching chat messages:', error);
      }
    };

    fetchMessages();
    const intervalId = setInterval(fetchMessages, 5000); // Fetch messages every 5 seconds
    return () => clearInterval(intervalId);
  }, [videoId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendClick = (e) => {
    e.preventDefault();

    // Insert message into the invisible YouTube chat iframe
    const iframe = iframeRef.current;
    if (iframe) {
      const iframeWindow = iframe.contentWindow;
      // Sending a message to the iframe (Note: YouTube chat iframe does not support this, but for custom iframes, you can use postMessage)
      iframeWindow.postMessage({ event: 'command', func: 'addMessage', args: [input] }, '*');
    }

    setInput('');
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="hybrid-chat-container" style={{ width: settings.width, height: settings.height }}>
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className="message">
            <img src={message.authorProfileImageUrl} alt="Profile" className="profile-pic" />
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
      <div className="chat-input-container">
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
      <iframe
        ref={iframeRef}
        src={`https://www.youtube.com/live_chat?v=${videoId}&embed_domain=localhost`}
        style={{ display: 'none' }}
        title="Invisible YouTube Live Chat"
      ></iframe>
    </div>
  );
};

export default HybridChat;
