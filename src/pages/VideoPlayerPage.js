import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
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

const VideoPlayerPage = ({ user}) => {
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

  const [videoId, setVideoId] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoPlayerSettings, setVideoPlayerSettings] = useState(defaultVideoPlayerSettings);
  const [chatSettings, setChatSettings] = useState(defaultChatSettings);
  const [activeUsers, setActiveUsers] = useState([]);
  const [showChatCreationMenu, setShowChatCreationMenu] = useState(false);
  const [invitations, setInvitations] = useState([]);
  const [selectedChats, setSelectedChats] = useState([]);
  const [privateChats, setPrivateChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
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
    <div className="app-container">
      {notification && <div className="notification">{notification}</div>}
      {videoId && (
        <>
          <VideoPlayer
            videoId={videoId}
            settings={videoPlayerSettings}
            onResizeStop={(data) => handleResizeStop('video', data)}
            onDragStop={(data) => handleDragStop('video', data)}
          />
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
        </>
      )}
      {user ? (
        <>
          <button
            onClick={() => setShowChatCreationMenu(true)}
            className="btn-primary mb-4 px-4 py-2 text-white rounded"
          >
            Create Private Chat
          </button>
          <button
            onClick={handleSimulateInvite}
            className="btn-secondary mb-4 px-4 py-2 text-white rounded"
          >
            Simulate Invite
          </button>
          <div className="relative inline-block text-left mb-4">
            <button
              type="button"
              className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              id="chat-menu-button"
              aria-expanded="true"
              aria-haspopup="true"
            >
              Select Chat
              <svg className="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </button>
            <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md text-black bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="chat-menu-button" tabIndex="-1">
              <div className="py-1" role="none">
                {privateChats.map(chat => (
                  <button
                    key={chat.id}
                    onClick={() => handleTabOpen(chat.id)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    role="menuitem"
                    tabIndex="-1"
                    id={`chat-${chat.id}`}
                  >
                    {chat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {showChatCreationMenu && (
            <ChatCreationMenu
              activeUsers={activeUsers}
              onCreateChat={handleCreateChat}
              onClose={() => setShowChatCreationMenu(false)}
              currentUser={user}
            />
          )}
          {invitations.map((invitation) => (
            <InvitationPopup
              key={invitation.id}
              invitation={invitation}
              onAccept={() => handleAcceptInvite(invitation.id, invitation.chatId)}
              onReject={() => handleRejectInvite(invitation.id)}
            />
          ))}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default VideoPlayerPage;
