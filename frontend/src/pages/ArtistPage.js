import React, { useState, useEffect } from 'react';
import '../styles/ArtistPage.css';
import ArtistCard from '../components/ArtistCard';

const ArtistPage = () => {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/artists');
        const data = await response.json();
        setArtists(data);
      } catch (error) {
        console.error('Error fetching artists:', error);
      }
    };

    fetchArtists();
  }, []);

  return (
    <div className="artist-page">
      <h1>K-pop Artists</h1>
      <div className="artist-list">
        {artists.length > 0 ? (
          artists.map((artist, index) => (
            <ArtistCard key={index} artist={artist} />
          ))
        ) : (
          <p>Loading artists...</p>
        )}
      </div>
    </div>
  );
};

export default ArtistPage;
