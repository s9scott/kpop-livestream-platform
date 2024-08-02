// UserInfoModal.js
import React from 'react';

const UserInfoModal = ({ selectedUser, setSelectedUser }) => {
  if (!selectedUser) return null;

  const closeModal = () => setSelectedUser(null);

  return (
    <div className="items-center justify-center bg-secondary rounded-xl mb-5">
      <div className="bg-secondary rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">User Info</h2>
        <p className="mb-2"><strong>Username:</strong> {selectedUser.username}</p>
        <p className="mb-2"><strong>Email:</strong> {selectedUser.email}</p>
        {/* Add other user details here */}
        <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg" onClick={closeModal}>Close</button>
      </div>
    </div>
  );
};

export default UserInfoModal;
