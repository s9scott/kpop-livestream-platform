import React, { useState } from 'react';
import ChatCreationMenu from '../PrivateChat/ChatCreationMenu';
import InvitationPopup from '../PrivateChat/InvitationPopup';
import {
  createChat,
  simulateInvite,
  handleAcceptInvitation,
  handleRejectInvitation,
  fetchActiveUsers,
  fetchPrivateChatName,
  fetchMessages,
  sendMessage,
  fetchPrivateChatVideoTitle,
  fetchPrivateChatVideoId
} from '../../utils/privateChatUtils';
import { fetchUsers } from '../../utils/firestoreUtils';

const MAX_PRIVATE_CHATS = 5; // Maximum number of private chats allowed

/**
 * PrivateChatHeader component manages the display and actions for private chats and invitations.
 * @param {Object} props - Component properties.
 * @param {Object} props.user - Current user information.
 * @param {Array} props.privateChats - Array of private chat objects.
 * @param {Array} props.invitations - Array of invitation objects.
 * @param {Array} props.selectedChats - Array of selected chat IDs.
 * @param {Function} props.setSelectedChats - Function to update selected chats.
 * @param {string|null} props.selectedChatId - ID of the currently selected chat.
 * @param {Function} props.setSelectedChatId - Function to update the selected chat ID.
 * @param {Function} props.setNotification - Function to set notification messages.
 * @returns {JSX.Element} The rendered component.
 */
const PrivateChatHeader = ({
  user,
  privateChats,
  invitations,
  selectedChats,
  setSelectedChats,
  selectedChatId,
  setSelectedChatId,
  setNotification,
  // handleSimulateInvite, // Commented out
}) => {

  /**
   * Handles the creation of a new chat if the limit has not been reached.
   * @param {Object} chatSettings - Settings for the new chat.
   */
  const handleCreateChat = async (chatSettings) => {
    if (privateChats.length < MAX_PRIVATE_CHATS) {
      await createChat(chatSettings, user); // Create new chat
      setShowChatCreationMenu(false); // Close chat creation menu
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
    await handleAcceptInvitation(invitationId, chatId, user, setSelectedChats);
  };

  /**
   * Handles rejecting a chat invitation.
   * @param {string} invitationId - ID of the invitation.
   */
  const handleRejectInvite = async (invitationId) => {
    await handleRejectInvitation(invitationId, user);
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

  /**
   * Handles closing a chat tab.
   * @param {string} chatId - ID of the chat to close.
   */
  const handleTabClose = (chatId) => {
    setSelectedChats(selectedChats.filter(id => id !== chatId));
    if (selectedChatId === chatId) {
      setSelectedChatId(selectedChats.length > 1 ? selectedChats[0] : null);
    }
  };

  /**
   * Handles opening a chat tab.
   * @param {string} chatId - ID of the chat to open.
   */
  const handleTabOpen = (chatId) => {
    setSelectedChats([...selectedChats, chatId]);
    setSelectedChatId(chatId);
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

      {/* Chat Selection Dropdown */}
      <div className="dropdown dropdown-hover menu-lg z-40">
        <div
          tabIndex={1}
          role="button"
          className="btn btn-secondary text-sm whitespace-nowrap hover:btn-accent transform hover:-translate-y-1 hover:scale-110 delay-100 duration-200 mr-1"
        >
          Select Chat
        </div>
        <ul className="dropdown-content menu bg-primary text-primary-content rounded-lg z-[1] w-52 p-2 mt-2 shadow">
          {privateChats.map(chat => (
            <li key={chat.id}>
              <button
                onClick={() => handleTabOpen(chat.id)}
                className="block px-4 py-2 text-base text-xsm font-semibold hover:bg-accent hover:text-m transition-colors duration-200 w-full text-left"
              >
                {chat.name}
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={() => setShowChatCreationMenu(true)}
              className="block text-align-center text-xsm text-base-content font-bold hover:bg-accent hover:text-m bg-neutral duration-200 w-full text-left"
            >
              Create Private Chat
            </button>
          </li>
        </ul>
      </div>

      {/* Chat Creation Menu */}
      {showChatCreationMenu && (
        <ChatCreationMenu
          onCreateChat={handleCreateChat}
          onClose={() => setShowChatCreationMenu(false)}
          currentUser={user}
        />
      )}

      {/* Invitation Popups */}
      {invitations.map((invitation) => (
        <InvitationPopup
          key={invitation.id}
          invitation={invitation}
          onAccept={() => handleAcceptInvite(invitation.id, invitation.chatId)}
          onReject={() => handleRejectInvite(invitation.id)}
        />
      ))}
    </>
  );
};

export default PrivateChatHeader;
