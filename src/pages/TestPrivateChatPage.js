import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, getDocs, onSnapshot, where, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { createChat, simulateInvite, handleAcceptInvitation, handleRejectInvitation, fetchActiveUsers } from '../utils/privateChatUtils';
import NativeChat from '../components/StreamPlayer/NativeChat';
import PrivateChat from '../components/PrivateChat/Chat/PrivateChat';
import ChatCreationMenu from '../components/PrivateChat/ChatCreationMenu';
import InvitationPopup from '../components/PrivateChat/InvitationPopup';
import { GoogleUserSignIn, signOutUser } from '../auth/googleAuth';
import LoginHeader from '../components/Header/LoginHeader';
import ChatTabs from '../components/PrivateChat/Chat/PrivateChatTabs';

const MAX_PRIVATE_CHATS = 5;

const TestPrivateChatPage = () => {
  const [user, setUser] = useState(null);
  const [activeUsers, setActiveUsers] = useState([]);
  const [videoId, setVideoId] = useState('testVideo1');
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
      const q = query(collection(db, 'users', user.uid, 'invitations'), where('status', '==', 'pending'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const invites = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setInvitations(invites);
      });

      const chatQuery = query(collection(db, 'privateChats'), where('invitedUsers', 'array-contains', user.uid));
      const chatUnsubscribe = onSnapshot(chatQuery, (snapshot) => {
        const chats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPrivateChats(chats);
      });

      return () => {
        unsubscribe();
        chatUnsubscribe();
      };
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

  const handleTabSelect = (chatId) => {
    setSelectedChatId(chatId);
  };

  return (
    <div className="p-6">
      <LoginHeader user={user} setUser={setUser} />
      {notification && <div className="notification">{notification}</div>}
      <h1 className="text-2xl font-bold mb-4">Test Private Chat Page</h1>
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
            <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="chat-menu-button" tabIndex="-1">
              <div className="py-1" role="none">
                {privateChats.map(chat => (
                  <a
                    key={chat.id}
                    href="#"
                    onClick={() => setSelectedChats([...selectedChats, chat.id])}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    tabIndex="-1"
                    id={`chat-${chat.id}`}
                  >
                    {chat.name || chat.url}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <ChatTabs
            chats={privateChats.filter(chat => selectedChats.includes(chat.id))}
            selectedChat={selectedChatId}
            onSelectChat={handleTabSelect}
            onCloseChat={handleTabClose}
          />
          {selectedChatId ? (
            <PrivateChat
              user={user}
              privateChatId={selectedChatId}
              handleInviteNotification={handleInviteNotification}
            />
          ) : (
            <p>Select a chat to start messaging.</p>
          )}
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

export default TestPrivateChatPage;