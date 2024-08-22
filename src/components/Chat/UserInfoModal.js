import React from 'react';

/**
 * UserInfoModal component displays user information in a modal.
 * @param {Object} props - Component properties.
 * @param {Object} props.selectedUser - The user object containing details to display.
 * @param {Function} props.setSelectedUser - Function to clear the selected user.
 * @returns {JSX.Element | null} The rendered modal or null if no user is selected.
 */
const UserInfoModal = ({ selectedUser, setSelectedUser }) => {
  if (!selectedUser) return null;

  /**
   * Closes the modal by clearing the selected user.
   */
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
