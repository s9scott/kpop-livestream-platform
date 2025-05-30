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

const VideoPlayerPage = ({ 
  user, 
  videoId, 
  setVideoId,
  setActiveUsers,
  privateChats,
  setPrivateChats,
  invitations,
  setInvitations,
  selectedChats,
  setSelectedChats,
  selectedPrivateChat,
  setSelectedPrivateChat,
}) => {

  const [videoUrl, setVideoUrl] = useState('');
  const [showChatCreationMenu, setShowChatCreationMenu] = useState(false);
  const [notification, setNotification] = useState('');

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
    await handleAcceptInvitation(invitationId, chatId, user, setSelectedChats);
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
    
    <div className="app-container h-full w-full flex flex-col bg-gradient-to-t from-base-300 via-base-200 to-base-100">
      {/*only render notification div if notification exists*/}
      {notification && <div className="notification md:h-player-page-height">{notification}</div>}
      {videoId && (
        <>
          <div className="flex-grow flex overflow-hidden justify-around items-start mt-10">
            <div className='"video-player-container flex-shrink-0"'>
              <VideoPlayer
                videoId={videoId}
              />
            </div>
            <div className="switchable-chat-container flex-shrink-0">
              <SwitchableChat
                user={user}
                videoId={videoId}
                setVideoId={setVideoId}
                selectedChats={selectedChats}
                setSelectedChats={setSelectedChats}
                handleTabClose={handleTabClose}
                privateChats = {privateChats}
                setPrivateChats = {setPrivateChats}
                invitations = {invitations}
                selectedPrivateChat= {selectedPrivateChat}
                setSelectedPrivateChat = {setSelectedPrivateChat}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VideoPlayerPage;
