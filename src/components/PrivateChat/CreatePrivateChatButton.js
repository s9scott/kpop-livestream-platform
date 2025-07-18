/**
 * @file CreatePrivateChatButton.js
 * @author Simon Tenedero, Jonas Matulis
 * @created 2024-XX-XX
 * @lastModified 2025-05-27
 * @desc file containing CreatePrivateChatButton and functions handling invitations
 */

import React, { useState } from 'react';
import ChatCreationMenu from './ChatCreationMenu';
import {
  createChat,
  fetchChats
} from '../../utils/privateChatUtils';
import { useUser } from '../../context/UserContext';

const MAX_PRIVATE_CHATS = 10; // Maximum number of private chats allowed

/**
 * Component manages the display and actions for private chats and invitations.
 * 
 * @param {Array} privateChats - Array of private chat objects.
 * @param {Array} setPrivateChats - setState Function ot update privateChats
 * @param {Function} setNotification - Function to set notification messages.
 * 
 * @returns {JSX.Element} The rendered component
 */
const CreatePrivateChatButton = ({
  privateChats,
  setPrivateChats,
  }) => {

  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const {user} = useUser();

  /**
   * Handles the creation of a new chat if the limit has not been reached.
   * @param {Object} chatSettings - Settings for the new chat.
   */
  const handleCreateChat = async (chatSettings, setPrivateChats) => {
    if (privateChats.length < MAX_PRIVATE_CHATS) {
      await createChat(chatSettings, user); // Create new chat
      setShowChatCreationMenu(false); // Close chat creation menu
      await fetchChats(user,setPrivateChats)
    } else {
      alert(`You can only create up to ${MAX_PRIVATE_CHATS} private chats.`);
    }
  };

  const [showChatCreationMenu, setShowChatCreationMenu] = useState(false); // State for showing chat creation menu

  return (
    <>

      {/* Login Alert Modal */}
      {showLoginAlert && (
        <div className="active-users-modal fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="modal-content bg-primary rounded-lg shadow-lg p-4 w-full max-w-md dark:bg-gray-800">
            <span 
              className="close text-red-500 hover:text-red-800 cursor-pointer float-right" 
              onClick={() => setShowLoginAlert(false)}
            >
              &times;
            </span>
            <h2 className="text-current text-2xl font-semibold m-4 text-center">
              You must Login to create Private Chats!
            </h2>
          </div>
        </div>
      )}

      {/* Create Chat Button */}
      <div className="flex flex-col space-y-2 p-2">
        <button 
          onClick={() => { 
            setShowChatCreationMenu(true); 
            if (!user) { 
              setShowLoginAlert(true);
            } 
          }} 
          className="justify-center flex text-nowrap text-center w-full md:text-sm text-xxxs btn btn-secondary"
        >    
          create chat
        </button>
      </div>

      {/* Chat Creation Menu */}
      {showChatCreationMenu && (
        <ChatCreationMenu
          onCreateChat={handleCreateChat}
          onClose={() => setShowChatCreationMenu(false)}
          currentUser={user}
          showLoginAlert={showLoginAlert}
          setShowLoginAlert={setShowLoginAlert}
          setPrivateChats={setPrivateChats}
        />
      )}
    </>
  );
};

export default CreatePrivateChatButton;
