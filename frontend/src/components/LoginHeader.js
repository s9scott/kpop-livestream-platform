import React, { useState, useEffect } from 'react';
import { GoogleUserSignIn, signOutUser } from '../auth/googleAuth';
import { addUser } from '../firestoreUtils';
import '../styles/pages.css';

const LoginHeader = ({ user, setUser }) => {
  const [curUser, setCurUser] = useState(user);

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
      setUser(lastUser);  // Update the parent state
      return;
    }
  }, [curUser, setUser]);

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
        setUser(userInfo);  // Update the parent state
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
          <img src="" alt="" id="pfp-img" className="pfp"/>
          <p id="pfp-name"></p>
          <button onClick={() => window.location.href="/account/"} >
            <img src="../assets/pfp-placeholder.jpg"
                alt = "Profile"  
                id='account-btn' 
                className='account-btn'
            />
          </button>
        </div>
      )}
    </div>
  );
};

export default LoginHeader;
