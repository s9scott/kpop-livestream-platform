import React, { useState, useEffect } from 'react';
import { fetchUsers } from '../../utils/firestoreUtils';

const ChatCreationMenu = ({onCreateChat, onClose, currentUser }) => {
  const [chatName, setChatName] = useState('');
  const [chatUrl, setChatUrl] = useState('');
  const [invitedUsers, setInvitedUsers] = useState([]);
  const [users, setUsers] = useState([]);

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

  const handleUserRemove = (user) => {
    setInvitedUsers((prev) => prev.filter((u) => u.uid !== user.uid));
  };

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
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-[1005]">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-lg font-bold mb-4">Create Private Chat</h2>
        <input
          type="text"
          placeholder="Chat Name"
          value={chatName}
          onChange={(e) => setChatName(e.target.value)}
          className="mb-4 p-2 border rounded w-full"
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
          <button onClick={onClose} className="btn-neutral px-4 py-2 rounded">Cancel</button>
          <button onClick={handleCreateChat} className="btn-primary px-4 py-2 text-white rounded">Create</button>
        </div>
      </div>
    </div>
  );
};

export default ChatCreationMenu;
