import React from 'react';
import '../styles/pages.css';
import ArtistCard from '../components/ArtistCard';

const ArtistPage = () => {
  const defaultArtist = {
    id: 1,
    name: "Artist Name",
    photo: "https://via.placeholder.com/150",
    description: "This is a default artist description.",
    socialMediaLinks: [
      { platform: "Twitter", url: "https://twitter.com/artist" },
      { platform: "Instagram", url: "https://instagram.com/artist" }
    ],
    newMusic: [
      { title: "New Song 1", url: "https://example.com/new-song-1" },
      { title: "New Song 2", url: "https://example.com/new-song-2" }
    ]
  };

  console.log('Rendering ArtistPage with artist:', defaultArtist);

  return (
    <div className="artist-page">
      <h1>Artists</h1>
      <div className="artist-list">
        <ArtistCard artist={defaultArtist} />
      </div>
    </div>
  );
};

export default ArtistPage;
