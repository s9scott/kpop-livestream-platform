import {doc, updateDoc, setDoc, serverTimestamp, getDoc, getDocs, collection } from 'firebase/firestore';
import {ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebaseConfig';



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
  
  