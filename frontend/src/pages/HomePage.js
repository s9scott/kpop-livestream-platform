import React, { useState, useEffect } from 'react';
import ArtistCard from '../components/ArtistCard';
import LoginHeader from '../components/LoginHeader';
import '../styles/pages.css';

const HomePage = () => {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    fetch('/api/artists')
      .then(response => response.json())
      .then(data => setArtists(data))
      .catch(error => console.error('Error fetching artists:', error));
  }, []);

  return (
    <div className="home-page">
      <div className="home-header">
        <h1>Featured Artists</h1>
        <LoginHeader/>
      </div>
      <div className="artist-cards-container">
        {artists.map(artist => (
          <ArtistCard key={artist.id} artist={artist} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;