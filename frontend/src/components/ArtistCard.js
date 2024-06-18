import React from 'react';
import '../styles/ArtistCard.css';

const ArtistCard = ({ artist }) => {
  return (
    <div className="artist-card">
      <h2>{artist.name}</h2>
      <div className="artist-info">
        <img src={artist.photo} alt={artist.name} />
        <p dangerouslySetInnerHTML={{ __html: artist.description }}></p>
        {artist.members.length > 0 && (
          <div className="members">
            <h3>Members:</h3>
            <ul>
              {artist.members.map((member, index) => (
                <li key={index}>{member.name}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="social-media-links">
          {artist.socialMediaLinks.map((link, index) => (
            <a key={index} href={link.url} target="_blank" rel="noopener noreferrer">
              {link.platform}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArtistCard;
