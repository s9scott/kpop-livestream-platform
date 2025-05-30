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

/**
 * This component displays a list of the users' privateChats - it is the pane displayed when private chat is selected from the main tabs
 * Each tab has an image for the chat, the title, and a recently sent message (deciding if we will include the name of the livestreams)
 * 
 * @param {object} chats - array containing chat objects (have fields such as id, title, etc.)
 * @param {Function} onSelectChat - function that handles opening the chat when clicking the corresponding tab
 * @param {Function} onCloseChat - (NOTE: STILL NEED TO IMPLEMENT) function that handles leaving chats 
 * @param {Array} privateTabs - list of private tab objects (messages,invitations)
 * @param {Object} selectedPrivateTab - state variable for currenlty selected tab
 * @param {Function} setSelectedPrivateChat - function for setting the selectedPrivateTab
 * 
 * @returns {JSX.Element} PrivateChatSection
 */
const PrivateChatSection = ({ 
  user,
  privateChats, 
  setPrivateChats,
  onSelectChat, 
  onCloseChat, 
  privateTabs, 
  selectedPrivateTab, 
  setSelectedPrivateTab,
  invitations,
  setNotification}) => {

  return (
    
    <div className="h-full">
    <PrivateChatTabs privateTabs={privateTabs} selectedPrivateTab={selectedPrivateTab} onSelectPrivateTab={setSelectedPrivateTab} />

    <div className="flex-col w-full h-5/6 p-2 overflow-scroll">

      {selectedPrivateTab==='messagesTab'?
      (<PrivateChatList chats={privateChats} onSelectChat={onSelectChat} onCloseChat={onCloseChat}/>)      
      :(<InvitationList/>)}

    </div>

    <CreatePrivateChatButton user={user} privateChats={privateChats} setPrivateChats={setPrivateChats} invitations={invitations} setNotification={setNotification}/>
    </div>
    
    
  );
};

export default PrivateChatSection;
