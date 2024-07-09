// firestoreUtils.js
import { db } from './firebaseConfig';
import { doc, setDoc, updateDoc, arrayUnion, serverTimestamp, getDoc } from 'firebase/firestore';

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

const updateUserStatus = async (userId, isActive) => {
  try {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, { activeStatus: isActive }, { merge: true });
  } catch (error) {
    console.error("Error updating user status: ", error);
  }
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
