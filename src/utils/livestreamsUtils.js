/**
 * @file livestreamsUtils.js
 * @author Simon Tenedero, Jonas Matulis
 * @created 2024-XX-XX
 * @lastModified 2025-06-04
 * @desc module for managing livestreaming in firebase
 */

import { db } from '../firebaseConfig';
import { collection, query, where, doc, getDoc, getDocs, updateDoc, deleteDoc, increment } from 'firebase/firestore';

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
 * Fetches the title of a YouTube video from its URL using the backend API.
 * This function bypasses CORS issues by using the backend as a proxy.
 * 
 * @param {string} url - The YouTube video URL (supports various formats: watch, live, embed, short links)
 * @returns {Promise<string>} The video title if found, or 'No video just chatting :)' if not found/error
 */
export const fetchYoutubeVideoNameFromUrl = async (url) => {
  // Early return if no URL provided
  if (!url) {
    return 'No video just chatting :)';
  }

  try {
    console.log('Fetching video title for URL:', url);

    // Primary method: Use YouTube's oEmbed API (no API key required) - note this could potentially be deprecated, and require the API key in the future.
    // oEmbed is a format for allowing embedded representation of URLs
    try {
      // Extract the video ID from the URL using helper function
      const videoId = extractVideoIdFromUrl(url);
      if (videoId) {
        const oEmbedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
        console.log('Trying oEmbed fallback:', oEmbedUrl);
        
        const oEmbedResponse = await fetch(oEmbedUrl);
        if (oEmbedResponse.ok) {
          const oEmbedData = await oEmbedResponse.json();
          if (oEmbedData.title) {
            console.log('Title obtained via oEmbed fallback:', oEmbedData.title);
            return oEmbedData.title;
          }
        }
      }
    } catch (oEmbedError) {
      console.warn('oEmbed fallback also failed:', oEmbedError);
    }

    return 'No video just chatting :)';

  } catch (error) {
    console.error('Error fetching video title:', error);
    return 'No video just chatting :)';
  }
};

/**
 * Helper function to extract YouTube video ID from various URL formats.
 * Supports multiple YouTube URL patterns including standard watch URLs,
 * short URLs, embed URLs, and live stream URLs.
 * 
 * @param {string} url - The YouTube URL to parse
 * @returns {string|null} The extracted video ID, or null if not found
 * 
 */
const extractVideoIdFromUrl = (url) => {
  // Return early if no URL provided
  if (!url) return null;
  
  // Array of regex patterns to match different YouTube URL formats
  const patterns = [
    // Matches: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID, youtube.com/live/ID
    // Captures everything after the format identifier until it hits a parameter separator or end
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/live\/)([^&\n?#]+)/,
    
    // Fallback pattern for URLs with v= parameter anywhere in the query string
    // Matches: youtube.com/watch?other_param=value&v=ID or youtube.com/watch?v=ID&other_param=value
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/
  ];
  
  // Try each pattern until we find a match
  for (const pattern of patterns) {
    const match = url.match(pattern);
    
    // If pattern matches and has a captured group, return the video ID
    if (match && match[1]) {
      return match[1];
    }
  }
  
  // No pattern matched - return null
  return null;
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
export const fetchLiveStreamTitle = async (streamId) => {
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

/**
 * @returns an array of all live streams in the Firestore database
 */
export const fetchLiveStreams = async () => {
  const liveStreamsSnapshot = await getDocs(collection(db, 'livestreams'));
  return liveStreamsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

/**
 * Gets video details from firebase cache 
 * @param {string} videoId - The video ID to search for
 * @returns {Object|null} Video document data or null if not found
 */

export const getVideoFromFirebase = async (videoId) => {
  try{
    const videoRef = doc(db, 'livestreams', videoId);
    const videoSnap = await getDoc(videoRef);

    if(videoSnap.exists()) {
      return videoSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching video from Firebase:', error);
    return null;
  }
}