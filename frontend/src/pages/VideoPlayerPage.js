/**
 * @file VideoPlayerPage.js
 * @author Simon Tenedero, Jonas Matulis
 * @created 2024-XX-XX
 * @lastModified 2025-06-04
 * @desc file containing VideoPlayerPage
 */

import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import {
  createChat,
  simulateInvite,
  handleAcceptInvitation,
  handleRejectInvitation,
  fetchActiveUsers,
  fetchChats
} from '../utils/privateChatUtils';
import VideoPlayer from '../components/StreamPlayer/VideoPlayer';
import SwitchableChat from '../components/Chat/SwitchableChat';
import { logWebsiteUsage } from '../utils/livestreamsUtils';


const MAX_PRIVATE_CHATS = 100;

/**
 * This component represents the livestream page, has two main components, the livestream itself, and the switchable chats
 * 
 * @param {Array} tabs - Array of objects representing tabs {id:,name:}
 * @param {Object} user, 
 * @param {string} videoId, 
 * @param {Function} setVideoId,
 * @param {Function} setActiveUsers,
 * @param {Array} privateChats,
 * @param {Function} setPrivateChats,
 * @param {Array} invitations,
 * @param {Function} setInvitations,
 * @param {Object} selectedPrivateChat,
 * @param {Function} setSelectedPrivateChat,
 * @param {Function} selectedTab - state variable representing current selected tab
 * @param {Function} onSelectTab - Function handling behaviour of selecting a tab
 * 
 * @returns VideoPlayerPage
 */
const VideoPlayerPage = ({ 
  user, 
  videoId, 
  setVideoId,
  setActiveUsers,
  privateChats,
  setPrivateChats,
  invitations,
  setInvitations,
  selectedPrivateChat,
  setSelectedPrivateChat,
}) => {

  const [videoUrl, setVideoUrl] = useState('');
  const [showChatCreationMenu, setShowChatCreationMenu] = useState(false);
  const [notification, setNotification] = useState('');
  const [chatOpen,setChatOpen] = useState(true); //tracking whether chat is collapsed or not

  useEffect(() => {

    //declare function
    const fetchUsers = async () => {
      await fetchActiveUsers(setActiveUsers);
    };

    //call function
    fetchUsers();

    //if user logged in
    if (user) {

      fetchChats(user,setPrivateChats);

      //onSnapshot() sets a listener on a collection or document, will re-run code anytime data updates
      //this function constantly listens for any invites, and will update the invite list if needed
      const unsubscribeInvited = onSnapshot(query(collection(db, 'users', user.uid, 'invitations'), where('status', '==', 'pending')), (snapshot) => {
        const invites = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setInvitations(invites);
      });

      return () => {
        //cleanup function, runs whenever useEffect triggers, or whenever the component using the useEffect unmounts from DOM
        unsubscribeInvited();
      };
    }
  }, [user]); //function called if user changes

  //this triggers on initial rendering of this component
  useEffect(() => {

    const lastVideoId = localStorage.getItem('lastVideoId');
    if (lastVideoId) {
      //set videoId to lastVideoId
      setVideoId(lastVideoId);
      //remove lastVideoId from localStorage
      localStorage.removeItem('lastVideoId');
    }
  }, []);

  const handleCreateChat = async (chatSettings) => {
    if (privateChats.length < MAX_PRIVATE_CHATS) {

      await createChat(chatSettings, user);
      setShowChatCreationMenu(false);
    } else {
      alert(`You can only create up to ${MAX_PRIVATE_CHATS} private chats.`);
    }
  };

  const handleAcceptInvite = async (invitationId, chatId) => {
    await handleAcceptInvitation(invitationId, chatId, user, setPrivateChats);
  };

  const handleRejectInvite = async (invitationId) => {
    await handleRejectInvitation(invitationId, user);
  };

  const handleSimulateInvite = async () => {
    await simulateInvite(user);
  };

  const handleInviteNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 5000);
  };

  const handleTabClose = (chatId) => {
    console.log('handleTabClose called -',chatId,privateChats)
    setPrivateChats(privateChats.filter(id => id !== chatId));
    if (selectedPrivateChat === chatId) {
      setSelectedPrivateChat(privateChats.length > 1 ? privateChats[0] : null);
    }
  };

  //selectedChats={privateChats.filter(chat => selectedChats.includes(chat.id))}

  return (
    
    <div className="min-h-screen app-container flex flex-col bg-gradient-to-t from-base-300 via-base-200 to-base-100 xl:pt-20 desktop:pt-10">
      {/*only render notification div if notification exists*/}
      {notification && <div className="notification">{notification}</div>}
        {videoId ? (
          <div className={`flex flex-grow ${chatOpen?'justify-around':'justify-center'} items-start flex-wrap mt-10`}>
            <div className={`video-player-container ${chatOpen?'':'mx-auto'}`}>
              <VideoPlayer
                videoId={videoId}
                chatOpen={chatOpen}
              />
            </div>

            <div className="switchable-chat-container">
              <SwitchableChat
                user={user}
                videoId={videoId}
                setVideoId={setVideoId}
                handleTabClose={handleTabClose}
                privateChats = {privateChats}
                setPrivateChats = {setPrivateChats}
                invitations = {invitations}
                setInvitations={setInvitations}
                selectedPrivateChat= {selectedPrivateChat}
                setSelectedPrivateChat = {setSelectedPrivateChat}
                chatOpen={chatOpen}
                setChatOpen={setChatOpen}
              />
            </div>
          </div>
        ) : 
        (<div className="flex flex-col justify-start h-[80vh]">
          <h1 className="my-auto ml-5 text-7xl">nothing to see here. <br/> try choosing a <span className="text-primary">livestream.</span></h1>
        </div>)}
    </div>
  );
};

export default VideoPlayerPage;
