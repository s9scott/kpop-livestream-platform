import React, { useState } from 'react';
import ChatCreationMenu from './ChatCreationMenu';
import InvitationPopup from './InvitationPopup';

/**
 * 
 * @param user, privateChats, activeUsers, invitations, handleTabOpen, handleCreateChat, handleAcceptInvite, handleRejectInvite
 * What they are?
 * user: Variable with current user info { uid: string, username: string, email: string }
 * privateChats: Array of private chat objects { id: string, name: string, url: string, users: Array }
 * activeUsers: Array of active user objects { uid: string, username: string, email: string }
 * invitations: Array of invitation objects { id: string, chatId: string, sender: string, receiver: string }
 * handleTabOpen: Function to open a chat tab
 * handleCreateChat: Function to create a private chat
 * handleAcceptInvite: Function to accept an invitation
 * handleRejectInvite: Function to reject an invitation
 * 
 * @returns PrivateChatSection
 *
 */
const PrivateChatSection = ({
  user,
  privateChats,
  activeUsers,
  invitations,
  handleTabOpen,
  handleCreateChat,
  handleAcceptInvite,
  handleRejectInvite
}) => {
  const [showChatCreationMenu, setShowChatCreationMenu] = useState(false); // State variable to show/hide the chat creation menu

  // Render the private chat section with a dropdown menu to select chats
  return (
    <>

      <div className="dropdown dropdown-hover menu-lg z-[1001]">
        <div
          tabIndex={1}
          role="button"
          className="btn btn-secondary text-xl hover:btn-accent transform hover:-translate-y-1 hover:scale-110 delay-100 duration-200"
        >
          Select Chat
        </div>
        <ul className="dropdown-content menu bg-primary text-primary-content rounded-lg z-[1] w-52 p-2 mt-2 shadow">
          {privateChats.map(chat => (
            <li key={chat.id}>
              <button
                onClick={() => handleTabOpen(chat.id)}
                className="block px-4 py-2 text-base font-semibold hover:bg-accent hover:text-lg transition-colors duration-200 w-full text-left"
              >
                {chat.name}
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={() => setShowChatCreationMenu(true)}
              className="block px-4 py-2 text-base font-semibold hover:bg-accent hover:text-lg transition-colors duration-200 w-full text-left"
            >
              Create Private Chat
            </button>
          </li>
        </ul>
      </div>

      {/* Chat Creation Menu */}
      {showChatCreationMenu && (
        <ChatCreationMenu
          activeUsers={activeUsers}
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

export default PrivateChatSection;
