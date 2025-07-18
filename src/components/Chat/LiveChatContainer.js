import React from "react";

const LiveChatContainer = ({ chatSrc }) => {

  return (
    <div className="w-full h-[500px] bg-neutral relative text-white overflow-hidden rounded-xl">
  
      <div
          className={`transition-all duration-500 ease-in-out relative w-full ${
            "h-full"
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
