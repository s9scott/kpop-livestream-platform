import React, { useState, useEffect } from 'react';
import '../styles/ArtistPage.css';
import ArtistCard from '../components/ArtistCard';

const ArtistPage = () => {
  // State variables to manage artists, loading state, and errors
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect to fetch artist data when the component mounts
  useEffect(() => {
    // Function to fetch artist data from the backend API
    const fetchArtists = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/artists');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Fetched artists:', data); // Debug log

        // Set the fetched artists in the state
        setArtists(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching artists:', error); // Error log
        setError(error);
        setLoading(false);
      }
    };

    // Call the fetchArtists function
    fetchArtists();
  }, []); // Empty dependency array means this effect runs once on mount

  // Render loading state
  if (loading) {
    return <p>Loading artists...</p>;
  }

  // Render error state
  if (error) {
    return <p>Error loading artists: {error.message}</p>;
  }

  // Determine what to render based on the number of artists
  let content;
  if (artists.length > 0) {
    content = artists.map((artist, index) => {
      return <ArtistCard key={index} artist={artist} />;
    });
  } else {
    content = <p>No artists found.</p>;
  }

  // Render the list of artists or a no artists message
  return (
    <div className="artist-page">
      <h1>K-pop Artists</h1>
      <div className="artist-list">
        {content}
      </div>
    </div>
  );
};

export default ArtistPage;