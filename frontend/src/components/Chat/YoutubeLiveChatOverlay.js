import React, { useState, useEffect } from "react";

//this is the AI summary portion above the chat

const YouTubeLiveChatOverlay = ({ chatSrc }) => {
  const [overlayText, setOverlayText] = useState("");
  const [topics, setTopics] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [topicParagraph, setTopicParagraph] = useState("");
  const [languageParagraph, setLanguageParagraph] = useState("");

  const parseLabelEmojiPairs = (input) => {
    const regex = /"([^"]+)"\s+([\p{Emoji_Presentation}\p{Extended_Pictographic}]{1,2})/gu;
    const matches = [...input.matchAll(regex)];
    return matches.map((match) => ({
      label: match[1],
      emoji: match[2],
    }));
  };

  const updateOverlayText = async (chatSrc) => {
    try {
      {/* 
      const response = await fetch("http://localhost:8080/api/getVideoAnalysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatSrc }),
      });

      if(!response.ok) {
        throw new Error("API call failed");
      }
      
      const data = await response.json();

      setOverlayText(data.summary || "");
      setTopicParagraph(data.topics || "");
      setLanguageParagraph(data.languages || "");

      console.log("Analysis data", data);
      setLanguages(parseLabelEmojiPairs(data.languages || ""));
      setTopics(parseLabelEmojiPairs(data.topics || ""));
      */}

      
      const [summaryRes, topicRes, languageRes] = await Promise.all([
        fetch("http://localhost:8080/api/summarize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chatSrc }),
        }),
        fetch("http://localhost:8080/api/topicModel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chatSrc }),
        }),
        fetch("http://localhost:8080/api/getLanguages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chatSrc }),
        }),
      ]);

      if (!summaryRes.ok || !topicRes.ok || !languageRes.ok) {
        throw new Error("One or more API calls failed");
      }

      const summaryData = await summaryRes.json();
      const topicData = await topicRes.json();
      const languageData = await languageRes.json();
      

      setOverlayText(summaryData.summary || "");
      setTopicParagraph(topicData.topics || "");
      setLanguageParagraph(languageData.languages || "");

      console.log("languageData", languageData.languages);
      setLanguages(parseLabelEmojiPairs(languageData.languages || ""));
      setTopics(parseLabelEmojiPairs(topicData.topics || ""));
      
      
    } catch (error) {
      console.error("Error updating overlay text:", error);
      setOverlayText("Error: Could not load summary.");
      setTopics([]);
      setLanguages([]);
    }
  };

  useEffect(() => {
    updateOverlayText(chatSrc);
    const interval = setInterval(() => {
      updateOverlayText(chatSrc);
    }, 30000);
    return () => clearInterval(interval);
  }, [chatSrc]);

  return (
    <div className="w-full h-full max-h-[700px] scrollable-y space-y-4 text-white pt-0 pl-2 pr-2 pb-24">

    <div className="flex gap-8 mt-4 overflow-auto">
      {/* Topics - more space */}
      <div className="flex-[2] overflow-auto pr-0">
        <h3 className="text-md font-semibold mb-2">Topics:</h3>
        {topics.length ? (
          <ul className="text-sm space-y-1 pl-0 list-none">
            {topics.map((t, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="text-xl">{t.emoji}</span>
                <span>{t.label}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-base">No topics found</p>
        )}
      </div>
  
      {/* Languages - slightly less space */}
      <div className="flex-1 max-h-[500px] overflow-y-auto pr-4">
        <h3 className="text-md font-semibold mb-2">Languages:</h3>
        {languages.length ? (
          <ul className="text-sm space-y-2 pl-0 list-none">
            {languages.map((l, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <span className="text-xl">{l.emoji}</span>
                <span>{l.label}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-base">No languages found</p>
        )}
      </div>
    </div>
  </div>  
  );
};

export default YouTubeLiveChatOverlay;
