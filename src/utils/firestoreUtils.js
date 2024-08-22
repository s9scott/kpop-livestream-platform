/**
 * Firestore utility functions for the Kpop Livestream Platform
 */


import { db, storage } from '../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, query, orderBy, limit, where, doc, getDoc, getDocs, setDoc, updateDoc, arrayUnion, serverTimestamp, deleteDoc, increment } from 'firebase/firestore';

// YOUTUBE API key
const API_KEY = 'AIzaSyCJXkbG-hi1ECUlkXJ3yZS_-agRa9bPzCM';

/**
 * @param {*} user 
 * Function to add a user to the Firestore database
 */
export const addUser = async (user) => {
  const userRef = doc(db, 'users', user.uid);  // Using user UID as the document ID
  await setDoc(userRef, {
    username: user.username,
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
    profilePicture: user.profilePicture,
    createdAt: serverTimestamp(),
  }, { merge: true });
};

/**
 * @returns Array of users from the Firestore database
 */
export const fetchUsers = async () => {
  const usersSnapshot = await getDocs(collection(db, 'users'));
  const users = usersSnapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id }));

  return users;
};

/**
 * @param {*} userId 
 * @param {*} message 
 * Function to log a message sent by a user
 * This function will create a new document for the user if it doesn't exist
 */
export const logMessageSent = async (userId, message) => {
  const userRef = doc(db, 'users', userId);  // Using user UID as the document ID
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    await setDoc(userRef, { messagesSent: [] }, { merge: true });
  }

  await updateDoc(userRef, {
    messagesSent: arrayUnion({ text: message, timestamp: new Date() }),
  });
};

/**
 * @param {*} userId 
 * @param {*} activity 
 * Function to log website usage by a user
 * This function will create a new document for the user if it doesn't exist
 */
export const logWebsiteUsage = async (userId, activity) => {
  const userRef = doc(db, 'users', userId);  // Using user UID as the document ID
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    await setDoc(userRef, { websiteUsage: [] }, { merge: true });
  }

  await updateDoc(userRef, {
    websiteUsage: arrayUnion({ activity, timestamp: new Date() }),
  });
};

/**
 * @param {*} videoId 
 * @returns Array of messages from the Firestore database for a specific video
 */
export const getActiveUsers = async (videoId) => {
  try {
    // Query to get the last 100 messages ordered by timestamp
    const q = query(
      collection(db, 'livestreams', videoId, 'messages'),
      orderBy('timestamp', 'desc'),
      limit(25)
    );

    const querySnapshot = await getDocs(q);
    const userIds = new Set();
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 15000);

    querySnapshot.forEach((doc) => {
      const messageData = doc.data();
      const messageTimestamp = new Date(messageData.timestamp); // Convert ISO 8601 to Date object
      if (messageTimestamp >= fiveMinutesAgo) {
        userIds.add(messageData.authorUid);
      }
    });

    const activeUserPromises = Array.from(userIds).map(async (uid) => {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        return userSnap.data();
      }
      return null;
    });

    const activeUsers = await Promise.all(activeUserPromises);
    return activeUsers.filter((user) => user !== null);
  } catch (error) {
    console.error("Error getting active users: ", error);
    return [];
  }
};

/**
 * @param videoId 
 * @returns number of active users in the last 5 minutes
 */
export const getNumberOfActiveUsers = async (videoId) => {
  const activeUsers = await getActiveUsers(videoId);
  return activeUsers.length;
};

/**
 * @param videoId 
 * @returns youtube video details for the given videoId (title, description, channelTitle, publishedAt, thumbnails)
 */
