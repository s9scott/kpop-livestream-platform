//"main" of the react app

import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import VideoPlayerPage from './pages/VideoPlayerPage';
import Header from './components/Header/Header';
import { useUser } from './context/UserContext';

const App = () => {

  //declaring state variables
  const [videoId, setVideoId] = useState(null); //id of Video currently being displayed
  const [videoUrl, setVideoUrl] = useState(''); //video url in input box in header
  const [activeUsers, setActiveUsers] = useState([]);
  const [invitations, setInvitations] = useState([]); //user invitations
  const [privateChats, setPrivateChats] = useState([]);
  const [selectedPrivateChat, setSelectedPrivateChat] = useState(null);
  
  return (
    <div className="app">
      <Header 
      videoId={videoId} 
      setVideoId={setVideoId} 
      videoUrl={videoUrl} 
      setVideoUrl={setVideoUrl} 
      />
      <div className="content bg-gradient-to-t from-base-300 via-base-200 to-base-100 min-h-screen">
        <Routes>
          {/*use router to declare pages of website, exact path prevents partial URL matches from going to that route */}
          <Route exact path="/" element={<HomePage />} />
          <Route path="/load-live" 
            element={
              <VideoPlayerPage 
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
            } 
          />
        </Routes>
      </div>
    </div>
  );
  
};

export default App;

