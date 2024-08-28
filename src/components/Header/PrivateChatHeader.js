import React, { useState } from 'react';
import ChatCreationMenu from '../PrivateChat/ChatCreationMenu';
import InvitationPopup from '../PrivateChat/InvitationPopup';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import {
  createChat,
  simulateInvite,
  handleAcceptInvitation,
  handleRejectInvitation,
  fetchActiveUsers,
  fetchPrivateChatName,
  fetchMessages,
  sendPrivateChatMessage,
  fetchPrivateChatVideoTitle,
  fetchPrivateChatVideoId
} from '../../utils/privateChatUtils';
import { fetchUsers } from '../../utils/usersUtils';

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
  const [showLoginAlert, setShowLoginAlert] = useState(false);

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
      
      <Menu as="div" className="relative inline-block text-left z-40">
      {/* Button to open the dropdown menu */}
      <MenuButton className="flex items-center text-nowrap justify-between text-left md:w-full md:text-sm text-xxxs btn btn-secondary hover:btn-accent transform hover:-translate-y-1 hover:scale-110 delay-100 duration-200 font-semibold">    
          <span>Select Chat</span>
      </MenuButton>

      {/* Dropdown menu displaying available chats */}
      <MenuItems className="absolute text-sm left-0 z-10 mt-2 w-56 origin-top-left rounded-md bg-primary shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none max-h-80 overflow-y-auto no-scrollbar">
        <div className="py-1">
          {privateChats.map(chat => (
            <MenuItem key={chat.id}>
              {({ active }) => (
                <div
                  onClick={() => handleTabOpen(chat.id)}
                  className={`block px-4 py-2 text-xsm break-all rounded-md m-1 cursor-pointer ${active ? 'bg-accent text-black' : 'text-white'}`}
                >
                  {chat.name}
                </div>
              )}
            </MenuItem>
          ))}
          <MenuItem>
            {({ active }) => (
              <div
                onClick={() => { setShowChatCreationMenu(true); if (!user) { console.log("hello"); setShowLoginAlert(true);} }}
                className={`block px-4 py-2 text-xsm rounded-md m-1 cursor-pointer font-bold ${active ? 'bg-accent text-white' : 'bg-neutral text-accent'}`}
              >
                Create Private Chat
              </div>
            )}
          </MenuItem>
        </div>
      </MenuItems>
    </Menu>

      {/* Chat Creation Menu */}
      {showChatCreationMenu && (
        <ChatCreationMenu
          onCreateChat={handleCreateChat}
          onClose={() => setShowChatCreationMenu(false)}
          currentUser={user}
          showLoginAlert={showLoginAlert}
          setShowLoginAlert={setShowLoginAlert}
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
