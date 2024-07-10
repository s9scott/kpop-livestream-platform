import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import ArtistPage from './pages/ArtistPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import VideoPlayerPage from './pages/VideoPlayerPage';
import AccountPage from './pages/AccountPage';
import './styles/App.css';
import './styles.css';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('lastUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <Router>
      <div className="app">
        <Sidebar user={user} setUser={setUser} />
        <div className="content">
          <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route path="/artists" element={<ArtistPage />} />
            <Route path="/load-live" element={<VideoPlayerPage user={user} />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/account" element={<AccountPage user={user} setUser={setUser}/> } />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
