import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import Split from 'react-split';
import {
  createChat,
  simulateInvite,
  handleAcceptInvitation,
  handleRejectInvitation,
  fetchActiveUsers,
  fetchPrivateChatName,
  fetchPrivateChatMessages,
  sendPrivateChatMessage,
  fetchPrivateChatVideoTitle,
  fetchPrivateChatVideoId
} from '../utils/privateChatUtils';
import VideoPlayer from '../components/StreamPlayer/VideoPlayer';
import SwitchableChat from '../components/Chat/SwitchableChat';
import { logWebsiteUsage } from '../utils/livestreamsUtils';


const MAX_PRIVATE_CHATS = 10;

const VideoPlayerPage = ({ 
  user, 
  videoId, 
  setVideoId,
  activeUsers,
  setActiveUsers,
  privateChats,
  setPrivateChats,
  invitations,
  setInvitations,
  selectedChats,
  setSelectedChats,
  selectedChatId,
  setSelectedChatId,
}) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [showChatCreationMenu, setShowChatCreationMenu] = useState(false);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      await fetchActiveUsers(setActiveUsers);
    };

    fetchUsers();

    if (user) {
      const fetchChats = async () => {
        // Query for chats where the user is an invited user
        const invitedQuery = query(collection(db, 'privateChats'), where('invitedUsers', 'array-contains', user.uid));
        const ownerQuery = query(collection(db, 'privateChats'), where('creator', '==', user.uid));

        const invitedSnapshot = await getDocs(invitedQuery);
        const ownerSnapshot = await getDocs(ownerQuery);

        const combinedSnapshots = [...invitedSnapshot.docs, ...ownerSnapshot.docs];

        const fetchChatNames = async () => {
          const chats = await Promise.all(combinedSnapshots.map(async (doc) => {
            const chatData = doc.data();
            const chatName = await fetchPrivateChatName(doc.id);
            return { id: doc.id, ...chatData, name: chatName };
          }));
          setPrivateChats(chats);
        };
        fetchChatNames();
      };

      fetchChats();

      const unsubscribeInvited = onSnapshot(query(collection(db, 'users', user.uid, 'invitations'), where('status', '==', 'pending')), (snapshot) => {
        const invites = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setInvitations(invites);
      });

      return () => {
        unsubscribeInvited();
      };
    }
  }, [user]);

  useEffect(() => {
    const lastVideoId = localStorage.getItem('lastVideoId');
    if (lastVideoId) {
      setVideoId(lastVideoId);
      localStorage.removeItem('lastVideoId');
    }
  }, []);

  useEffect(() => {
    if (user) {
      logWebsiteUsage(user.uid, 'Visited VideoPlayerPage');
    }
  }, [user]);

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
    setSelectedChats(selectedChats.filter(id => id !== chatId));
    if (selectedChatId === chatId) {
      setSelectedChatId(selectedChats.length > 1 ? selectedChats[0] : null);
    }
  };

  const handleTabOpen = (chatId) => {
    setSelectedChats([...selectedChats, chatId]);
    setSelectedChatId(chatId);
  };

  const handleTabSelect = (chatId) => {
    setSelectedChatId(chatId);
  };

  return (
    
    <div className="app-container h-full w-full flex flex-col">
  {notification && <div className="notification">{notification}</div>}
  {videoId && (
    <>
    <div className="flex-grow flex overflow-hidden">
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
          selectedChats={privateChats.filter(chat => selectedChats.includes(chat.id))}
          setSelectedChats={setSelectedChats}
          handleTabClose={handleTabClose}
        />
      </div>
      </div>
      </>
  )}
</div>

    
  );
};

export default VideoPlayerPage;
