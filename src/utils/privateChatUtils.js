import { collection, addDoc, query, orderBy, onSnapshot, doc, where, getDoc, updateDoc, getDocs, increment } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { fetchYoutubeVideoNameFromUrl } from './firestoreUtils';

export const fetchMessages = (privateChatId, setMessages) => {
  const q = query(collection(db, 'privateChats', privateChatId, 'messages'), orderBy('timestamp', 'asc'));
  const unsubscribe = onSnapshot(q, async (snapshot) => {
    const messagesData = await Promise.all(snapshot.docs.map(async (docSnapshot) => {
      const message = docSnapshot.data();
      if (message.authorUid) {
        const userRef = doc(db, 'users', message.authorUid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          return { ...message, authorPhotoURL: userData.photoURL || userData.profilePicture, userInfo: userData };
        }
      }
      return message;
    }));
    setMessages(messagesData);
  });
  return unsubscribe;
};

export const sendMessage = async (privateChatId, user, input, setInput) => {
  if (input.trim() && privateChatId && user) {
    const messageData = {
      text: input,
      authorName: user.displayName,
      authorUid: user.uid,
      timestamp: new Date().toISOString(),
    };
    await addDoc(collection(db, 'privateChats', privateChatId, 'messages'), messageData);
    setInput('');
  }
};

export const deletePrivateMessage = async (privateChatId, text, timestamp) => {
  const q = query(collection(db, 'privateChats', privateChatId, 'messages'), orderBy('timestamp', 'asc'));
  const snapshot = await getDocs(q);
  snapshot.forEach(async (doc) => {
    const message = doc.data();
    if (message.text === text && message.timestamp === timestamp) {
      await doc.ref.delete();
    }
  });
};

export const fetchActiveUsers = async (setActiveUsers) => {
  const usersSnapshot = await getDocs(collection(db, 'users'));
  const users = usersSnapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id }));
  setActiveUsers(users);
};

export const handleAcceptInvitation = async (invitationId, chatId, user, setSelectedChat) => {
  const invitationRef = doc(db, 'users', user.uid, 'invitations', invitationId);
  const invitationSnap = await getDoc(invitationRef);
  if (invitationSnap.exists()) {
    await updateDoc(invitationRef, { status: 'accepted' });
    setSelectedChat(prev => [...prev, chatId]);
  } else {
    console.error('Invitation document does not exist.');
  }
};

export const handleRejectInvitation = async (invitationId, user) => {
  const invitationRef = doc(db, 'users', user.uid, 'invitations', invitationId);
  const invitationSnap = await getDoc(invitationRef);
  if (invitationSnap.exists()) {
    await updateDoc(invitationRef, { status: 'rejected' });
  } else {
    console.error('Invitation document does not exist.');
  }
};

export const createChat = async (chatSettings, user) => {
  const chatData = {
    name: chatSettings.name,
    creator: user.uid,
    invitedUsers: chatSettings.invitedUsers.map(u => u.uid),
    url: chatSettings.url,
    createdAt: new Date().toISOString(),
  };
  const chatRef = await addDoc(collection(db, 'privateChats'), chatData);
  chatSettings.invitedUsers.forEach(async (invitedUser) => {
    const invitationData = {
      chatId: chatRef.id,
      invitedBy: user.uid,
      invitedAt: new Date().toISOString(),
      status: 'pending',
    };
    await addDoc(collection(db, 'users', invitedUser.uid, 'invitations'), invitationData);
  });
};

export const simulateInvite = async (user) => {
  const chatId = 'testChatId';
  const invitationData = {
    chatId,
    invitedBy: 'testUser2',
    invitedAt: new Date().toISOString(),
    status: 'pending',
  };
  await addDoc(collection(db, 'users', user.uid, 'invitations'), invitationData);
};

export const fetchPrivateChatName = async (chatId) => {
  const chatRef = doc(db, 'privateChats', chatId);
  const chatSnap = await getDoc(chatRef);
  if (chatSnap.exists()) {
    return chatSnap.data().name || chatSnap.data().url || 'Unnamed Chat';
  } else {
    console.error('Chat document does not exist.');
    return 'Unnamed Chat';
  }
};

export const fetchPrivateChatVideoTitle = (chatId, setVideoTitle) => {
  const chatRef = doc(db, 'privateChats', chatId);
  const unsubscribe = onSnapshot(chatRef, async (doc) => {
    if (doc.exists()) {
      const videoTitle = await fetchYoutubeVideoNameFromUrl(doc.data().url);
      setVideoTitle(videoTitle || 'no video');
    } else {
      console.error('Chat document does not exist.');
      setVideoTitle('');
    }
  });
  return unsubscribe;
};

export const fetchPrivateChatVideoUrl = async (chatId) => {
  try {
    const chatRef = doc(db, 'privateChats', chatId);
    const chatSnap = await getDoc(chatRef);
    if (chatSnap.exists()) {
      console.log('chatSnap.data().url:', chatSnap.data().url);
      return chatSnap.data().url || '';
    } else {
      console.error('Chat document does not exist.');
      return '';
    }
  } catch (error) {
    console.error('Error fetching chat URL:', error);
    return '';
  }
};

export const fetchPrivateChatVideoId = async (chatId) => {
  try {
    const chatRef = doc(db, 'privateChats', chatId);
    const chatSnap = await getDoc(chatRef);
    if (chatSnap.exists()) {
      const url = chatSnap.data().url;
      if (url) {
        const videoId = new URL(url).searchParams.get('v');
        return videoId || null;
      }
      return null;
    } else {
      console.error('Chat document does not exist.');
      return null;
    }
  } catch (error) {
    console.error('Error fetching chat URL:', error);
    return null;
  }
};



export const addPrivateReaction = async (privateChatId, text, timestamp, reaction) => {
  const q = query(collection(db, 'privateChats', privateChatId, 'messages'), where('timestamp', '==', timestamp));
  try {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      updateDoc(doc.ref, {
        [`reactions.${reaction}`]: increment(1)
      });
    });
  } catch (error) {
    throw error;
  }
};