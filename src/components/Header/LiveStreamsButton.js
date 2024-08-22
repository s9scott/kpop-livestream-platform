import React, { useState } from 'react';
import LiveStreamsPopup from './LiveStreamsPopup';

/**
 * Button component to view live streams. It toggles the display of the LiveStreamsPopup.
 *
 * @param {Object} props - The component properties.
 * @param {Function} props.setVideoId - Function to set the video ID.
 * @returns {JSX.Element} The rendered component.
 */
const LiveStreamsButton = ({ setVideoId }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  /**
   * Toggles the visibility of the LiveStreamsPopup.
   */
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  return (
    <div>
      <button onClick={togglePopup} className="btn-primary px-4 py-2 text-primary rounded">
        View Live Streams
      </button>
      {isPopupOpen && <LiveStreamsPopup onClose={togglePopup} setVideoId={setVideoId} />}
    </div>
  );
};

export default LiveStreamsButton;
