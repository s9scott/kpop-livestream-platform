import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import DraggableResizable from './DraggableResizable';
import '../styles/NativeChat.css';

const NativeChat = ({ videoId, settings, onResizeStop, onDragStop }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [initialFetchDone, setInitialFetchDone] = useState(false);
  const messageQueue = useRef([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchLiveChatId = async () => {
      try {
        const response = await axios.post('http://localhost:3001/setVideoId', { videoId });
        console.log('Live Chat ID response:', response.data);
        if (response.data.liveChatId) {
          startFetchingMessages(response.data.liveChatId);
        }
      } catch (error) {
        console.error('Error fetching live chat ID:', error);
      }
    };

    fetchLiveChatId();
  }, [videoId]);

  const startFetchingMessages = (liveChatId) => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get('http://localhost:3001/fetchChatMessages');
        const newMessages = response.data;

        if (!initialFetchDone) {
          setMessages(newMessages);
          setInitialFetchDone(true);
        } else {
          messageQueue.current = [...messageQueue.current, ...newMessages];
          processMessageQueue();
        }
      } catch (error) {
        console.error('Error fetching chat messages:', error);
      }
    };

    fetchMessages(); // Initial fetch
    const intervalId = setInterval(fetchMessages, 5000); // Fetch messages every 5 seconds
    return () => clearInterval(intervalId);
  };

  const processMessageQueue = useCallback(() => {
    if (messageQueue.current.length > 0) {
      const message = messageQueue.current.shift();
      setMessages(prevMessages => [...prevMessages, message]);

      setTimeout(processMessageQueue, 1000); // Adjust delay for typing effect
    }
  }, []);
  
  const handleSendClick = async (e) => {
    e.preventDefault()
    const messageData = {
      text: input,
      author: 'You', // Assuming the user's name is 'You' for simplicity
      timestamp: new Date().toLocaleString(),
    };

    // Save message to Firestore
    const messagesRef = collection(db, 'chats', videoId, 'messages');
    await addDoc(messagesRef, {
      text: input,
      author: 'You',
      timestamp: serverTimestamp(),
    });

    // Send message to server
    try {
      const response = await axios.post('http://localhost:3001/insert-message', { message: input });
      console.log('Message inserted:', response.data);
    } catch (error) {
      console.error('Error inserting message:', error);
    }

    // Update local state
    setMessages(prevMessages => [...prevMessages, messageData]);
    setInput('');
  };

  const handleAuthorizeClick = async () => {
    try {
      //const response = await axios.get('http://localhost:3001/authorize');
      window.location.href = 'http://localhost:3001/authorize'
      //console.log('Authorize response:', response.data);
    } catch (error) {
      console.error('Error authorizing:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <DraggableResizable
      defaultWidth={settings.width}
      defaultHeight={settings.height}
      defaultX={settings.x}
      defaultY={settings.y}
      onResizeStop={onResizeStop}
      onDragStop={onDragStop}
    >
      <div className="native-chat">
        <div className="chat-header">Live Chat</div>
        <div className="messages">
          {messages.map((message, index) => (
            <div key={index} className="message">
              <span className="author">{message.author}:</span> {message.text}
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
          <button type="button" onClick={handleAuthorizeClick} id='authorizeButton' className="auth">auth</button>
        </form>
      </div>
    </DraggableResizable>
  );
};

export default NativeChat;
