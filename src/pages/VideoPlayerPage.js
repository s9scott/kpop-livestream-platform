/**
 * @file VideoPlayerPage.js
 * @author Simon Tenedero, Jonas Matulis
 * @created 2024-XX-XX
 * @lastModified 2025-06-04
 * @desc file containing VideoPlayerPage
 */

import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import {
  fetchActiveUsers,
  fetchChats
} from '../utils/privateChatUtils';
import VideoPlayer from '../components/StreamPlayer/VideoPlayer';
import SwitchableChat from '../components/Chat/SwitchableChat';
import { useUser } from '../context/UserContext';

/**
 * This component represents the livestream page, has two main components, the livestream itself, and the switchable chats
 * 
 * @param {Array} tabs - Array of objects representing tabs {id:,name:}
 * @param {Object} user, 
 * @param {string} videoId, 
 * @param {Function} setVideoId,
 * @param {Function} setActiveUsers,
 * @param {Array} privateChats,
 * @param {Function} setPrivateChats,
 * @param {Array} invitations,
 * @param {Function} setInvitations,
 * @param {Object} selectedPrivateChat,
 * @param {Function} setSelectedPrivateChat,
 * @param {Function} selectedTab - state variable representing current selected tab
 * @param {Function} onSelectTab - Function handling behaviour of selecting a tab
 * 
 * @returns VideoPlayerPage
 */
const VideoPlayerPage = ({ 
  videoId, 
  setVideoId,
  setActiveUsers,
  privateChats,
  setPrivateChats,
  invitations,
  setInvitations,
  selectedPrivateChat,
  setSelectedPrivateChat,
}) => {

  const [chatOpen,setChatOpen] = useState(true); //tracking whether chat is collapsed or not

  const {user} = useUser();

  useEffect(() => {

    //declare function
    const fetchUsers = async () => {
      await fetchActiveUsers(setActiveUsers);
    };

    //call function
    fetchUsers();

    //if user logged in
    if (user) {

      fetchChats(user,setPrivateChats);

      //onSnapshot() sets a listener on a collection or document, will re-run code anytime data updates
      //this function constantly listens for any invites, and will update the invite list if needed
      const unsubscribeInvited = onSnapshot(query(collection(db, 'users', user.uid, 'invitations'), where('status', '==', 'pending')), (snapshot) => {
        const invites = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setInvitations(invites);
      });

      return () => {
        //cleanup function, runs whenever useEffect triggers, or whenever the component using the useEffect unmounts from DOM
        unsubscribeInvited();
      };
    }
  }, [user, setPrivateChats, setInvitations]); //function called if user changes

  //this triggers on initial rendering of this component
  useEffect(() => {

    const lastVideoId = localStorage.getItem('lastVideoId');
    if (lastVideoId) {
      //set videoId to lastVideoId
      setVideoId(lastVideoId);
      //remove lastVideoId from localStorage
      localStorage.removeItem('lastVideoId');
    }
  }, []);

  return (
    
    <div className="min-h-screen app-container flex flex-col">

        {videoId ? (
          <div className={`h-full flex items-start flex-grow flex-wrap landscape:px-10 py-6 justify-around`}>
            
            <VideoPlayer
              videoId={videoId}
              chatOpen={chatOpen}
            />

            <SwitchableChat
              videoId={videoId}
              setVideoId={setVideoId}
              privateChats = {privateChats}
              setPrivateChats = {setPrivateChats}
              invitations = {invitations}
              setInvitations={setInvitations}
              selectedPrivateChat= {selectedPrivateChat}
              setSelectedPrivateChat = {setSelectedPrivateChat}
              chatOpen={chatOpen}
              setChatOpen={setChatOpen}
            />
            
          </div>
        ) : 
        (<div className="flex flex-col justify-start h-[80vh] px-10">
          <h1 className="my-auto text-5xl md:text-7xl  font-bold">nothing to see here. <br/> try choosing a <span className="text-primary">livestream.</span></h1>
        </div>)}
    </div>
  );
};

export default VideoPlayerPage;
