/**
 * @file PrivateChat.js
 * @author Simon Tenedero, Jonas Matulis
 * @created 2024-XX-XX
 * @lastModified 2025-06-11
 * @description file containing PrivateChat component
 */

import { React, useState, useRef, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import Messages from "../Chat/Messages";
import ChatInputForm from "../Chat/ChatInputForm";
import UserInfoModal from '../Chat/UserInfoModal';
import {
  fetchPrivateChatName,
  fetchPrivateChatMessages,
  sendPrivateChatMessage,
  fetchPrivateChatVideoTitle,
  fetchPrivateChatVideoId,
} from "../../utils/privateChatUtils";
import { useUser } from "../../context/UserContext";

/**
 * This component displays the private chat room for a specific private chat.
 * It fetches and displays the messages in the chat room.
 * It allows users to send messages, mention other users, and view user information.
 * It also displays the active users in the chat room.
 * When a user is mentioned, a dropdown with user suggestions is displayed.
 * When a user is clicked, a modal with user information is displayed.
 * When the video ID is updated, the video being watched is updated in the chat room.
 * When the private users modal is toggled, the modal is displayed or hidden.
 *
 * @param {Object} props - The component properties
 * @param {string} props.privateChatId - The ID of the private chat room
 * @param {string} props.videoId - The ID of the video being watched in the chat room
 * @param {Function} props.updateVideoId - Function to update the video ID  in the chat room
 * @param {Function} props.togglePrivateUsersModal - Function to toggle private users modal.
 * @param {Array} props.privateChatMembers - Array of private chat members, each member is an array containing user object and status (accepted, pending, etc.)
 * @param {Function} props.setSelectedTab - Function to set the selected tab (youtube, native, private)
 * @param {Function} props.setSelectedPrivateChat - Function to set the selected private chat
 *
 * @returns {JSX.Element} The PrivateChat component.
 */
const PrivateChat = ({
  privateChatId,
  videoId,
  updateVideoId,
  togglePrivateUsersModal,
  privateChatMembers,
  setSelectedTab,
  setSelectedPrivateChat,
}) => {
  const [messages, setMessages] = useState([]); // State variable for the messages in the chat
  const [input, setInput] = useState(""); // State variable for the input message
  const [showOptions, setShowOptions] = useState({}); // State variable for the user options modal
  const [selectedUser, setSelectedUser] = useState(null); // State variable for the selected user
  const [mentionDropdown, setMentionDropdown] = useState([]); // State variable for the mention dropdown - holds the filtered users whose display name matches the input
  const messagesEndRef = useRef(null); // Reference to the end of the messages container -> NOTE: useRef() create a mutable object to persist across renders
  const [videoTitle, setVideoTitle] = useState(""); // State variable for the video title
  const [isPopupOpen, setIsPopupOpen] = useState(true); // State variable for the popup
  const [privateChatVideoId, setPrivateChatVideoId] = useState(null); // State variable for the video ID
  const [privateChatName, setPrivateChatName] = useState("");

  const { user } = useUser();

  // Fetch messages, video title, and video ID when the component mounts
  useEffect(() => {
    const fetchVideoId = async () => {
      if (privateChatId) {
        const videoId = await fetchPrivateChatVideoId(privateChatId);
        console.log("Fetched Video ID:", videoId);
        setPrivateChatVideoId(videoId);
      }
    };

    const fetchChatName = async () => {
      if (privateChatId) {
        const chatName = await fetchPrivateChatName(privateChatId);
        setPrivateChatName(chatName);
      }
    };

    const fetchChatMembers = async () => {
      if (privateChatId) {
        setMentionDropdown(privateChatMembers);
      }
    };

    if (privateChatId) {
      const unsubscribeMessages = fetchPrivateChatMessages(
        privateChatId,
        setMessages,
      );
      const unsubscribeVideoTitle = fetchPrivateChatVideoTitle(
        privateChatId,
        setVideoTitle,
      );
      fetchVideoId();
      fetchChatName();
      fetchChatMembers();

      return () => {
        unsubscribeMessages();
        unsubscribeVideoTitle();
      };
    }
  }, [privateChatId]);

  // Scroll to the bottom of the messages container when new messages are added
  const handleSendClick = async (e) => {
    e.preventDefault(); //prevent reloading page on click
    await sendPrivateChatMessage(privateChatId, user, input, setInput);
  };

  // Format the timestamp to display the time
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Toggle the user options modal
  /*
  const toggleOptions = (index) => {
    setShowOptions((prev) => ({ ...prev, [index]: !prev[index] })); //take the key 'index' that exists in prev, and flip its value (if its true, it'll now be false)
  };*/

  // Close the user options modal when clicking outside of it
  const handleClickOutside = (event) => {
    if (!event.target.closest(".options-menu")) {
      //.closest() checks if clicked elem or it's parent has class 'options-menu'
      setShowOptions({});
    }
  };

  // Handle the mention dropdown
  const handleSeeAccountInfo = async (uid) => {
    if (!uid) return;
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setSelectedUser(userSnap.data());
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  // Handle the mention dropdown
  const handleRemoveMessage = (index) => {
    setMessages((prevMessages) => prevMessages.filter((_, i) => i !== index)); //_ is a placeholder for the actual elem, i is the index elem - similar to start,step,stop. to access index, we need to have elem
  };

  // handle changing input content, tracks for @ to filter dropdown users
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);

    if (value.includes("@")) {
      const mentionPart = value.split("@").pop().toLowerCase();

      if (mentionPart) {
        //filter for only members that accepted invitation, then only return the members
        const filteredUsers = privateChatMembers.filter((user) =>
          user.username.toLowerCase().includes(mentionPart.toLowerCase()),
        );
        setMentionDropdown(filteredUsers);
      } else {
        setMentionDropdown([]);
      }
    } else {
      setMentionDropdown([]);
    }
  };

  // Handle the mention dropdown
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Handle the mention dropdown
  return (
    <div className="flex flex-col w-full h-full">
      <div className="px-4 py-2 rounded-lg shadow-lg z-50 text-center items-center ">
        <div className="mt-2 flex items-center mb-1 w-full">
          <button
            onClick={() => {
              setSelectedPrivateChat(null);
              setSelectedTab("privateTab");
            }}
          >
            ←
          </button>
          <h2 className="w-[125px] md:w-[150px] lg:w-[200px] mx-auto font-semibold text-base md:text-lg whitespace-nowrap overflow-hidden text-ellipsis block">
            {privateChatName}
          </h2>
          <button className="text-sm">settings</button>
        </div>

        <div className="flex flex-wrap items-center justify-around">
          <p className="w-full md:w-3/4 whitespace-nowrap overflow-hidden text-ellipsis block text-sm">
            {videoTitle}
          </p>
          {videoId !== privateChatVideoId && privateChatVideoId !== null && (
            <button
              onClick={() => updateVideoId(privateChatId)}
              className="mt-2 px-3 py-1 text-sm text-white bg-primary rounded hover:bg-accent"
            >
              load video
            </button>
          )}
        </div>
      </div>

      <div className="flex-grow overflow-y-auto">
        <Messages
          privacyLevel="private"
          chatId={privateChatId}
          messages={messages}
          formatTimestamp={formatTimestamp}
          handleSeeAccountInfo={handleSeeAccountInfo}
          handleRemoveMessage={handleRemoveMessage}
          isPopupOpen={isPopupOpen}
          setIsPopupOpen={setIsPopupOpen}
        />
        <div ref={messagesEndRef} />
      </div>
      <ChatInputForm
        input={input}
        handleInputChange={handleInputChange}
        handleSendClick={handleSendClick}
        mentionDropdown={mentionDropdown}
        toggleUsersModal={togglePrivateUsersModal}
      />
      <UserInfoModal
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
      />
    </div>
  );
};

export default PrivateChat;
