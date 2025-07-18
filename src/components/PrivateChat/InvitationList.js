/**
 * @file InvitationList.js
 * @author Paola Bustos
 * @created 2025-06-05
 * @lastModified 2025-06-11
 * @desc file containing InvitationList and functions handling invitations
 */

import React, { useState, useEffect } from 'react';
import { fetchPrivateChatName, fetchUser } from '../../utils/privateChatUtils';

/**
 * This component is a pane that displays the list of pending invitations for a user, allows user to accept/reject invitations. 
 * on accept/reject the invitattion dissapears from the pane
 * 
 * @param {Array} invitations - Array of invitation objects containing { id, chatId, invitedBy, invitedAt, status }
 * @param {Function} onAcceptInvite - Callback function called when user accepts an invitation (invitationId, chatId) => void
 * @param {Function} onRejectInvite - Callback function called when user rejects an invitation (invitationId, chatId) => void
 * 
 * @returns {JSX.Element} The rendered invitation list component with accept/reject functionality
 */

const InvitationList = ({invitations, onAcceptInvite, onRejectInvite}) => {

    // State to store detailed information about each invitation (chat names, creator details)
    const [invitationDetails, setInvitationDetails] = useState({}); 

    // Loading state to show spinner while fetching invitation details
    const [loading, setLoading] = useState(true);

    /**
     * Effect hook that fetches detailed information for all invitations
     * Runs whenever the invitations array changes
     */

    useEffect(() => {
        const fetchInvitationDetails = async () => {
            // If no invitations, stop loading and return early
            if (!invitations || invitations.length === 0) {
                setLoading(false);
                return;
            }

            const details = {};

            // Loop through each invitation to fetch its details
            for (const invitation of invitations) {
                try {
                    // Fetch the name of the chat this invitation is for
                    const chatName = await fetchPrivateChatName(invitation.chatId);
                    
                    // Fetch details about the user who sent the invitation
                    const creator = await fetchUser(invitation.invitedBy);
                    const creatorName = creator ? (creator.username || creator.displayName || 'Unknown User') : 'Unknown User';
                
                    // Store all the details for this invitation
                    details[invitation.id] = {
                        chatName: chatName || 'Unknown Chat',
                        creatorName,
                        creatorAvatar: creator?.photoURL || null
                    };
                } catch (error) {
                    // If fetching fails, provide fallback values
                    console.error(`Error fetching details for invitation ${invitation.id}:`, error);
                    details[invitation.id] = {
                        chatName: 'Unknown Chat',
                        creatorName: 'Unknown User',
                        creatorAvatar: null
                    };
                }
            }

            // Update state with all fetched details and stop loading
            setInvitationDetails(details);
            setLoading(false);
        };
        
        fetchInvitationDetails();
    }, [invitations]); // Re-run when invitations array changes

    // Show loading spinner while fetching invitation details
    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-sm text-gray-400">Loading invitations...</div>
            </div>
        );
    }

    // Show empty state when user has no pending invitations
    if (!invitations || invitations.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <div className="text-4xl mb-2">📬</div>
                <div className="text-sm text-gray-400 mb-1">No pending invitations</div>
                <div className="text-xs text-gray-500">You're all caught up!</div>
            </div>
        );
    }

    // Render the list of invitations
    return (
        <div className="w-full h-full overflow-y-auto px-10 py-4">
            {invitations.map((invitation) => {
                const details = invitationDetails[invitation.id] || {};
                // Get the detailed information for this specific invitation
                return (
                    <div key={invitation.id} className="flex items-start space-x-4 p-2 rounded-lg">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                            {details.creatorAvatar ? (
                                // If they have an avatar, show it
                                <img
                                    src={details.creatorAvatar}
                                    alt={details.creatorName}
                                    className="w-10 h-10 rounded-full bg-white border-2 border-white"
                                />
                            ) : (
                                // If no avatar, show a circle with the first letter of their name
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                                    <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white font-bold text-lg">
                                        {details.creatorName ? details.creatorName.charAt(0).toUpperCase() : '?'}
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        {/* Message content */}
                        <div className="flex-1 min-w-0">
                            {/* Invitation message text */}
                            <div className="text-white text-sm font-light leading-relaxed mb-1">
                                <span className="font-normal">{details.creatorName}</span>
                                <span> invited you to join </span>
                                <span className="font-medium">"{details.chatName}"</span>
                            </div>

                            {/* Show invitation date if available */}
                            {invitation.invitedAt && (
                                <div className="text-gray-400 text-xs mb-1">
                                    {new Date(invitation.invitedAt).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                            )}

                            {/* Buttons accept/decline*/}
                            <div className="flex space-x-4">
                                <button
                                    onClick={() => onAcceptInvite(invitation.id, invitation.chatId)}
                                    className="text-white text-sm font-light hover:bg-white hover:text-black px-3 py-1 rounded transition-colors duration-200"
                                >
                                    accept
                                </button>
                                <button
                                    onClick={() => onRejectInvite(invitation.id, invitation.chatId)}
                                    className="text-white text-sm font-light hover:bg-white hover:text-black px-3 py-1 rounded transition-colors duration-200"
                                >
                                    decline
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default InvitationList;