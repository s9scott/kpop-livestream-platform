import React, { useState, useEffect } from 'react';
import ArtistCard from '../components/ArtistCard';
import { GoogleUserSignIn, signOutUser } from '../auth/googleAuth';
import '../styles/pages.css';

const HomePage = () => {
  const [artists, setArtists] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('/api/artists')
      .then(response => response.json())
      .then(data => setArtists(data))
      .catch(error => console.error('Error fetching artists:', error));

    const lastUserData = localStorage.getItem("lastUser");
    if (lastUserData) {
      const lastUser = JSON.parse(lastUserData);
      setUser(lastUser);
    }
  }, []);

  useEffect(() => {
    if (user) {
      document.getElementById("login").textContent = "Sign Out";
      document.getElementById("pfp-img").src = user.photoURL;
      document.getElementById("pfp-img").alt = user.displayName;
      document.getElementById("pfp-name").textContent = user.displayName;
    } else {
      document.getElementById("login").textContent = "Google Login";
      try{
        document.getElementById("pfp-img").src = ''; // Clear the image
        document.getElementById("pfp-name").textContent = ''; // Clear the name
      } catch {
        console.log("Error while resetting photoURL and displayName")
      } 
    }
  }, [user]);

  async function handleSignIn() {
    const response = await GoogleUserSignIn();

    if (response.result === "error") {
      console.log("An error occurred while signing in...");
    } else {
      console.log("Success, user has signed in with Google...");
      const user = response.userInfo;
      if (user) {
        const userInfo = {
          displayName: user.displayName,
          photoURL: user.photoURL
        };
        localStorage.setItem("lastUser", JSON.stringify(userInfo));
        setUser(userInfo);
      } else {
        console.log("Error fetching user information...");
      }
    }
  }

  function handleSignOut() {
    const response = signOutUser();

    if (response === "error") {
      console.log("Error, user not signed out!");
    } else {
      setUser(null);
      localStorage.removeItem("lastUser");
    }
  }

  const buttonClickHandler = user ? handleSignOut : handleSignIn;

  return (
    <div className="home-page">
      <div className="home-header">
        <h1>Featured Artists</h1>
        <div className="header-actions">
          <button onClick={buttonClickHandler} id="login" className="login">Google Login</button>
          {user && (
            <div>
              <img src="" alt="" id="pfp-img" className="pfp"/>
              <p id="pfp-name"></p>
            </div>
          )}
        </div>
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