export const fetchYoutubeDetails = async (videoId) => {
  try {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${API_KEY}&part=snippet`);
    const data = await response.json();
    if (data.items && data.items.length > 0) {
      return data.items[0].snippet;
    } else {
      throw new Error('Video not found');
    }
  } catch (error) {
    console.error('Error fetching video details:', error);
    return null;
  }
};

/**
 * @returns list of active streams
 * Fetches all active streams from the Firestore database
 */
export const fetchActiveStreams = async () => {
  const q = query(collection(db, 'livestreams'), where('isActive', '==', true));
  const querySnapshot = await getDocs(q);
  const streams = [];
  querySnapshot.forEach((doc) => {
    streams.push({ id: doc.id, ...doc.data() });
  });
  return streams;
};

/**
 * @param {*} videoId 
 * @returns video details for the given videoId from firestore database (title, description, channelTitle, publishedAt, thumbnails  )
 */
export const fetchVideoDetails = async (videoId) => {
  const docRef = doc(db, 'videos', videoId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.error("No such document!");
    return null;
  }
};

/**
 * @param {*} videoId 
 * @param {*} title 
 * @param {*} url 
 * Adds a new live stream to the Firestore database
 * The videoId is used as the document ID
 */
export const addLiveStream = async (videoId, title, url) => {
  const livestreamRef = doc(db, 'livestreams', videoId);
  await setDoc(livestreamRef, {
    title: title,
    url: url,
    isActive: true,
    createdAt: serverTimestamp()
  });
};

/**
 * @param {*} videoId
 * Updates the isActive field of the live stream to false
 * This effectively stops the live stream from being embeded in the website
 * The videoId is used as the document ID
 */
export const archiveChatMessages = async (videoId) => {
  const messagesRef = collection(db, 'livestreams', videoId, 'messages');
  const archiveRef = collection(db, 'archive', videoId, 'messages');

  const querySnapshot = await getDocs(messagesRef);
  querySnapshot.forEach(async (doc) => {
    const messageData = doc.data();
    const archiveDocRef = doc(archiveRef, doc.id);
    await setDoc(archiveDocRef, messageData);
    await deleteDoc(doc.ref);
  });
};

/**
 * @param {*} videoId 
 * @param {*} text 
 * @param {*} timestamp 
 * Deletes a message from the Firestore database
 * The message is identified by the text and timestamp
 * The videoId is used as the document ID
 * The text and timestamp are used as the message ID
 */
export const deleteMessage = async (videoId, text, timestamp) => {
  console.log('Deleting message:', videoId, text, timestamp);
  const messagesRef = collection(db, 'livestreams', videoId, 'messages');
  const q = query(messagesRef, where('text', '==', text), where('timestamp', '==', timestamp));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach(async (doc) => {
    await deleteDoc(doc.ref);
  });
};

export const muteUser = async (videoId, uid) => {
}

/**
 * @param {*} uid 
 * @after user information from the Firestore database
 */
export const fetchUserInfo = async (uid) => {
  const userRef = doc(db, 'users', uid);

  const info = await getDoc(userRef);
  console.log("DB Info: ", info.data());
  return info.data();
};

/**
 * @param {*} url
 * @returns the title of the youtube video from the given url
 */
export const fetchYoutubeVideoNameFromUrl = async (url) => {
  if(url) {
    try {
      const videoId = url.split('v=')[1];
      const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${API_KEY}&part=snippet`);
      const data = await response.json();
      if (data.items && data.items.length > 0) {
        return data.items[0].snippet.title;
      } else {
        throw new Error('Video not found');
      }
    } catch (error) {
      console.error('Error fetching video details:', error);
      return 'No video just chatting :)';
    }
  }
};

/**
 * @param {*} videoId 
 * @param {*} text 
 * @param {*} timestamp 
 * @param {*} reaction 
 * Adds a reaction to a message in the Firestore database
 * The message is identified by the text and timestamp
 * The videoId is used as the document ID
 */
export const addReaction = async (videoId, text, timestamp, reaction) => {
  const messagesCollectionRef = collection(db, 'livestreams', videoId, 'messages');
  const q = query(messagesCollectionRef, where('text', '==', text), where('timestamp', '==', timestamp));

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

//!!! HELP RENAME
/**
 * @param {*} streamId
 * @returns the title of the live stream with the given streamId
*/
export const fetchVideoName = async (streamId) => {
  try {
    const liveStreamRef = doc(db, 'livestreams', streamId);
    const liveStreamSnap = await getDoc(liveStreamRef);

    if (liveStreamSnap.exists()) {
      return liveStreamSnap.data().title;
    } else {
      console.error('Live stream document does not exist.');
      return 'Error fetching title';
    }
  } catch (error) {
    console.error('Error fetching video name:', error);
    return 'Error fetching title';
  }
};

//!!! HELP RENAME
/**
 * @returns an array of all live streams in the Firestore database
 */
export const getLiveStreams = async () => {
  const liveStreamsSnapshot = await getDocs(collection(db, 'livestreams'));
  return liveStreamsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

//!!! HELP RENAME

export const fetchActiveUsersCount = async (liveStreamId) => {
  const liveStreamRef = doc(db, 'livestreams', liveStreamId);
  const liveStreamSnap = await getDoc(liveStreamRef);

  if (liveStreamSnap.exists()) {
    return liveStreamSnap.data().activeUsersCount || 0;
  } else {
    console.error('Live stream document does not exist.');
    return 0;
  }
};

//!!! ACCOUNT UTILS -> MOVE

/**
 * @param {*} file 
 * @returns the content type of the file
 */
const getContentType = (file) => {
  console.log("file: ", file, " file type: ", file.type, " file name: ", file.name);
  const extension = file.name.split('.').pop().toLowerCase();
  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'webp':
      return 'image/webp';
    default:
      return 'image/png'; // Fallback content type
  }
};

export const uploadUserProfilePhoto = async (uid, file) => {
  try {
    // Create a reference to the storage bucket location, and get the reference
    const storageRef = ref(storage, `profilePhotos/${uid}`);
    const contentType = getContentType(file); // Determine the content type
    const metadata = {
      contentType: contentType,
    };
    const snapshot = await uploadBytes(storageRef, file, metadata);
    const photoURL = await getDownloadURL(snapshot.ref);

    // Update the user's photoURL in Firestore with the new reference
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      photoURL: photoURL
    });

    return photoURL;
  } catch (error) {
    console.error('Error uploading profile photo:', error);
    throw error;
  }
};

export const resetPfp = async (uid, photoURL) => {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    photoURL: photoURL
  });
};

export const resetDisplayName = async (uid, name) => {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    displayName: name
  });
};

