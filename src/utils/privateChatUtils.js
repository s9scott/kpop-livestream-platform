import { collection, addDoc, query, orderBy, onSnapshot, doc, getDoc, updateDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

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
          return { ...message, authorPhotoURL: userData.profilePicture, userInfo: userData };
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
