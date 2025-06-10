//"main" of the react app

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import VideoPlayerPage from './pages/VideoPlayerPage';
import AccountPage from './pages/AccountPage';
import Header from './components/Header/Header';


const App = () => {

  //declaring state variables
  const [user, setUser] = useState(null); //logged in user
  const [videoId, setVideoId] = useState(null); //id of Video currently being displayed
  const [videoUrl, setVideoUrl] = useState(''); //video url in input box in header
  const [activeUsers, setActiveUsers] = useState([]);
  const [invitations, setInvitations] = useState([]); //user invitations
  const [privateChats, setPrivateChats] = useState([]);
  const [selectedPrivateChat, setSelectedPrivateChat] = useState(null);

  //useEffect w/o dependencies, triggers once on initial render of app (not triggered on re-renders)
  useEffect(() => {
    const storedUser = localStorage.getItem('lastUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="app">
      <Header 
      user={user} 
      setUser={setUser} 
      videoId={videoId} 
      setVideoId={setVideoId} 
      videoUrl={videoUrl} 
      setVideoUrl={setVideoUrl} 
      activeUsers={activeUsers} 
      privateChats={privateChats} 
      invitations={invitations} 
      />
      <div className="content">
        <Routes>
          {/*use router to declare pages of website, exact path prevents partial URL matches from going to that route */}
          <Route exact path="/" element={<HomePage />} />
          <Route path="/load-live" element={
          <VideoPlayerPage 
            user={user} 
            videoId={videoId}
            setVideoId={setVideoId}
            activeUsers={activeUsers} 
            setActiveUsers={setActiveUsers}
            privateChats={privateChats} 
            setPrivateChats={setPrivateChats}
            invitations={invitations} 
            setInvitations={setInvitations}
            selectedPrivateChat={selectedPrivateChat}
            setSelectedPrivateChat={setSelectedPrivateChat}
      />
          } />
          <Route path="/account" element={<AccountPage user={user} setUser={setUser} />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
