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
  fetchMessages,
  sendMessage,
  fetchPrivateChatVideoTitle,
  fetchPrivateChatVideoId
} from '../utils/privateChatUtils';
import VideoPlayer from '../components/StreamPlayer/VideoPlayer';
import SwitchableChat from '../components/StreamPlayer/SwitchableChat';
import ChatCreationMenu from '../components/PrivateChat/ChatCreationMenu';
import InvitationPopup from '../components/PrivateChat/InvitationPopup';
import { logWebsiteUsage } from '../utils/firestoreUtils';


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
  const calculateDefaultSettings = () => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight - 150;
    const videoPlayerWidth = screenWidth * 0.65;
    const chatWidth = screenWidth * 0.35 - 50;

    return {
      videoPlayerSettings: { width: videoPlayerWidth, height: screenHeight, x: 20, y: 20 },
      chatSettings: { width: chatWidth, height: screenHeight, x: videoPlayerWidth + 40, y: 20 }
    };
  };

  const { videoPlayerSettings: defaultVideoPlayerSettings, chatSettings: defaultChatSettings } = calculateDefaultSettings();
  const [videoUrl, setVideoUrl] = useState('');
  const [videoPlayerSettings, setVideoPlayerSettings] = useState(defaultVideoPlayerSettings);
  const [chatSettings, setChatSettings] = useState(defaultChatSettings);
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
    const savedVideoPlayerSettings = JSON.parse(localStorage.getItem('videoPlayerSettings'));
    const savedChatSettings = JSON.parse(localStorage.getItem('chatSettings'));
    const lastVideoId = localStorage.getItem('lastVideoId');

    if (savedVideoPlayerSettings) setVideoPlayerSettings(savedVideoPlayerSettings);
    if (savedChatSettings) setChatSettings(savedChatSettings);
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

  const handleResizeStop = (type, data) => {
    const { size, position } = data;
    if (type === 'video') {
      const newSettings = { ...videoPlayerSettings, width: size.width, height: size.height, x: position.x, y: position.y };
      setVideoPlayerSettings(newSettings);
      localStorage.setItem('videoPlayerSettings', JSON.stringify(newSettings));
    } else {
      const newSettings = { ...chatSettings, width: size.width, height: size.height, x: position.x, y: position.y };
      setChatSettings(newSettings);
      localStorage.setItem('chatSettings', JSON.stringify(newSettings));
    }
  };

  const handleDragStop = (type, data) => {
    const { x, y } = data;
    if (type === 'video') {
      const newSettings = { ...videoPlayerSettings, x, y };
      setVideoPlayerSettings(newSettings);
      localStorage.setItem('videoPlayerSettings', JSON.stringify(newSettings));
    } else {
      const newSettings = { ...chatSettings, x, y };
      setChatSettings(newSettings);
      localStorage.setItem('chatSettings', JSON.stringify(newSettings));
    }
  };

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
    
    <div className="app-container flex flex-col">
  {notification && <div className="notification">{notification}</div>}
  {videoId && (
    <>
    <div className="flex-grow flex overflow-hidden">
      <div className='"video-player-container w-[70%] h-[90%] border-2 border-accent flex-shrink-0"'>
        <VideoPlayer
          videoId={videoId}
          settings={videoPlayerSettings}
          onResizeStop={(data) => handleResizeStop('video', data)}
          onDragStop={(data) => handleDragStop('video', data)}
        />
      </div>
      <div className="switchable-chat-container w-[30%] h-[90%] border-2 border-accent flex-shrink-0">
        <SwitchableChat
          user={user}
          videoId={videoId}
          setVideoId={setVideoId}
          selectedChats={privateChats.filter(chat => selectedChats.includes(chat.id))}
          setSelectedChats={setSelectedChats}
          handleTabClose={handleTabClose}
          onResizeStop={(data) => handleResizeStop('video', data)}
          onDragStop={(data) => handleDragStop('video', data)}
          settings={chatSettings}
        />
      </div>
      </div>
      </>
  )}
</div>

    
  );
};

export default VideoPlayerPage;
