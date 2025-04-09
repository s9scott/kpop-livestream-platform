import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchLiveStreams, fetchLiveStreamTitle, fetchActiveUsersCount } from '../../utils/livestreamsUtils'; // Assuming these functions fetch data from your DB

const LiveStreamsPopup = ({ onClose, setVideoId }) => {
  const [liveStreams, setLiveStreams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStreamsData = async () => {
      try {
        const streams = await fetchLiveStreams();
        const streamsWithDetails = await Promise.all(
          streams.map(async (stream) => {
            const title = await fetchLiveStreamTitle(stream.id);
            const activeUsersCount = await fetchActiveUsersCount(stream.id);
            return { ...stream, title, activeUsersCount };
          })
        );
        setLiveStreams(streamsWithDetails);
      } catch (error) {
        console.error('Error fetching live streams:', error);
      }
    };

    fetchStreamsData();
  }, []);

  const updateVideoId = async (id) => {
    try {
      const stream = liveStreams.find((s) => s.id === id);
      if (stream) {
        const newVideoId = extractVideoId(stream.url);
        if (newVideoId) {
          setVideoId(newVideoId);
          navigate('/load-live');
        } else {
          console.error('Invalid video ID extracted.');
        }
      } else {
        console.error('Stream not found.');
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
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
        <button onClick={onClose} className="text-red-500 hover:text-red-800 float-right">✕</button>
        <h2 className="text-xl font-bold mb-4">Live Streams</h2>
        <div className="max-h-96 overflow-y-auto">
          <ul className="space-y-4">
            {liveStreams.map((stream) => (
              <li key={stream.id} className="flex items-center justify-between bg-gray-100 text-xsm rounded-lg">
                 <div className="text-m font-semibold text-gray-700">{stream.title}</div> {/* Stream title */}
                <div className="flex items-center space-x-4">
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
