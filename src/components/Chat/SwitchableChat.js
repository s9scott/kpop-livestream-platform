/**
 * @file SwitchableChat.js
 * @author Simon Tenedero, Jonas Matulis
 * @created 2024-XX-XX
 * @lastModified 2025-06-04
 * @desc file containing SwitchableChat
 */

import React from "react";
import { useState, useEffect } from 'react';
import PrivateChat from '../PrivateChat/PrivateChat';
import PrivateChatSection from '../PrivateChat/PrivateChatSection';
import {fetchPrivateChatVideoUrl, fetchPrivateChatMembers, fetchPendingMembers} from '../../utils/privateChatUtils';
import LiveChatContainer from './LiveChatContainer';
import ChatTabs from './ChatTabs'
import {  ArrowLeftStartOnRectangleIcon, ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/outline';
import { useUser } from '../../context/UserContext';


/**
 * SwitchableChat component for handling and displaying different chat types (Youtube, Native, PrivateTabs, PrivateChat)
 * 
 * @param {string} videoId - Current YouTube video ID.
 * @param {Function} setVideoId - Function to set video ID.
 * @param {Array} privateChats - array of all privateChats
 * @param {Function} setPrivateChats - setState function to set privateChats
 * @param {Array} invitations - list of invitation objects
 * @param {string} selectedPrivateChat - current selected private chat
 * @param {Function} setSelectedPrivateChat - Function to set the selectedPrivateChat
 * @param {Boolean} chatOpen - StateVariable tracking if chat is open or not
 * @param {Function} setChatOpen - setState function to modify chatOpen
 * 
 * @returns {JSX.Element} The rendered component.
 */
const SwitchableChat = ({
  videoId, 
  setVideoId, 
  privateChats,
  setPrivateChats,
  invitations,
  setInvitations,
  selectedPrivateChat,
  setSelectedPrivateChat,
  chatOpen,
  setChatOpen}) => {

  const [selectedTab, setSelectedTab] = useState('youtubeTab'); // Default tab (youtubeTab, nativeTab, privateTab)
  const [privateChatVideoId, setPrivateChatVideoId] = useState('');
  const [isPrivateChatUsersModalOpen, setIsPrivateChatUsersModalOpen] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [privateChatMembers, setPrivateChatMembers] = useState([]);
  const [pendingChatMembers, setPendingChatMembers] = useState([]);
  const [selectedPrivateTab,setSelectedPrivateTab] = useState('messagesTab') // for privateTab panel (messageTab, invitationsTab)

  const {user} = useUser();
  
  const embedDomain = window.location.hostname === 'localhost' ? 'localhost' : 's9scott.github.io';
  const chatSrc = `https://www.youtube.com/live_chat?v=${videoId}&embed_domain=${embedDomain}`;

  useEffect(() => {
    const fetchAndSetVideoId = async () => {
      if (selectedTab === 'privateTab') {
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
   * Toggles the modal displaying private chat members.
   */
  const togglePrivateUsersModal = async () => {
    try {
      const members = await fetchPrivateChatMembers(selectedPrivateChat);
      console.log("members=", members);
      setPrivateChatMembers(members || []);

      const pendingMembers = await fetchPendingMembers(selectedPrivateChat);
      console.log("pending=", pendingMembers);
      setPendingChatMembers(pendingMembers || []);
    } catch (error) {
      console.error("Error fetching private chat members:", error);
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

  const mainTabs = [
    { id: 'youtubeTab', name: 'youtube chat' },
    { id: 'privateTab', name: 'private chat'}
  ];

  const privateTabs = [
    { id: 'messagesTab', name: 'private chats' },
    { id: 'invitationsTab', name: 'invitations' },
  ];

  return (

    
    <div className="flex">
      <div className={`md:mr-2`}>
        <button button className={`portrait:hidden`} onClick={()=>setChatOpen(!chatOpen)}>{chatOpen?(<ArrowRightStartOnRectangleIcon className="h-7 w-7 text-white" />):(<ArrowLeftStartOnRectangleIcon className="h-7 w-7 text-white" />)}</button>
      </div>

      {/*

        desktop:w-[25vw] desktop:h-[85vh]
        xl:w-chat-iPadPro-landscape xl:h-chat-iPadPro-landscape 
        lg:w-chat-tablet-landscape lg:h-chat-tablet-landscape 
        ipadpro-portrait:min-w-[50vw] ipadpro-portrait:max-h-[60vh]
        ipadmini-portrait:w-chat-tablet-portrait ipadmini-portrait:h-chat-tablet-portrait
        iphone-landscape:min-h-[575px] iphone-landscape:max-w-[350px]
        sm:w-chat-mobile-landscape sm:h-chat-mobile-landscape 
        w-chat-mobile-portrait h-chat-mobile-portrait

      */}
      
      <div className={`${!chatOpen && 'landscape:hidden'} 
        desktop:w-[25vw] desktop:h-[85vh]
        xl:w-chat-iPadPro-landscape xl:h-chat-iPadPro-landscape 
        lg:w-chat-tablet-landscape lg:h-chat-tablet-landscape 
        ipadpro-portrait:min-w-[50vw] ipadpro-portrait:max-h-[60vh]
        ipadmini-portrait:w-chat-tablet-portrait ipadmini-portrait:h-chat-tablet-portrait
        iphone-landscape:min-h-[575px] iphone-landscape:max-w-[350px]
        sm:w-chat-mobile-landscape sm:h-chat-mobile-landscape 
        w-chat-mobile-portrait h-chat-mobile-portrait`}>
        
        <ChatTabs
          chatOpen={chatOpen}
          tabs={mainTabs}
          selectedTab={selectedTab}
          onSelectTab={setSelectedTab}
        />
        <div className="chat-content flex-grow h-[90%]">

          {selectedTab === 'youtubeTab' ? (

            <LiveChatContainer chatSrc={chatSrc} />
          
          ) : 
          selectedTab === 'privateTab' ? (

            <div className="w-full h-full bg-black rounded-xl">

              {/*under private tab we could see all the chats or be in one specific chat*/}
              {selectedPrivateChat===null?(
                <>
                <PrivateChatSection
                  privateChats={privateChats}
                  setPrivateChats = {setPrivateChats}
                  onSelectChat={setSelectedPrivateChat}
                  privateTabs={privateTabs}
                  selectedPrivateTab={selectedPrivateTab}
                  setSelectedPrivateTab={setSelectedPrivateTab}
                  invitations={invitations}
                  setInvitations={setInvitations}
                  setNotification={()=>{}}
                />
                </>
              ):(
                
              <PrivateChat
                privateChatId={selectedPrivateChat}
                videoId={videoId}
                updateVideoId={updateVideoId}
                togglePrivateUsersModal={togglePrivateUsersModal}
                privateChatMembers={privateChatMembers}
                setPrivateChatMembers={setPrivateChatMembers}
                setSelectedTab={setSelectedTab}
                setSelectedPrivateChat={setSelectedPrivateChat}
              />
              ) 
              }

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
        
        {isPrivateChatUsersModalOpen && (
          <div className="active-users-modal fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
            <div className="modal-content bg-primary w-[90%] rounded-lg shadow-lg p-4 w-full max-w-lg dark:bg-secondary">
              <span
                className="close text-red-500 hover:text-red-800 cursor-pointer float-right"
                onClick={togglePrivateUsersModal}
              >
                &times;
              </span>
              <h2 className="text-current text-xl font-semibold mb-4">
                Private Chat Members
              </h2>
              <ul className="max-h-64 overflow-y-auto">
                {/*combining private chat members and pending chat members into one array*/}
                {privateChatMembers.length > 0 ||
                pendingChatMembers.length > 0 ? (
                  [
                    ...privateChatMembers.map((privateUser, index) => (
                      <li
                        key={`private-${index}`}
                        className="flex items-center mb-2"
                      >
                        <img
                          src={
                            privateUser.photoURL || privateUser.profilePicture
                          }
                          alt="Profile"
                          className="profile-pic w-12 h-12 rounded-full mr-2"
                        />
                        <p className="text-current font-semibold">
                          {privateUser.displayName || privateUser.username}
                        </p>
                      </li>
                    )),
                    ...pendingChatMembers.map((privateUser, index) => (
                      <li
                        key={`pending-${index}`}
                        className="flex items-center mb-2"
                      >
                        <img
                          src={
                            privateUser.photoURL || privateUser.profilePicture
                          }
                          alt="Profile"
                          className="profile-pic w-12 h-12 rounded-full mr-2"
                        />
                        <p className="text-current font-semibold">
                          {privateUser.displayName || privateUser.username}
                        </p>
                        <p className="text-sm ml-2">(pending)</p>
                      </li>
                    )),
                  ]
                ) : (
                  <li className="text-gray-700 dark:text-gray-200">
                    No active users
                  </li>
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
