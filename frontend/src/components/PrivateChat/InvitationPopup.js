import React, { useEffect, useState } from 'react';
import { fetchPrivateChatName, fetchUser } from '../../utils/privateChatUtils';

/**
 * @param invitation, onAccept, onReject
 * What they are?
 * invitation: Object with the chat invitation details { chatId: string, invitedBy: string }
 * onAccept: Function to accept the chat invitation
 * onReject: Function to reject the chat invitation
 * @returns InvitationPopup
 * 
 * What is it?
 * This component displays a popup with the details of a chat invitation.
 * It shows the name of the chat and the user who sent the invitation.
 * Users can accept or reject the invitation by clicking the corresponding buttons.
 * 
*/

const InvitationPopup = ({ invitation, onAccept, onReject }) => {
  const [chatName, setChatName] = useState(''); // State variable for the chat name
  const [creatorName, setCreatorName] = useState(''); // State variable for the creator's name

  // Fetch chat details and creator's name when the component mounts
  useEffect(() => {
    const fetchChatDetails = async () => {
      const chatName = await fetchPrivateChatName(invitation.chatId);
      setChatName(chatName);

      const creator = await fetchUser(invitation.invitedBy);
      if (creator) {
        setCreatorName(creator.username || creator.displayName);
      }
    };

    fetchChatDetails();
  }, [invitation.chatId, invitation.invitedBy]);

  // Display the chat invitation popup
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
      <div className="bg-secondary p-6 rounded-lg">
        <h2 className="text-lg font-bold mb-4">Chat Invitation</h2>
        <p className="text-base-primary">
          You have been invited to join the private chat <strong>{chatName}</strong> by <strong>{creatorName}</strong>.
        </p>
        <div className="flex justify-end space-x-2 mt-4">
          <button onClick={onReject} className="btn-neutral px-4 py-2 rounded">Reject</button>
          <button onClick={onAccept} className="btn-primary px-4 py-2 text-white rounded">Accept</button>
        </div>
      </div>
    </div>
  );
};

export default InvitationPopup;
