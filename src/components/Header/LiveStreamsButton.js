import React, { useState } from 'react';
import LiveStreamsPopup from './LiveStreamsPopup';

const LiveStreamsButton = ({setVideoId}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  return (
    <div>
      <button onClick={togglePopup} className="btn-primary px-4 py-2 text-primary rounded">
        View Live Streams
      </button>
      {isPopupOpen && <LiveStreamsPopup onClose={togglePopup} setVideoId={setVideoId}/>}
    </div>
  );
};

export default LiveStreamsButton;
