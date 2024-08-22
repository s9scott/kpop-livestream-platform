import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLiveStreams, fetchActiveUsersCount, fetchVideoName, getActiveUsers } from '../../utils/firestoreUtils'; // Functions to interact with Firestore
import useActiveUsers from '../../hooks/useActiveUsers'; // Custom hook for active user management

/**
 * LiveStreamsPopup component displays a popup with a list of live streams.
 * @param {Object} props - Component properties.
 * @param {Function} props.onClose - Function to close the popup.
 * @param {Function} props.setVideoId - Function to set the video ID.
 * @returns {JSX.Element} The rendered component.
 */
const LiveStreamsPopup = ({ onClose, setVideoId }) => {
  const [liveStreams, setLiveStreams] = useState([]); // State to store live streams data
  const [numberOfActiveUsers, setNumberOfActiveUsers] = useState(0); // State to store the number of active users
  const navigate = useNavigate(); // Hook for navigation

  /**
   * Fetches live streams and their details when the component mounts.
   */
  useEffect(() => {
    const fetchLiveStreams = async () => {
      const streams = await getLiveStreams(); // Fetch live streams from the database
      
      const streamsWithDetails = await Promise.all(
        streams.map(async (stream) => {
          setNumberOfActiveUsers(0); // Reset active users count for each stream
          const videoTitle = await fetchVideoName(stream.id); // Fetch the video title for the stream
          return {
            ...stream,
            title: videoTitle, // Add video title to the stream object
          };
        })
      );

      setLiveStreams(streamsWithDetails); // Update state with the detailed streams
    };

    fetchLiveStreams(); // Call the function to fetch live streams
  }, []);

  /**
   * Updates the video ID based on the selected stream.
   * @param {string} id - The ID of the selected stream.
   */
  const updateVideoId = async (id) => {
    try {
      // Find the URL associated with the video ID in liveStreams state
      const url = liveStreams.find((stream) => stream.id === id)?.url;
      if (url) {
        const newVideoId = extractVideoId(url); // Extract video ID from the URL
        if (newVideoId) {
          setVideoId(newVideoId); // Update the video ID in the parent component
          if (window.location.hash !== '#/load-live') {
            navigate('/load-live'); // Navigate to the load-live page if not already there
          }
          console.log('Video ID updated to:', newVideoId);
        } else {
          console.error('Extracted video ID is invalid.');
        }
      } else {
        console.log('Video URL is not available');
      }
    } catch (error) {
      console.error('Error updating video ID:', error);
    }
  };

  /**
   * Extracts the video ID from a YouTube URL.
   * @param {string} url - The YouTube video URL.
   * @returns {string|null} The extracted video ID or null if extraction fails.
   */
  const extractVideoId = (url) => {
    const videoId = url.split('v=')[1];
    return videoId ? videoId : null;
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50 text-xsm">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
        <button onClick={onClose} className="text-red-500 hover:text-red-800 float-right">✕</button> {/* Close button */}
        <h2 className="text-xl font-bold mb-4">Live Streams</h2> {/* Popup title */}
        <div className="max-h-96 overflow-y-auto relative text-xsm">
          <ul className="space-y-4">
            {liveStreams.map((stream) => (
              <li key={stream.id} className="flex items-center justify-between bg-gray-100 text-xsm rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="text-m font-semibold text-gray-700">{stream.title}</div> {/* Stream title */}
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-base relative text-xsm text-gray-600 whitespace-nowrap">Active Users: {numberOfActiveUsers}</div> {/* Active users count */}
                  <button
                    onClick={() => updateVideoId(stream.id)}
                    className="text-white bg-blue-500 hover:bg-blue-600 font-medium py-2 px-4 rounded-lg whitespace-nowrap"
                  >
                    Load Video
                  </button> {/* Button to load the selected video */}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LiveStreamsPopup;
