import {doc, updateDoc, setDoc, serverTimestamp, getDoc, getDocs, collection } from 'firebase/firestore';
import {ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebaseConfig';

/*
 * Firestore is a cloud-hosted NoSQL database provided by Firebase
 * Data is stored in collections (similar to a hash map)
 * The actual data is stored as key-value pairs; key = document id, value = document
 * ex.
 * users = {
 *  "idxyz":{name: "jellyCat", age: 5},
 *  "idabc":{name: "calico", age: 3}
 * }
 * 
 * run down of functions in this example
 * doc(): creates a reference in the data base, think of as declaring a ptr - references are stored as path like structures
 * setDoc(): creates or overwrites data at the given reference
 * updateDoc(): only updates specified fields in a document - does not overwrite document
 * serverTimeStamp(): returns current time on server-side (NOT client-slide)
 * getDoc(): retrieve documentSnapshot based on given document id
 * getDocs(): retrieve bundle of documeSnapshot in a collection
 * colection(): create a reference - ptr - to an entire collection
 * 
 * documentSnapshot: contains the data of a document as well as the doc id, whether document exists or not, metadata
 * 
 * Firebase Config:
 * db (firestore) - stores structure data (key-value pairs where the value is an object with fields)
 * storage (cloud storage) - stores files/media (files are stored in buckets (similar to folders) instead of collections)
 * 
 */

/**
 * @param {*} user 
 * Function to add a user to the Firestore database
 */
export const addUser = async (user) => {
  const userRef = doc(db, 'users', user.uid);  // Using user UID as the document ID, this will be users/{u.id}
  await setDoc(userRef, {
    username: user.username, //google user name
    displayName: user.displayName, //website user name
    email: user.email, 
    photoURL: user.photoURL, //website pfp
    profilePicture: user.profilePicture, //google pfp
    createdAt: serverTimestamp(),
  }, { merge: true }); //merge new data with existing document data instead of overwriting
};

/**
 * @returns Array of users from the Firestore database
 */
export const fetchUsers = async () => {
  //grab reference to entire collection
  const usersSnapshot = await getDocs(collection(db, 'users'));
  
  //create a new list of objects - NOTE '...' is the spread() operator, which returns an object containing a COPY of all the fields in an iteratable (doc.data() in this case)
  const users = usersSnapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id }));
  //the object returned by ...doc.data() is MERGED with uid:doc.id so essentially it'll be an object almost identical to a regular document PLUS a new key-value pair

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

    //potentially add error handling? what if file is not recognized

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
  
  //these following 3 functions are called in AccountPage.js - 'export' makes function available to external files
  export const uploadUserProfilePhoto = async (uid, file) => {
    try {
      // Create a reference to the storage bucket location, and get the reference
      const storageRef = ref(storage, `profilePhotos/${uid}`);
      const contentType = getContentType(file); // Determine the content type
      const metadata = {
        contentType: contentType,
      };

      //upload file and metadata to storage at storageRef. snapshot stores the metadata and reference to uploaded file
      const snapshot = await uploadBytes(storageRef, file, metadata);
      const photoURL = await getDownloadURL(snapshot.ref); //get a public URL for the file based on the snapshot reference - photoURL can be used to display img
  
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
  
  //set photoURL field to argument
  export const resetPfp = async (uid, photoURL) => {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      photoURL: photoURL
    });
  };
  
  //set displayName field to argument
  export const resetDisplayName = async (uid, name) => {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      displayName: name
    });
  };
  
  