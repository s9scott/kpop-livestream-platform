import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ArtistPage from './pages/ArtistPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import VideoPlayerPage from './pages/VideoPlayerPage';
import AccountPage from './pages/AccountPage';
import Header from './components/Header/Header';
import TestPrivateChatPage from './pages/TestPrivateChatPage';

const App = () => {
  const [user, setUser] = useState(null);
  const [videoId, setVideoId] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('lastUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="app">
      <Header user={user} setUser={setUser} videoId={videoId} setVideoId={setVideoId} videoUrl={videoUrl} setVideoUrl={setVideoUrl} />
      <div className="content">
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route path="/artists" element={<ArtistPage />} />
          <Route path="/load-live" element={<VideoPlayerPage user={user} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/account" element={<AccountPage user={user} setUser={setUser} />} />
          <Route path="/test-private-chat" element={<TestPrivateChatPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
