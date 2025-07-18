/**
 * @file usersUtils.js
 * @author Simon Tenedero, Jonas Matulis
 * @created 2024-XX-XX
 * @lastModified 2025-06-04
 * @desc module for managing users
 */

import {doc, getDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '../firebaseConfig';

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
 * @returns Array of users from the Firestore database
 */
export const fetchUsers = async () => {
  console.log('hi im being called.');
  //grab reference to entire collection
  const usersSnapshot = await getDocs(collection(db, 'users'));
  
  //create a new list of objects - NOTE '...' is the spread() operator, which returns an object containing a COPY of all the fields in an iteratable (doc.data() in this case)
  const users = usersSnapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id }));

  console.log('users=',users);

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
  