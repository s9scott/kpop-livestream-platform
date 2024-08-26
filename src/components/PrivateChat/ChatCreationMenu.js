import React, { useState, useEffect } from 'react';
import { fetchUsers } from '../../utils/firestoreUtils';

/**
 * 
 * @param 
 * What they are?
 * onCreateChat: Function to set the chat settings and create the chat
 * onClose: Function to close the chat creation menu
 * currentUser: Variable with current user info { uid: string, username: string, email: string }
 * @returns ChatCreationMenu
 *
 * This component is a modal that allows users to create a private chat.
 * It displays a form with input fields for the chat name and live URL.
 * It also displays a list of users that can be invited to the chat.
 * Users can be selected or removed from the list of invited users.
 * When the create button is clicked, the chat is created with the specified settings.
 */

const ChatCreationMenu = ({ onCreateChat, onClose, currentUser, showLoginAlert, setShowLoginAlert}) => {
  const [chatName, setChatName] = useState(''); // State variable for the chat name
  const [chatUrl, setChatUrl] = useState(''); // State variable for the live URL
  const [invitedUsers, setInvitedUsers] = useState([]); // State variable for the list of invited users
  const [users, setUsers] = useState([]); // State variable for the list of users

  // Fetch users from the database when the component mounts
  useEffect(() => {
    const loadUsers = async () => {
      const users = await fetchUsers();
      setUsers(users);
    };
    loadUsers();
  }, []);

  const handleUserSelect = (user) => {
    if (user.uid !== currentUser.uid) {
      setInvitedUsers((prev) => [...prev, user]);
    }
  };

  // Function to remove a user from the list of invited users
  const handleUserRemove = (user) => {
    setInvitedUsers((prev) => prev.filter((u) => u.uid !== user.uid));
  };


  // Function to create the chat with the specified settings
  const handleCreateChat = async () => {
    const chatSettings = {
      name: chatName,
      url: chatUrl,
      invitedUsers,
    };

    try {
      await onCreateChat(chatSettings);
      onClose(); // Close the menu after creating the chat
    } catch (error) {
      console.error('Failed to create chat:', error);
    }
  };

  return (
    <>
      {showLoginAlert && (
        <div className="active-users-modal fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="modal-content bg-primary rounded-lg shadow-lg p-4 w-full max-w-md dark:bg-gray-800">
            <span className="close text-red-500 hover:text-red-800 cursor-pointer float-right" onClick={() => { setShowLoginAlert(!showLoginAlert) }}>&times;</span>
            <h2 className="text-current text-2xl font-semibold m-4 text-center">You must Login to create Private Chats!</h2>
          </div>
        </div>
      )}

      { currentUser && (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-[1005]">
        <div className="bg-secondary p-6 rounded-lg text-black">
          <h2 className="text-lg font-bold mb-4">Create Private Chat</h2>
        
          <input
            type="text"
            placeholder="Chat Name"
            value={chatName}
            onChange={(e) => setChatName(e.target.value)}
            className="mb-4 p-2 border rounded w-full text-black"
          />
        
          <input
            type="text"
            placeholder="Live URL"
            value={chatUrl}
            onChange={(e) => setChatUrl(e.target.value)}
            className="mb-4 p-2 border rounded w-full"
          />
          <h3 className="font-semibold mb-2">Invite Users</h3>
          
          <div className="mb-4 max-h-40 overflow-y-auto">
            {users.map((user) => (
              <div key={user.uid} className="flex items-center justify-between">
                <span>{user.username}</span>
                {invitedUsers.some((u) => u.uid === user.uid) ? (
                  <button onClick={() => handleUserRemove(user)} className="text-red-500">Remove</button>
                ) : (
                  <button onClick={() => handleUserSelect(user)} className="text-blue-500">Invite</button>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-2">
            <button onClick={onClose} className="btn btn-neutral px-4 py-2 btn-sm">Cancel</button>
            <button onClick={handleCreateChat} className="btn btn-primary px-4 py-2 btn-sm">Create</button>
          </div>
        </div>
      </div>
    )}
  </>
  );
};

export default ChatCreationMenu;
