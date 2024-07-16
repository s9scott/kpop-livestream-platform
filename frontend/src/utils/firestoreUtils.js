import { db } from '../firebaseConfig';
import { collection, query, orderBy, limit, where, onSnapshot, Timestamp, doc, getDoc, getDocs, setDoc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';

// Function to add or update a user
export const addUser = async (user) => {
  const userRef = doc(db, 'users', user.uid);  // Using user UID as the document ID
  await setDoc(userRef, {
    username: user.displayName,
    email: user.email,
    profilePicture: user.photoURL,
    createdAt: serverTimestamp(),
  }, { merge: true });
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
  console.log(userId);
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
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

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

export const fetchUserInfo = async ( uid ) => {
  const userRef = doc(db, 'users', uid); 

  const info = await getDoc(userRef);
  console.log("info: ", info.data());
  return info.data();
}; 