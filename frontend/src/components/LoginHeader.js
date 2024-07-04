import React, { useState, useEffect } from 'react';
import { GoogleUserSignIn, signOutUser } from '../auth/googleAuth';
import { addUser } from '../firestoreUtils';
import '../styles/pages.css';

//const jsonTokens = require('../tokens.json');

const LoginHeader = () => {
  const [curUser, setCurUser] = useState(null);

  useEffect(() => {
    if (curUser) {
      document.getElementById("login").textContent = "Sign Out";
      document.getElementById("pfp-img").src = curUser.photoURL;
      document.getElementById("pfp-img").alt = "Profile Photo";
      document.getElementById("pfp-name").textContent = curUser.displayName;
    } else {
      document.getElementById("login").textContent = "Google Login";
    }
  }, [curUser]);

  useEffect(() => {
    const lastUserData = localStorage.getItem("lastUser");
    if (lastUserData && !curUser) {
      const lastUser = JSON.parse(lastUserData);
      setCurUser(lastUser);
      return;
    }
  }, [curUser]);

  async function handleAuthorizeClick() {
    try {
      window.location.href = 'http://localhost:3001/authorize';
    } catch (error) {
      console.error('Error authorizing:', error);
    }
  }

  async function handleSignIn() {
    const response = await GoogleUserSignIn();
    if (response.result === "error") {
      console.log("An error occurred while signing in...");
    } else {
      console.log("Success, user has signed in with Google...");
      const user = response.userInfo;
      if (user) {
        await addUser(user);
        const userInfo = {
          displayName: user.displayName,
          photoURL: user.photoURL,
          uid: user.uid
        };
        localStorage.setItem("lastUser", JSON.stringify(userInfo));
        setCurUser(userInfo);
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
      setCurUser(null);
      localStorage.removeItem("lastUser");
    }
  }

  const buttonClickHandler = curUser ? handleSignOut : handleSignIn;

  return (
    <div className="header-actions">
      {curUser && (
        <div>
          <button onClick={handleAuthorizeClick} id='authBtn' className='home-auth'>Authorize YouTube Access</button>
          <img src="" alt="" id="pfp-img" className="pfp"/>
          <p id="pfp-name"></p>
        </div>
      )}
      <button onClick={buttonClickHandler} id="login" className="login" >Google Login</button>
    </div>
  );
}

export default LoginHeader;