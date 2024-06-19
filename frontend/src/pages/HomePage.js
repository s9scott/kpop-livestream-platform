import React, { useState, useEffect } from 'react';
import ArtistCard from '../components/ArtistCard';
import  GoogleUserSignIn  from '../auth/googleAuth';
import '../styles/pages.css';

const HomePage = () => {
  const [artists, setArtists] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('/api/artists')
      .then(response => response.json())
      .then(data => setArtists(data))
      .catch(error => console.error('Error fetching artists:', error));
  }, []);

  async function handleSignIn() {
    const response = await GoogleUserSignIn();

    if (response.result === "error") {
      console.log("An error occurred while signing in...");
    } else {
      console.log("Success, user has signed in with Google...");
      console.log("response: ", response);
      const user = response.userInfo; // Assuming response.user contains user information
      if (user) {
        console.log("User info: ", user);
        setUser({
          displayName: user.displayName,
          photoURL: user.photoURL
        });
      } else {
        console.log("Error fetching user information...");
      }
    }
  }

  return (
    <div className="home-page">
      <div className="home-header">
        <h1>Featured Artists</h1>
        <button onClick={handleSignIn}>Google Login</button>
        {user && (
          <div>
            <img src={user.photoURL} alt={user.displayName}/>
            <p>{user.displayName}</p>
          </div>
        )}
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
