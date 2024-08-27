import { collection, addDoc, query, orderBy, onSnapshot, doc, where, getDoc, updateDoc, getDocs, increment } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { fetchYoutubeVideoNameFromUrl } from './livestreamsUtils';


/**
 * 
 * @param {*} privateChatId, setMessages
 * privateChatId: string - the ID of the private chat
 * setMessages: function - a function to set the messages
 * @returns 
 * 
 * Fetches messages from a private chat and sets them in the state.
 */
export const fetchPrivateChatMessages = (privateChatId, setMessages) => {
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

/**
 * 
 * @param {*} privateChatId, user, input, setInput
 * user: object - the authenticated user
 * input: string - the message to send
 * setInput: function - a function to set the input
 * @returns 
 * 
 * Sends a message to a private chat.
 * If the input is not empty, the private chat ID exists, and the user is authenticated, the message is sent.
 * The message is added to the private chat's messages collection.
 */

export const sendPrivateChatMessage = async (privateChatId, user, input, setInput) => {
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

/**
 * @param {*} privateChatId, text, timestamp
 * privateChatId: string - the ID of the private chat
 * text: string - the text of the message to delete
 * timestamp: string - the timestamp of the message to delete
 * 
 * Deletes a private message from a private chat.
*/
export const deletePrivateChatMessage = async (privateChatId, text, timestamp) => {
  const q = query(collection(db, 'privateChats', privateChatId, 'messages'), orderBy('timestamp', 'asc'));
  const snapshot = await getDocs(q);
  snapshot.forEach(async (doc) => {
    const message = doc.data();
    if (message.text === text && message.timestamp === timestamp) {
      // Delete the message
      await doc.ref.delete();
      //put into another collection
      await addDoc(collection(db, 'deletedMessages'), { ...message, chatId: privateChatId });
    }
  });
};

/**
 * @param {*} setActiveUsers
 * setActiveUsers: function - a function to set the active users
 * 
 * Fetches the active users from the Firestore database and sets them in the state.
 * The active users are users who are currently online.
*/
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

/**
 * @param {*} invitationId, user
 * invitationId: string - the ID of the invitation
 * user: object - the authenticated user
 * 
 * Rejects an invitation to a private chat.
 * The status of the invitation is set to 'rejected'.
 * The invitation is not deleted from the database.
 */
export const handleRejectInvitation = async (invitationId, user) => {
  const invitationRef = doc(db, 'users', user.uid, 'invitations', invitationId);
  const invitationSnap = await getDoc(invitationRef);
  if (invitationSnap.exists()) {
    await updateDoc(invitationRef, { status: 'rejected' });
  } else {
    console.error('Invitation document does not exist.');
  }
};

/**
 * @param {*} chatId, user
 * chatId: string - the ID of the private chat
 * user: object - the authenticated user
 * 
 * create a new chat with the given chat settings
 * The chat is added to the privateChats collection.
 * Invitations are sent to the invited users.
 * The invitations are added to the users' invitations collection.
*/
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

/***
 * @param {*} user
 * user: object - the authenticated user
 * 
 * Simulates an invitation to a private chat *for testing*.
 */
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

/**
 * 
 * @param {*} chatId 
 * chatId: string - the ID of the private chat
 * @returns 
 * 
 * Fetches the name of a private chat from the Firestore database.
 * If the chat document exists, the name is returned.
 */
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

/**
 * @param {*} chatId, setVideoTitle
 * chatId: string - the ID of the private chat
 * setVideoTitle: function - a function to set the video title
 * 
 * Fetches the title of the YouTube video from the Firestore database.
 * If the chat document exists, the video title is set in the state.
 * If the chat document does not exist, an error is logged.
 */
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

/***
 * @param {*} chatId
 * chatId: string - the ID of the private chat
 * @returns returns the URL of the video
 * 
 * Fetches the URL of the YouTube video from the Firestore database.
 */

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

/**
 * 
 * @param {*} chatId 
 * @returns the video ID of the YouTube video
 * 
 * Fetches the video ID of the YouTube video from the Firestore database.
 */
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

/**
 * @param {*} chatId
 * chatId: string - the ID of the private chat
 * @returns the members of the private chat with chatId
 * 
 * Fetches the members of a private chat from the Firestore database.
*/
export const fetchPrivateChatMembers = async (chatId) => {
  const chatRef = doc(db, 'privateChats', chatId);
  const chatSnap = await getDoc(chatRef);
  
  if (chatSnap.exists()) {
    // Get the owner's data
    const owner = await fetchUser(chatSnap.data().creator);

    // Get the invited users' data
    const invitedUserIds = chatSnap.data().invitedUsers || [];
    const invitedUsers = await Promise.all(invitedUserIds.map((userId) => fetchUser(userId)));

    // Combine the owner with the invited users
    const allMembers = [owner, ...invitedUsers.filter(user => user !== null)];

    return allMembers;
  } else {
    console.error('Chat document does not exist.');
    return [];
  }
};

/**
 * @param {*} userId  
 * @returns the user object with the given userId
 * 
 * Fetches the user object with the given userId from the Firestore database.
 */
export const fetchUser = async (userId) => {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    return { ...userSnap.data(), uid: userSnap.id };
  } else {
    console.error('User document does not exist.');
    return null;
  }
};

/**
 * @param {*} chatId, user
 * chatId: string - the ID of the private chat
 * user: object - the user object
 * 
 * Adds the user to the list of invited users in the private chat with chatId.
 * If the user is already in the list, the function does nothing.
 * If the user is not in the list, the function adds the user to the list.
 */
export const addUserToPrivateChat = async (chatId, user) => {
  //not using arrayunion because it doesn't work with the emulator
  const chatRef = doc(db, 'privateChats', chatId);
  const chatSnap = await getDoc(chatRef);
  if (chatSnap.exists()) {
    const invitedUsers = chatSnap.data().invitedUsers || [];
    if (!invitedUsers.includes(user.uid)) {
      invitedUsers.push(user.uid);
      await updateDoc(chatRef, { invitedUsers });
    }
  }
};





export const addPrivateChatReaction = async (privateChatId, text, timestamp, reaction) => {
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