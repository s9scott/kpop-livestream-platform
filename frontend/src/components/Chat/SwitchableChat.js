/**
 * @file SwitchableChat.js
 * @author Simon Tenedero, Jonas Matulis
 * @created 2024-XX-XX
 * @lastModified 2025-06-04
 * @desc file containing SwitchableChat
 */

import React, { useState, useEffect } from 'react';
import NativeChat from './NativeChat';
import PrivateChat from '../PrivateChat/PrivateChat';
import PrivateChatSection from '../PrivateChat/PrivateChatSection';
import {fetchPrivateChatVideoUrl, fetchPrivateChatMembers, addUserToPrivateChat} from '../../utils/privateChatUtils';
import useActiveUsers from '../../hooks/useActiveUsers';
import LiveChatContainer from './LiveChatContainer';
import ChatTabs from './ChatTabs'
import {  ArrowLeftStartOnRectangleIcon,ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/outline';


/**
 * SwitchableChat component for handling and displaying different chat types (Youtube, Native, PrivateTabs, PrivateChat)
 * 
 * @param {Object} user - Current user.
 * @param {string} videoId - Current YouTube video ID.
 * @param {Function} setVideoId - Function to set video ID.
 * @param {Function} handleTabClose - Function to handle closing of private chat tabs.
 * @param {Array} privateChats - array of all privateChats
 * @param {Function} setPrivateChars - setState function to set privateChats
 * @param {Array} invitations - list of invitation objects
 * @param {string} selectedPrivateChat - current selected private chat
 * @param {Function} setSelectedPrivateChat - Function to set the selectedPrivateChat
 * @param {Boolean} chatOpen - StateVariable tracking if chat is open or not
 * @param {Function} setChatOpen - setState function to modify chatOpen
 * 
 * @returns {JSX.Element} The rendered component.
 */
const SwitchableChat = ({
  user, 
  videoId, 
  setVideoId, 
  handleTabClose, 
  privateChats,
  setPrivateChats,
  invitations,
  selectedPrivateChat,
  setSelectedPrivateChat,
  chatOpen,
  setChatOpen}) => {

  const [selectedTab, setSelectedTab] = useState('youtubeTab'); // Default tab (youtubeTab, nativeTab, privateTab)
  const [privateChatVideoId, setPrivateChatVideoId] = useState('');
  const [useNativeChat, setUseNativeChat] = useState(false);
  const [isActiveUsersModalOpen, setIsActiveUsersModalOpen] = useState(false);
  const [isPrivateChatUsersModalOpen, setIsPrivateChatUsersModalOpen] = useState(false);
  const { activeUsers, fetchActiveUsers } = useActiveUsers(videoId);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [privateChatMembers, setPrivateChatMembers] = useState([]);

  const [selectedPrivateTab,setSelectedPrivateTab] = useState('messagesTab') // for privateTab panel (messageTab, invitationsTab)
  

  const embedDomain = window.location.hostname === 'localhost' ? 'localhost' : 's9scott.github.io';
  const chatSrc = `https://www.youtube.com/live_chat?v=${videoId}&embed_domain=${embedDomain}`;

  useEffect(() => {
    const fetchAndSetVideoId = async () => {
      if (selectedTab === 'nativeTab') {
        toggleChat();
      }
      if (selectedTab !== 'youtubeTab' && selectedTab !== 'nativeTab') {
        toggleChat();
        try {
          const url = await fetchPrivateChatVideoUrl(selectedTab);
          console.log('Fetched video URL:', url);
          const newVideoId = extractVideoId(url);
          setPrivateChatVideoId(newVideoId);
          console.log('Fetched video ID:', newVideoId, 'privateChatVideoId:', privateChatVideoId);

        } catch (error) {
          console.error('Error fetching video ID:', error);
        }
      }
    };

    fetchAndSetVideoId();

    console.log('Selected Tab:', selectedTab);
    console.log('Current Video ID:', videoId);
    console.log('Private Chat Video ID:', privateChatVideoId);
  }, [selectedTab, videoId, privateChatVideoId]);

  /**
   * Toggles between native chat and login alert based on user authentication status.
   */
  const toggleChat = () => {
    const lastUserData = localStorage.getItem("lastUser");
    if (lastUserData) {
      setUseNativeChat((prev) => !prev);
    } else {
      setShowLoginAlert(true);
    }
  };

  /**
   * Toggles the modal displaying active users.
   */
  const toggleActiveUsersModal = () => {
    fetchActiveUsers();
    setIsActiveUsersModalOpen((prev) => !prev);
  };

  /**
   * Toggles the modal displaying private chat members.
   */
  const togglePrivateUsersModal = async () => {
    try {
      const members = await fetchPrivateChatMembers(selectedPrivateChat);
      setPrivateChatMembers(members || []);
    } catch (error) {
      console.error('Error fetching private chat members:', error);
      setPrivateChatMembers([]);
    }
    setIsPrivateChatUsersModalOpen((prev) => !prev);
  };

  /**
   * Extracts video ID from a given URL.
   * 
   * @param {string} url - The URL to extract the video ID from.
   * @returns {string|null} The extracted video ID or null if not found.
   */
  const extractVideoId = (url) => {
    console.log('Extracting video ID from:', url);
    try {
      if (!url) {
        console.error('URL is empty or null');
        return null;
      }

      const parsedUrl = new URL(url);
      const urlParams = new URLSearchParams(parsedUrl.search);
      const videoId = urlParams.get('v');

      if (videoId) {
        return videoId;
      }

      // Handle URLs like https://youtu.be/VIDEO_ID
      const pathname = parsedUrl.pathname;
      if (pathname.startsWith('/')) {
        const potentialId = pathname.split('/')[1];
        if (potentialId) {
          return potentialId;
        }
      }

      console.error('No video ID found in URL');
      return null;
    } catch (error) {
      return null;
    }
  };

  /**
   * Updates the video ID based on the selected tab.
   * 
   * @param {string} tabId - The ID of the selected tab.
   */
  const updateVideoId = async (tabId) => {
    if (tabId === 'youtubeTab' || tabId === 'nativeTab') {
      console.log(`Switching to ${tabId} tab.`);
    } else {
      try {
        const url = await fetchPrivateChatVideoUrl(tabId);
        if (url) {
          const newVideoId = extractVideoId(url);
          if (newVideoId) {
            setVideoId(newVideoId);
            console.log('Video ID updated to:', newVideoId);
          } else {
            console.error('Extracted video ID is invalid.');
          }
        } else {
          console.log('Video URL is not available');
        }
      } catch (error) {
        console.error('Error updating video ID:', error);
      }
    }
  };

  /**
   * Invites a user to the private chat.
   * 
   * @param {string} inviteeUid - The UID of the user to invite.
   */
  const inviteToChat = async (inviteeUid) => {
    try {
      const chatId = selectedTab; // Assuming the selectedTab is the chat ID
      await addUserToPrivateChat(chatId, inviteeUid); // Function to add a user to the chat
      alert('User invited successfully');
    } catch (error) {
      console.error('Error inviting user:', error);
      alert('Failed to invite user');
    }
  };

  const mainTabs = [
    { id: 'youtubeTab', name: 'youtube' },
    { id: 'nativeTab', name: 'native' },
    { id: 'privateTab', name: 'private'}
  ];

  const privateTabs = [
    { id: 'messagesTab', name: 'messages' },
    { id: 'invitationsTab', name: 'invitations' },
  ];

  return (

    
    <div className="flex">
      <div className={`md:mr-2 ${chatOpen?'':''}`}>
        <button button className={`portrait:hidden`} onClick={()=>setChatOpen(!chatOpen)}>{chatOpen?(<ArrowRightStartOnRectangleIcon className="h-7 w-7 text-white" />):(<ArrowLeftStartOnRectangleIcon className="h-7 w-7 text-white" />)}</button>
      </div>
      
      <div className={`

        desktop:w-[20vw] desktop:h-[70vh]
        xl:w-chat-iPadPro-landscape xl:h-chat-iPadPro-landscape 
        lg:w-chat-tablet-landscape lg:h-chat-tablet-landscape 
        ipadpro-portrait:min-w-[50vw] ipadpro-portrait:max-h-[60vh]
        md:w-chat-tablet-portrait md:h-chat-tablet-portrait
        iphone-landscape:min-h-[575px] iphone-landscape:max-w-[350px]
        sm:w-chat-mobile-landscape sm:h-chat-mobile-landscape 
        w-chat-mobile-portrait h-chat-mobile-portrait
        ${chatOpen?'':"landscape:hidden"}`}
      >
        <ChatTabs
          chatOpen={chatOpen}
          tabs={mainTabs}
          selectedTab={selectedTab}
          onSelectTab={setSelectedTab}
        />
        <div className="chat-content flex-grow mt-6 h-[90%] md:h-[80%]">

          {selectedTab === 'youtubeTab' ? (

            <div>
              <LiveChatContainer chatSrc={chatSrc} />
            </div>
          
          ) : selectedTab === 'nativeTab' ? (

            <div className="w-full h-full">
              <NativeChat
                videoId={videoId}
                user={user}
                activeUsers={activeUsers}
                toggleActiveUsersModal={toggleActiveUsersModal}
              />
            </div>
            
          ) : selectedTab === 'privateTab' ? (

            <div className="w-full h-full bg-neutral rounded-xl">

              {/*under private tab we could see all the chats or be in one specific chat*/}
              {selectedPrivateChat===null?(
                <>
                <PrivateChatSection
                  user = {user}
                  privateChats={privateChats}
                  setPrivateChats = {setPrivateChats}
                  onSelectChat={setSelectedPrivateChat}
                  onCloseChat={handleTabClose}
                  privateTabs={privateTabs}
                  selectedPrivateTab={selectedPrivateTab}
                  setSelectedPrivateTab={setSelectedPrivateTab}
                  invitations={invitations}
                  setNotification={()=>{}}
                />
                </>
              ):(<PrivateChat
                privateChatId={selectedPrivateChat}
                videoId={videoId}
                updateVideoId={updateVideoId}
                user={user}
                togglePrivateUsersModal={togglePrivateUsersModal}
                privateChatMembers={privateChatMembers}
                setPrivateChatMembers={setPrivateChatMembers}
                setSelectedTab={setSelectedTab}
                setSelectedPrivateChat={setSelectedPrivateChat}
              />)}

            </div>

          ) : (<>invalid page</>)}


        </div>
    
        {showLoginAlert && (
          <div className="active-users-modal fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
            <div className="modal-content bg-primary rounded-lg shadow-lg p-4 w-full max-w-lg dark:bg-gray-800">
              <span className="close text-red-500 hover:text-red-800 cursor-pointer float-right" onClick={() => { setShowLoginAlert(false) }}>&times;</span>
              <h2 className="text-current text-2xl font-semibold m-4 text-center">You must Login to chat in the Native or Private Chats!</h2>
            </div>
          </div>
        )}
        
        {isActiveUsersModalOpen && (
          <div className="active-users-modal fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
            <div className="modal-content w-[90%] bg-primary rounded-lg shadow-lg p-4 w-full max-w-lg">
              <span className="close text-red-500 hover:text-red-800 cursor-pointer float-right font-bold text-white" onClick={toggleActiveUsersModal}>&times;</span>
              <h2 className="text-current text-xl font-semibold mb-4">Active Users</h2>
              <span>{activeUsers.length > 0 && activeUsers.length != 1 ? activeUsers.length+" users active" : activeUsers.length+" user active"}</span>
              <ul className="max-h-64 overflow-y-auto">
                {activeUsers.length > 0 ? (
                  activeUsers.map((activeUser, index) => (
                    <li key={index} className="flex items-center mb-2">
                      <img
                        src={activeUser.photoURL || activeUser.profilePicture}
                        alt="Profile"
                        className="profile-pic w-12 h-12 rounded-full mr-2"
                      />
                      <span className="text-current font-semibold">{activeUser.displayName || activeUser.username}</span>
                      {activeUser.uid !== user.uid && !privateChats.includes(activeUser.uid) && (
                        <button
                          className="ml-auto btn btn-sm btn-primary"
                          onClick={() => inviteToChat(activeUser.uid)}
                        >
                          Invite
                        </button>
                      )}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-700 dark:text-gray-200">No active users</li>
                )}
              </ul>
            </div>
          </div>
        )}
        
        {isPrivateChatUsersModalOpen && (
          <div className="active-users-modal fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
            <div className="modal-content bg-primary w-[90%] rounded-lg shadow-lg p-4 w-full max-w-lg dark:bg-secondary">
              <span className="close text-red-500 hover:text-red-800 cursor-pointer float-right" onClick={togglePrivateUsersModal}>&times;</span>
              <h2 className="text-current text-xl font-semibold mb-4">Private Chat Members</h2>
              <ul className="max-h-64 overflow-y-auto">
                {privateChatMembers.length > 0 ? (
                  privateChatMembers.map((activeUser, index) => (
                    <li key={index} className="flex items-center mb-2">
                      <img
                        src={activeUser.photoURL || activeUser.profilePicture}
                        alt="Profile"
                        className="profile-pic w-12 h-12 rounded-full mr-2"
                      />
                      <span className="text-current font-semibold">{activeUser.displayName || activeUser.username}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-700 dark:text-gray-200">No active users</li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  ); 
};

export default SwitchableChat;
