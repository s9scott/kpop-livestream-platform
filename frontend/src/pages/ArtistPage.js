import React, { useState, useEffect } from 'react';
import '../styles/ArtistPage.css';
import ArtistCard from '../components/ArtistCard';

const ArtistPage = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/artists');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Fetched artists:', data); // Debug log
        setArtists(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching artists:', error); // Error log
        setError(error);
        setLoading(false);
      }
    };

    fetchArtists();
  }, []);

  if (loading) {
    return <p>Loading artists...</p>;
  }

  if (error) {
    return <p>Error loading artists: {error.message}</p>;
  }

  return (
    <div className="artist-page">
      <h1 className="title">Trending K-Pop Artists</h1>
      <div className="artist-list">
        {artists.length > 0 ? (
          artists.map((artist, index) => (
            <ArtistCard key={index} artist={artist} />
          ))
        ) : (
          <p>No artists found.</p>
        )}
      </div>
    </div>
  );
};

export default ArtistPage;
