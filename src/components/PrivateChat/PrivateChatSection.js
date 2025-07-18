/**
 * @file PrivateChatSection.js
 * @author Simon Tenedero
 * @created 2025-05-26
 * @lastModified 2025-05-28
 * @desc file containing PrivateChatSection component
 */

import PrivateChatTabs from './PrivateChatTabs';
import PrivateChatList from './PrivateChatList';
import InvitationList from './InvitationList';
import CreatePrivateChatButton from './CreatePrivateChatButton';
import { fetchChats, handleAcceptInvitation, handleRejectInvitation } from '../../utils/privateChatUtils';
import { useUser } from '../../context/UserContext';

/**
 * This component manages the panes related to privateChat (excluding the actual chat itself) - includes the list of chats the user is a member of, as well as pending invitations
 * @param {Array} privateChats - array containing all of users private chats they are a member of (may be owner or just normal member)
 * @param {Function} setPrivateChats - setState Function to modify privateChats
 * @param {Function} onSelectChat - function that handles opening the chat when clicking the corresponding tab 
 * @param {Array} privateTabs - list of private tab objects (messages,invitations)
 * @param {Object} selectedPrivateTab - state variable for currenlty selected tab
 * @param {Function} setSelectedPrivateTab - function for setting the selectedPrivateTab
 * @param {Array} invitations - array containing invitation objects
 * @param {Function} setInvitations - setState function to mofidy invitations list
 * @param {Function} setNotification - setState function to modify notification content
 * 
 * @returns {JSX.Element} PrivateChatSection
 */
const PrivateChatSection = ({ 
  privateChats, 
  setPrivateChats,
  onSelectChat,  
  privateTabs, 
  selectedPrivateTab, 
  setSelectedPrivateTab,
  invitations,
  setInvitations,
  setNotification
  }) => {

  const {user} = useUser();

  /**
  * Handles accepting a chat invitation and updates the UI
  */
  const handleAcceptInvite = async (invitationId, chatId) => {
    try {
      console.log("Accepting invitation:", { invitationId, chatId });
      
      await handleAcceptInvitation(invitationId, chatId, user, setPrivateChats);
      
      // Remove the accepted invitation from the list
      setInvitations(prev => prev.filter(inv => inv.id !== invitationId));
      
      // Show success notification
      setNotification('Invitation accepted! Welcome to the chat.');
      setTimeout(() => setNotification(''), 3000);

      fetchChats(user,setPrivateChats);

    } catch (error) {
      console.error('Error accepting invitation:', error);
      setNotification('Failed to accept invitation. Please try again.');
      setTimeout(() => setNotification(''), 3000);
    }
  };

  /**
   * Handles rejecting a chat invitation and updates the UI
   */
  const handleRejectInvite = async (invitationId, chatId) => {
    try {
      console.log("Rejecting invitation:", { invitationId });
      
      await handleRejectInvitation(invitationId, chatId, user);
      
      // Remove the rejected invitation from the list
      setInvitations(prev => prev.filter(inv => inv.id !== invitationId));
      
      // Show notification
      setNotification('Invitation declined.');
      setTimeout(() => setNotification(''), 3000);
      
    } catch (error) {
      console.error('Error rejecting invitation:', error);
      setNotification('Failed to decline invitation. Please try again.');
      setTimeout(() => setNotification(''), 3000);
    }
  };

  return (
    
    <div className="h-full flex flex-col">
      
      {/* Tabs for Messages and Invitations */}
      <PrivateChatTabs 
        privateTabs={privateTabs} 
        selectedPrivateTab={selectedPrivateTab} 
        onSelectPrivateTab={setSelectedPrivateTab} 
        invitations={invitations}
      />

      {/* Content Area - switches between Messages and Invitations */}
      <div className="flex-1 w-full overflow-hidden">
        
        {selectedPrivateTab === 'messagesTab' ? (
          /* Messages Tab Content */
          <div className="h-full overflow-y-auto p-2">
            <PrivateChatList 
              chats={privateChats} 
              setPrivateChats={setPrivateChats}
              onSelectChat={onSelectChat} 
            />
          </div>
        ) : (
          /* Invitations Tab Content */
          <div className="h-full">
            <InvitationList 
              invitations={invitations}
              onAcceptInvite={handleAcceptInvite}
              onRejectInvite={handleRejectInvite}
            />
          </div>
        )}
        
      </div>

    
    {/* Create Chat Button - always at bottom */}
      <div className="flex-shrink-0 border-t bg-neutral">
        <CreatePrivateChatButton 
          privateChats={privateChats} 
          setPrivateChats={setPrivateChats} 
          invitations={invitations} 
          setNotification={setNotification}
        />
      </div>
      
    </div>
    
  );
};

export default PrivateChatSection;
