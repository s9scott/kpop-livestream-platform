import React, { useState } from "react";
import YouTubeLiveChatOverlay from "./YoutubeLiveChatOverlay";

const LiveChatContainer = ({ chatSrc }) => {
  const [showSummary, setShowSummary] = useState(true);

  return (
    <div className="w-full h-[500px] bg-neutral relative text-white overflow-hidden rounded-xl">
  

      {/* Summary Panel */}
      <div
        className={`absolute top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
          showSummary ? "max-h-64 opacity-100 py-4 px-6" : "max-h-0 opacity-0 py-0 px-6"
        } overflow-hidden`}
      >
        <div className="flex justify-between items-start">
          <YouTubeLiveChatOverlay chatSrc={chatSrc} />
          <button
            onClick={() => setShowSummary(false)}
            className="ml-4 text-white hover:text-red-400 text-2xl font-bold"
            title="Close Summary"
          >
            ×
          </button>
        </div>
      </div>

      {/* Three Dots Toggle Button */}
      {!showSummary && (
        <div className="absolute top-2 right-4 z-40">
          <button
            onClick={() => setShowSummary(true)}
            className="text-white text-xl px-2 hover:text-gray-300"
            title="Show Summary"
          >
            AI Details
          </button>
        </div>
      )}

      {/* Embedded Chat */}
      <div
          className={`transition-all duration-500 ease-in-out relative w-full ${
            showSummary ? "mt-64 h-[calc(100%-16rem)]" : "h-full"
          } overflow-hidden rounded-t-none rounded-b-lg`}
        >
          <iframe
            className="w-full h-full border-0"
            src={chatSrc} //url format diff from emebdding youtube video (even though this uses iframe as well)
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Live Chat"
          />
        </div>
    </div>
  );
};

export default LiveChatContainer;
