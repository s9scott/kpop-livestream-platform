// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

//object with credentials for Firebase project
const firebaseConfig = {
  apiKey: "AIzaSyBg6ZZfBKO7dn-_SXPl3pNbIilN6-Wx86w",
  authDomain: "k-pop-livestreaming-platform.firebaseapp.com",
  projectId: "k-pop-livestreaming-platform",
  storageBucket: "k-pop-livestreaming-platform.appspot.com",
  messagingSenderId: "554599515355",
  appId: "1:554599515355:web:0abf6bdde5bbf39119b8fe"
};

//start firebase app with config
const app = initializeApp(firebaseConfig);
//connect to database
const db = getFirestore(app);
//connect to storage
const storage = getStorage(app);

export { db, storage};
