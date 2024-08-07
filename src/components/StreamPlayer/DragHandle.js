import React from 'react';

const DragHandle = ({ useNativeChat, toggleChat }) => {
  return (
    <div className="drag-handle p-2 border-b border-secondary text-black bg-accent cursor-move">
      Drag Here
      <button onClick={toggleChat} className="toggle-chat-button px-4 py-2 btn btn-secondary hover:btn-accent transform hover:-translate-y-1 hover:scale-110 delay-100 duration-200">
        {useNativeChat ? 'Switch to YouTube Chat' : 'Switch to Native Chat'}
      </button>
    </div>
  );
};

export default DragHandle;
