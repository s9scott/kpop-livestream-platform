import React from 'react';

const InvitationPopup = ({ invitation, onAccept, onReject }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
      <div className="bg-secondary p-6 rounded-lg">
        <h2 className="text-lg font-bold mb-4">Chat Invitation</h2>
        <p className="text-base-primary">You have been invited to join a private chat by {invitation.invitedBy}</p>
        <div className="flex justify-end space-x-2 mt-4">
          <button onClick={onReject} className="btn-neutral px-4 py-2 rounded">Reject</button>
          <button onClick={onAccept} className="btn-primary px-4 py-2 text-white rounded">Accept</button>
        </div>
      </div>
    </div>
  );
};

export default InvitationPopup;
