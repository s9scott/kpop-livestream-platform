import React, { useState, useEffect } from 'react';
import DraggableResizable from './DraggableResizable';
import NativeChat from './NativeChat';
import { getActiveUsers } from '../firestoreUtils';
import '../styles/SwitchableChat.css';

const SwitchableChat = ({ videoId, settings, onResizeStop, onDragStop, user }) => {
  const [useNativeChat, setUseNativeChat] = useState(false);
  const [activeUsers, setActiveUsers] = useState([]);
  const [isActiveUsersModalOpen, setIsActiveUsersModalOpen] = useState(false);

  useEffect(() => {
    const fetchActiveUsers = async () => {
      const users = await getActiveUsers(videoId);
      setActiveUsers(users);
    };

    fetchActiveUsers();
    const interval = setInterval(fetchActiveUsers, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [videoId]);

  const toggleChat = () => {
    setUseNativeChat((prev) => !prev);
  };

  const toggleActiveUsersModal = () => {
    setIsActiveUsersModalOpen((prev) => !prev);
  };

  const chatSrc = `https://www.youtube.com/live_chat?v=${videoId}&embed_domain=localhost`;

  return (
    <DraggableResizable
      defaultWidth={settings.width}
      defaultHeight={settings.height}
      defaultX={settings.x}
      defaultY={settings.y}
      onResizeStop={onResizeStop}
      onDragStop={onDragStop}
    >
      <div className="switchable-chat-container" style={{ width: '100%', height: '100%', position: 'relative' }}>
        <div className="chat-toggle">
          <button onClick={toggleActiveUsersModal} className="active-users-button">
            Active Users
          </button>
          <button onClick={toggleChat} className="toggle-chat-button">
            {useNativeChat ? 'Switch to YouTube Chat' : 'Switch to Native Chat'}
          </button>
        </div>
        <div className="chat-content" style={{ width: '100%', height: '100%' }}>
          {useNativeChat ? (
            <NativeChat
              videoId={videoId}
              settings={settings}
              onResizeStop={onResizeStop}
              onDragStop={onDragStop}
              user={user} // Pass user to NativeChat
              activeUsers={activeUsers} // Pass active users to NativeChat
            />
          ) : (
            <iframe
              width="100%"
              height="100%"
              src={chatSrc}
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Live Chat"
            ></iframe>
          )}
        </div>

        {isActiveUsersModalOpen && (
          <div className="active-users-modal">
            <div className="modal-content">
              <span className="close" onClick={toggleActiveUsersModal}>&times;</span>
              <h2>Active Users</h2>
              <ul>
                {activeUsers.length > 0 ? (
                  activeUsers.map((activeUser, index) => (
                    <li key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                      <img 
                        src={activeUser.profilePicture || 'default-profile-pic-url'} 
                        alt="Profile" 
                        className="profile-pic" 
                        style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px' }} 
                      />
                      {activeUser.username || 'Unknown User'}
                    </li>
                  ))
                ) : (
                  <li>No active users</li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </DraggableResizable>
  );
};

export default SwitchableChat;
