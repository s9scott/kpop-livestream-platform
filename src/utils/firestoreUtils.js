import { db, storage } from '../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, query, orderBy, limit, where, onSnapshot, Timestamp, doc, getDoc, getDocs, setDoc, updateDoc, arrayUnion, serverTimestamp, deleteDoc, increment } from 'firebase/firestore';


const API_KEY = 'process.env.YOUTUBE_API_KEY';

// Function to add or update a user
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

export const fetchUsers = async () => {
  const usersSnapshot = await getDocs(collection(db, 'users'));
  const users = usersSnapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id }));

  return users;
};


// Function to log a message sent
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

// Function to log website usage
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

// Function to get active users based on the last 100 messages within the last 5 minutes
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

export const getNumberOfActiveUsers = async (videoId) => {
  const activeUsers = await getActiveUsers(videoId);
  return activeUsers.length;
};


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

// Fetch active livestreams
export const fetchActiveStreams = async () => {
  const q = query(collection(db, 'livestreams'), where('isActive', '==', true));
  const querySnapshot = await getDocs(q);
  const streams = [];
  querySnapshot.forEach((doc) => {
    streams.push({ id: doc.id, ...doc.data() });
  });
  return streams;
};

// Fetch video details
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

// Add a new livestream
export const addLiveStream = async (videoId, title, url) => {
  const livestreamRef = doc(db, 'livestreams', videoId);
  await setDoc(livestreamRef, {
    title: title,
    url: url,
    isActive: true,
    createdAt: serverTimestamp()
  });
};

// Function to archive chat messages
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

// Function to delete a message
export const deleteMessage = async (videoId, text, timestamp) => {
  console.log('Deleting message:', videoId, text, timestamp);
  const messagesRef = collection(db, 'livestreams', videoId, 'messages');
  const q = query(messagesRef, where('text', '==', text), where('timestamp', '==', timestamp));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach(async (doc) => {
    await deleteDoc(doc.ref);
  });
};

// Function to mute a user
export const muteUser = async (videoId, userId, duration) => {
  const muteRef = doc(db, `livestreams/${videoId}/mutedUsers`, userId);
  await setDoc(muteRef, {
    mutedAt: serverTimestamp(),
    duration: duration // Duration in minutes
  });
};

export const fetchUserInfo = async (uid) => {
  const userRef = doc(db, 'users', uid);

  const info = await getDoc(userRef);
  console.log("DB Info: ", info.data());
  return info.data();
};

// Function to determine the content type based on file extension
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


export const getLiveStreams = async () => {
  const liveStreamsSnapshot = await getDocs(collection(db, 'livestreams'));
  return liveStreamsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

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