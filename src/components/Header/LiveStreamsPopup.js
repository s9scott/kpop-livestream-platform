import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLiveStreams, fetchActiveUsersCount, fetchVideoName, getActiveUsers} from '../../utils/firestoreUtils'; // Assuming these functions fetch data from your DB
import useActiveUsers from '../../hooks/useActiveUsers';

const LiveStreamsPopup = ({ onClose, setVideoId }) => {
  const [liveStreams, setLiveStreams] = useState([]);
  const [numberOfActiveUsers, setNumberOfActiveUsers] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLiveStreams = async () => {
      const streams = await getLiveStreams();
      
      const streamsWithDetails = await Promise.all(
        streams.map(async (stream) => {
          setNumberOfActiveUsers(0);
          const videoTitle = await fetchVideoName(stream.id);
          return {
            ...stream,
            title: videoTitle,
          };
          
        })
      );

      setLiveStreams(streamsWithDetails);
    };

    fetchLiveStreams();
  }, []);

  const updateVideoId = async (id) => {
      try {
        //find url associated with the video id in liveStreams varaible
        const url = liveStreams.find((stream) => stream.id === id)?.url;
        if (url) {
          const newVideoId = extractVideoId(url);
          if (newVideoId) {
            setVideoId(newVideoId);
            if (window.location.hash !== '#/load-live') {
              navigate('/load-live');
            } else {
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

  const extractVideoId = (url) => {
    const videoId = url.split('v=')[1];
    return videoId ? videoId : null;
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50 text-xsm">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
        <button onClick={onClose} className="text-red-500 hover:text-red-800 float-right">✕</button>
        <h2 className="text-xl font-bold mb-4">Live Streams</h2>
        <div className="max-h-96 overflow-y-auto relative text-xsm">
          <ul className="space-y-4">
            {liveStreams.map((stream) => (
              <li key={stream.id} className="flex items-center justify-between bg-gray-100 text-xsm rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="text-m font-semibold text-gray-700">{stream.title}</div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-base relative text-xsm text-gray-600 whitespace-nowrap">Active Users: {numberOfActiveUsers}</div>
                  <button
                    onClick={() => updateVideoId(stream.id)}
                    className="text-white bg-blue-500 hover:bg-blue-600 font-medium py-2 px-4 rounded-lg whitespace-nowrap"
                  >
                    Load Video
                  </button>
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
