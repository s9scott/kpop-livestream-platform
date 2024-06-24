import React, { useState, useEffect } from 'react';
import { GoogleUserSignIn, signOutUser } from '../auth/googleAuth';
import '../styles/pages.css';

const LoginHeader = () => {
    const [curUser, setCurUser] = useState(null);

    useEffect(() => {
        const lastUserData = localStorage.getItem("lastUser");
        if (lastUserData) {
            const lastUser = JSON.parse(lastUserData);
            setCurUser(lastUser);
        }
        
        if (curUser) {
            document.getElementById("login").textContent = "Sign Out";
            document.getElementById("pfp-img").src = curUser.photoURL;
            document.getElementById("pfp-img").alt = curUser.displayName;
            document.getElementById("pfp-name").textContent = curUser.displayName;
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
            if (user) {
            const userInfo = {
                displayName: user.displayName,
                photoURL: user.photoURL
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
        <button onClick={buttonClickHandler} id="login" className="login">Google Login</button>
        {curUser && (
          <div>
            <img src="" alt="" id="pfp-img" className="pfp"/>
            <p id="pfp-name"></p>
          </div>
        )}
    </div>
    );

}

export default LoginHeader;