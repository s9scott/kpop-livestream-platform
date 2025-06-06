import React, { useState, useEffect } from 'react';
import { fetchPrivateChatName, fetchUser } from '../../utils/privateChatUtils';

const InvitationList = ({
    invitations,
    onAcceptInvite,
    onRejectInvite, 
    user
}) => {
    const [invitationDetails, setInvitationDetails] = useState({}); // Store chat names and creator names 
    const [loading, setLoading] = useState(true);

    // Fetch details for all invitations
    useEffect(() => {
        const fetchInvitationDetails = async () => {
            if (!invitations || invitations.length === 0) {
                setLoading(false);
                return;
            }

            const details = {};

            for (const invitation of invitations) {
                try {
                    // Fetch chat name
                    const chatName = await fetchPrivateChatName(invitation.chatId);
                    
                    // Fetch creator details
                    const creator = await fetchUser(invitation.invitedBy);
                    const creatorName = creator ? (creator.username || creator.displayName || 'Unknown User') : 'Unknown User';
                
                    details[invitation.id] = {
                        chatName: chatName || 'Unknown Chat',
                        creatorName,
                        creatorAvatar: creator?.photoURL || null
                    };
                } catch (error) {
                    console.error(`Error fetching details for invitation ${invitation.id}:`, error);
                    details[invitation.id] = {
                        chatName: 'Unknown Chat',
                        creatorName: 'Unknown User',
                        creatorAvatar: null
                    };
                }
            }
            setInvitationDetails(details);
            setLoading(false);
        };
        
        fetchInvitationDetails();
    }, [invitations]); 

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-sm text-gray-400">Loading invitations...</div>
            </div>
        );
    }

    if (!invitations || invitations.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <div className="text-4xl mb-2">📬</div>
                <div className="text-sm text-gray-400 mb-1">No pending invitations</div>
                <div className="text-xs text-gray-500">You're all caught up!</div>
            </div>
        );
    }

    return (
        <div className="w-full h-full overflow-y-auto px-4 py-4 space-y-8">
            {invitations.map((invitation) => {
                const details = invitationDetails[invitation.id] || {};
                
                return (
                    <div key={invitation.id} className="flex items-center space-x-4">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                            {details.creatorAvatar ? (
                                <img
                                    src={details.creatorAvatar}
                                    alt={details.creatorName}
                                    className="w-10 h-10 rounded-full bg-white border-2 border-white"
                                />
                            ) : (
                                <div className="w-10 h-100 rounded-full bg-white flex items-center justify-center">
                                    <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white font-bold text-lg">
                                        {details.creatorName ? details.creatorName.charAt(0).toUpperCase() : '?'}
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        {/* Message content */}
                        <div className="flex-1 min-w-0 h-10">
                            <div className="text-white text-sm font-light leading-relaxed mb-2">
                                <span className="font-normal">{details.creatorName}</span>
                                <span> invited you to join </span>
                                <span className="font-medium">"{details.chatName}"</span>
                            </div>
                            
                            {/* Buttons accept/decline*/}
                            <div className="flex space-x-6">
                                <button
                                    onClick={() => onAcceptInvite(invitation.id, invitation.chatId)}
                                    className="text-white text-sm font-light hover:bg-white hover:text-black px-2 py-1 rounded transition-colors duration-200"
                                >
                                    accept
                                </button>
                                <button
                                    onClick={() => onRejectInvite(invitation.id)}
                                    className="text-white text-sm font-light hover:bg-white hover:text-black px-2 py-1 rounded transition-colors duration-200"
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