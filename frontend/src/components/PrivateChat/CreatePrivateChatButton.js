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
  simulateInvite,
  fetchChats
} from '../../utils/privateChatUtils';

const MAX_PRIVATE_CHATS = 10; // Maximum number of private chats allowed

/**
 * PrivateChatHeader component manages the display and actions for private chats and invitations.
 * 
 * @param {Object} user - Current user information.
 * @param {Array} privateChats - Array of private chat objects.
 * @param {Array} setPrivateChats - setState Function ot update privateChats
 * @param {Array} invitations - Array of invitation objects.
 * @param {Function} setNotification - Function to set notification messages.
 * 
 * @returns {JSX.Element} The rendered component
 */
const CreatePrivateChatButton = ({
  user,
  privateChats,
  setPrivateChats,
  invitations,
  setNotification,
  // handleSimulateInvite, // Commented out
}) => {

  const [showLoginAlert, setShowLoginAlert] = useState(false);

  /**
   * Handles the creation of a new chat if the limit has not been reached.
   * @param {Object} chatSettings - Settings for the new chat.
   */
  const handleCreateChat = async (chatSettings, setPrivateChats) => {
    if (privateChats.length < MAX_PRIVATE_CHATS) {
      await createChat(chatSettings, user); // Create new chat
      setShowChatCreationMenu(false); // Close chat creation menu
      fetchChats(user,setPrivateChats)
    } else {
      alert(`You can only create up to ${MAX_PRIVATE_CHATS} private chats.`);
    }
  };

  /**
   * Handles accepting a chat invitation.
   * @param {string} invitationId - ID of the invitation.
   * @param {string} chatId - ID of the chat to join.
   */
  const handleAcceptInvite = async (invitationId, chatId) => {
    await handleAcceptInvitation(invitationId, chatId, user, setPrivateChats);
  };

  /**
   * Handles rejecting a chat invitation.
   * @param {string} invitationId - ID of the invitation.
   */
  const handleRejectInvite = async (invitationId, chatId) => {
    await handleRejectInvitation(invitationId, chatId, user);
  };

  /**
   * Simulates a chat invitation for testing purposes.
   */
  const handleSimulateInvite = async () => {
    await simulateInvite(user);
  };

  /**
   * Sets and displays a notification message for a short period.
   * @param {string} message - Notification message to display.
   */
  const handleInviteNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 5000); // Clear notification after 5 seconds
  };

  const [showChatCreationMenu, setShowChatCreationMenu] = useState(false); // State for showing chat creation menu

  return (
    <>
      {/* Commenting out the Simulate Invite Button */}
      {/* <button
        onClick={handleSimulateInvite}
        className="btn-secondary mb-4 px-4 py-2 text-white rounded"
      >
        Simulate Invite
      </button> */}

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
