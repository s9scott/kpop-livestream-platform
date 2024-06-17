import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ArtistPage from './pages/ArtistPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import VideoPlayerPage from './pages/VideoPlayerPage';
import './styles/App.css';
import './styles.css';

const App = () => {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route path="/artists" element={<ArtistPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/video" element={<VideoPlayerPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
