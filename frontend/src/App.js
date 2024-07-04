// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import ArtistPage from './pages/ArtistPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import VideoPlayerPage from './pages/VideoPlayerPage';
import LoginHeader from './components/LoginHeader';
import './styles/App.css';
import './styles.css';

const App = () => {
  const [userId, setUserId] = useState(null);

  return (
    <Router>
      <div className="app">
        <Sidebar />
        <div className="content">
          <div className='home-header'>
            <LoginHeader />
          </div>
          <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route path="/artists" element={<ArtistPage />} />
            <Route path="/load-live" element={<VideoPlayerPage userId={userId} />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
