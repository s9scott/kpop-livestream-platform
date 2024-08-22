import React from 'react';

/**
 * @param isOpen, onClose, children
 * What they are?
 * isOpen: Boolean to determine if the popup is open
 * onClose: Function to close the popup
 * children: The content to display inside the popup
 * @returns Popup
 * 
 * This component displays a popup modal with the specified content.
 * The popup is displayed when the isOpen prop is set to true.
 * The onClose function is called when the close button is clicked.
 * The children prop is used to render the content inside the popup.
 * 
*/

const Popup = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null; // If the popup is not open, do not render anything

  // Render the popup with the specified content
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">✕</button>
        {children}
      </div>
    </div>
  );
};

export default Popup;