import React, { useState, useEffect } from 'react';
import DraggableResizable from './DraggableResizable';
import NativeChat from './NativeChat';
import { collection, onSnapshot, query, where, doc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import '../styles/SwitchableChat.css';

const SwitchableChat = ({ videoId, settings, onResizeStop, onDragStop, user }) => {
  const [useNativeChat, setUseNativeChat] = useState(false);
  const [activeUsers, setActiveUsers] = useState([]);
  const [isActiveUsersModalOpen, setIsActiveUsersModalOpen] = useState(false);

  console.log('SwitchableChat.js: user:', user);

  useEffect(() => {
    const fetchActiveUsers = async () => {
      const now = Timestamp.now();
      const fiveMinutesAgo = new Timestamp(now.seconds - 300, now.nanoseconds); // 300 seconds = 5 minutes

      const q = query(
        collection(db, 'livestreams', videoId, 'messages'),
        where('timestamp', '>=', fiveMinutesAgo)
      );

      const unsubscribe = onSnapshot(q, async (snapshot) => {
        const userIds = new Set();
        snapshot.forEach((doc) => {
          userIds.add(doc.data().authorUid);
        });

        const activeUserPromises = Array.from(userIds).map(async (uid) => {
          const userRef = doc(db, 'users', uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            return userSnap.data();
          }
          return null;
        });

        Promise.all(activeUserPromises).then((users) => {
          setActiveUsers(users.filter((user) => user !== null));
        });
      });

      return () => unsubscribe();
    };

    fetchActiveUsers();
  }, [videoId]);

  const toggleChat = () => {
    setUseNativeChat((prev) => !prev);
  };

  const toggleActiveUsersModal = () => {
    setIsActiveUsersModalOpen((prev) => !prev);
  };

  const chatSrc = `https://www.youtube.com/live_chat?v=${videoId}&embed_domain=localhost`;

  return (
    <DraggableResizable
      defaultWidth={settings.width}
      defaultHeight={settings.height}
      defaultX={settings.x}
      defaultY={settings.y}
      onResizeStop={onResizeStop}
      onDragStop={onDragStop}
    >
      <div className="switchable-chat-container" style={{ width: '100%', height: '100%', position: 'relative' }}>
        <div className="chat-toggle">
          <button onClick={toggleActiveUsersModal} className="active-users-button">
            Active Users
          </button>
          <button onClick={toggleChat} className="toggle-chat-button">
            {useNativeChat ? 'Switch to YouTube Chat' : 'Switch to Native Chat'}
          </button>
        </div>
        <div className="chat-content" style={{ width: '100%', height: '100%' }}>
          {useNativeChat ? (
            <NativeChat
              videoId={videoId}
              settings={settings}
              onResizeStop={onResizeStop}
              onDragStop={onDragStop}
              user={user} // Pass user to NativeChat
            />
          ) : (
            <iframe
              width="100%"
              height="100%"
              src={chatSrc}
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Live Chat"
            ></iframe>
          )}
        </div>

        {isActiveUsersModalOpen && (
          <div className="active-users-modal">
            <div className="modal-content">
              <span className="close" onClick={toggleActiveUsersModal}>&times;</span>
              <h2>Active Users</h2>
              <ul>
                {activeUsers.map((activeUser, index) => (
                  <li key={index}>{activeUser.displayName}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </DraggableResizable>
  );
};

export default SwitchableChat;
