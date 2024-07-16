import React, { useState, useEffect } from 'react';
import { GoogleUserSignIn, signOutUser } from '../auth/googleAuth';
import { addUser, fetchUserInfo } from '../utils/firestoreUtils';
import pfp from '../assets/pfp-placeholder.jpg';
import '../styles/pages.css';

const LoginHeader = ({ user, setUser }) => {
  const [curUser, setCurUser] = useState(user);

  useEffect(() => {
    if (curUser) {
      document.getElementById("login").textContent = "Sign Out";
    } else {
      document.getElementById("login").textContent = "Google Login";
    }
  }, [curUser]);

  async function handleSignIn() {
    const response = await GoogleUserSignIn();
    if (response.result === "error") {
      console.log("An error occurred while signing in...");
    } else {
      console.log("Success, user has signed in with Google...");
      const user = response.userInfo;
      if (!user) {
        console.log("")
        await addUser(user);
        const userInfo = {
          username: user.username,
          displayName: user.displayName,
          photoURL: user.photoURL,
          profilePicture: user.profilePicture,
          uid: user.uid
        };
        localStorage.setItem("lastUser", JSON.stringify(userInfo));
        setCurUser(userInfo);
        setUser(userInfo);  // Update the parent state
      } else {
        const login = await fetchUserInfo(user.uid);
        const userInfo = {
          username: login.username,
          displayName: login.displayName,
          photoURL: login.photoURL,
          profilePicture: login.profilePicture,
          uid: user.uid
        };
        setCurUser(userInfo);
        setUser(userInfo);
        localStorage.setItem("lastUser", JSON.stringify(userInfo));
        console.log("Fetching existing user...");
      }
    }
  }

  function handleSignOut() {
    const response = signOutUser();
    if (response === "error") {
      console.log("Error, user not signed out!");
    } else {
      setCurUser(null);
      setUser(null);  // Update the parent state
      localStorage.removeItem("lastUser");
    }
  }

  const buttonClickHandler = curUser ? handleSignOut : handleSignIn;

  return (
    <div className="header-actions">
      <button onClick={buttonClickHandler} id="login" className="login">
        {curUser ? "Sign Out" : "Google Login"}
      </button>
      {curUser && (
        <div>
          <img src={user.photoURL || user.profilePicture} alt="" id="pfp-img" className="pfp"/>
          <p id="pfp-name">{user.displayName || user.username}</p>
          <div className='account-btn'>
            <button onClick={() => window.location.href="/account/"} >
              <img src={pfp}
                  alt = "Profile"  
                  id='account-btn' 
                  className='account-pic'
              /> Account
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginHeader;
