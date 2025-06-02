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
      <button onClick={togglePopup} className="whitespace-nowrap bg-primary text-white px-5 py-1 mr-5 rounded-lg text-sm hover:bg-red-600 transition duration-200 ease-in-out shadow-md">
        invite users
      </button>
      {isPopupOpen && <LiveStreamsPopup onClose={togglePopup} setVideoId={setVideoId} />}
    </div>
  );
};

export default LiveStreamsButton;
