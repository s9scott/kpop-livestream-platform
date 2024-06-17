import React from 'react';
import '../styles/ArtistCard.css';

const ArtistCard = ({ artist }) => {
  console.log('Rendering artist card:', artist);

  return (
    <div className="artist-card">
      <img src={artist.photo} alt={artist.name} />
      <h2>{artist.name}</h2>
      <p>{artist.description}</p>
      <div className="social-media-links">
        {artist.socialMediaLinks.map((link, index) => (
          <a key={index} href={link.url} target="_blank" rel="noopener noreferrer">
            {link.platform}
          </a>
        ))}
      </div>
      <div className="new-music">
        <h3>New Music</h3>
        <ul>
          {artist.newMusic.map((music, index) => (
            <li key={index}>
              <a href={music.url} target="_blank" rel="noopener noreferrer">
                {music.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ArtistCard;
