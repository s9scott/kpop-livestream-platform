import React, { useState } from 'react';
import DraggableResizable from './DraggableResizable';
import NativeChat from './NativeChat';
import useActiveUsers from '../../hooks/useActiveUsers';
import ChatInputForm from './ChatInputForm';

const SwitchableChat = ({ videoId, settings, onResizeStop, onDragStop, user }) => {
  const [useNativeChat, setUseNativeChat] = useState(false);
  const [isActiveUsersModalOpen, setIsActiveUsersModalOpen] = useState(false);
  const { activeUsers, fetchActiveUsers } = useActiveUsers(videoId);

  const toggleChat = () => {
    setUseNativeChat((prev) => !prev);
  };

  const toggleActiveUsersModal = () => {
    fetchActiveUsers();
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
      useNativeChat={useNativeChat} toggleChat={toggleChat} 
    >
      <div className="switchable-chat-container size-full fixed">
        
      <div className="chat-toggle flex justify-between items-center py-2 px-4 bg-neutral border-b border-secondary">
        <button 
          onClick={toggleChat} 
          className="toggle-chat-button w-full px-2 center py-1 btn btn-secondary font-semibold hover:btn-accent text-lg font-light tracking-wide"
        >
          {useNativeChat ? 'Switch to YouTube Chat' : 'Switch to Native Chat'}
        </button>
      </div>
        <div className="chat-content flex-grow overflow-y-auto p-4 bg-neutral" style={{ height: 'calc(100% - 6rem)' }}>
          {useNativeChat ? (
            <NativeChat
              videoId={videoId}
              settings={settings}
              onResizeStop={onResizeStop}
              onDragStop={onDragStop}
              user={user}
              activeUsers={activeUsers}
              fetchActiveUsers={fetchActiveUsers}
              toggleActiveUsersModal={toggleActiveUsersModal}
            />
          ) : (
            <iframe
              className="rounded-badge"
              width="100%"
              height="95%"
              src={chatSrc}
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Live Chat"
            ></iframe>
          )}
        </div>

        {isActiveUsersModalOpen && (
          <div className="active-users-modal fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
            <div className="modal-content bg-primary rounded-lg shadow-lg p-4 w-full max-w-lg dark:bg-gray-800">
              <span className="close text-gray-500 hover:text-gray-800 cursor-pointer float-right" onClick={toggleActiveUsersModal}>&times;</span>
              <h2 className="text-current text-xl font-semibold mb-4">Active Users</h2>
              <ul className="max-h-64 overflow-y-auto">
                {activeUsers.length > 0 ? (
                  activeUsers.map((activeUser, index) => (
                    <li key={index} className="flex items-center mb-2">
                      <img
                        src={activeUser.photoURL || activeUser.profilePicture}
                        alt="Profile"
                        className="profile-pic w-12 h-12 rounded-full mr-2"
                      />
                      <span className="text-current font-semibold">{activeUser.displayName || activeUser.username}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-700 dark:text-gray-200">No active users</li>
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
