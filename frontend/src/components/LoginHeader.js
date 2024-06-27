import React, { useState, useEffect } from 'react';
import { GoogleUserSignIn, signOutUser } from '../auth/googleAuth';
import authUrl from '../auth/authConfig'
import '../styles/pages.css';

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

    const getYouTubeSubscriptions = async (accessToken) => {
        const response = await fetch('https://www.googleapis.com/youtube/v3/subscriptions?part=snippet&mine=true', {
            headers: {
            Authorization: `Bearer ${accessToken}`,
            },
        });
        const data = await response.json();
        return data;
    };

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
                console.log("Error fetching user information...",);
            }
        }

        //window.location.href = authUrl;

        if (response.token) {
            const subscriptions = await getYouTubeSubscriptions(response.token);
            console.log(subscriptions);
        } else {
            console.log("Access token invalid")
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
            <p id="pfp-name" ></p>
          </div>
        )}
    </div>
    );

}

export default LoginHeader;