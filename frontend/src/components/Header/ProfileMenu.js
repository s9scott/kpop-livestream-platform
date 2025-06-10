/**
 * @file ProfileMenu.js
 * @author Paola Bustos, Simon Tenedero, Jonas Matulis
 * @created 2024-XX-XX
 * @lastModified 2025-06-01
 * @desc file containing ProfileMenu.js
 */

import React, { useState, useEffect } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { GoogleUserSignIn, signOutUser } from '../../auth/googleAuth'; // Authentication functions
import { logWebsiteUsage} from '../../utils/livestreamsUtils';
import { addUser, fetchUserInfo } from '../../utils/usersUtils'
import { NavLink } from 'react-router-dom'; // React Router component for navigation
import './styles/ProfileMenu.css'; // Custom CSS for ProfileMenu component

/**
 * Menu that appears when profile is clicked on right side of navbar. displays user login/logout functionality and user profile menu.
 * @param {Object} props - Component properties.
 * @param {Object} props.user - Current user information.
 * @param {Function} props.setUser - Function to update user information.
 * @returns {JSX.Element} The rendered component.
 */
const ProfileMenu = ({ user, setUser }) => {

  // Definimos las clases como constantes para no repetir tanto
  const linkBaseClass = "block px-4 py-3 text-white transition-colors duration-200 text-sm";
  const hoverClass = "hover:bg-primary";

  const [curUser, setCurUser] = useState(user); // State to store the current user
  const [loginTime, setLoginTime] = useState(null); // State to store the login time for session tracking

  useEffect(() => {
    const lastUserData = localStorage.getItem("lastUser");
    if (lastUserData && !curUser) { //check that there is no current user logged in
      const lastUser = JSON.parse(lastUserData);
      setCurUser(lastUser);
      setUser(lastUser);
    }
  }, [curUser, setUser]); // Effect runs when curUser or setUser changes

  /**
   * Handles user sign-in with Google authentication.
   */
  async function handleSignIn() {
    const response = await GoogleUserSignIn(); // Trigger Google sign-in
    if (response.result === "error") {
      console.log("An error occurred while signing in...");
    } else {
      const user = response.userInfo;
      if (user) {
        try {
          console.log("Fetching user...");
          const login = await fetchUserInfo(user.uid); // Fetch user info from Firestore
          if (login) {
            const userInfo = {
              username: login.username,
              displayName: login.displayName,
              photoURL: login.photoURL,
              profilePicture: login.profilePicture,
              uid: user.uid,
              email: user.email
            };
            setCurUser(userInfo);
            setUser(userInfo);
            localStorage.setItem("lastUser", JSON.stringify(userInfo)); // Save user info to local storage
          } else {
            console.log("No user info to fetch, creating new user...");
            const userInfo = {
              username: user.displayName,
              displayName: user.displayName,
              photoURL: user.photoURL,
              profilePicture: user.photoURL,
              uid: user.uid,
              email: user.email
            };
            await addUser(userInfo); // Add new user to Firestore
            localStorage.setItem("lastUser", JSON.stringify(userInfo)); // Save new user info to local storage
            setCurUser(userInfo);
            setUser(userInfo);
          }

          setLoginTime(new Date())
          logWebsiteUsage(user.uid, `User logged in at ${loginTime.toUTCString()}`)
        } catch (error) {
          console.log("An error occurred, trying to fetch user info: ", error);
        }
      }
    }
  }

  /**
   * Handles user sign-out and updates the UI accordingly.
   */
  function handleSignOut() {
    const response = signOutUser(); // Trigger sign-out
    if (response === "error") {
      console.log("Error, user not signed out!");
    
    } else {
      setCurUser(null);
      setUser(null);
      localStorage.removeItem("lastUser"); // Remove user info from local storage
      const logoutTime = new Date() 
      logWebsiteUsage(user.uid, `User logged out at ${logoutTime.toUTCString()}, with a session time of ${( (logoutTime.getTime() - loginTime.getTime() ) / (1000  * 60) ) } minutes.`)
    }
  }

  return (

    <div className="relative text-xsm">
      {curUser ? (
        <Menu as="div" className="relative inline-block text-left">
          {({ open }) => (
            <>
              <MenuButton className="mr-5">
                <div className='flex items-center'>
                  <img
                    alt="User Avatar"
                    src={curUser.photoURL || curUser.profilePicture}
                    className="rounded-full w-10 h-10"
                  />
                </div>
              </MenuButton>

              {open && (

              <MenuItems
                transition
                className="absolute top-full right-3 w-52 bg-base-300 text-white shadow-xl rounded-xl"
              >
                <MenuItem>
                  {({ active }) => (
                    <NavLink
                      to="/account"
                      className={({ isActive }) =>
                        `rounded-t-xl ${linkBaseClass} ${hoverClass} ${isActive ? 'bg-primary' : ''}`
                      }
                    >
                      Profile
                    </NavLink>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ active }) => (
                    <NavLink
                      to="/settings"
                      className={({ isActive }) =>
                        `${linkBaseClass} ${hoverClass} ${isActive ? 'bg-primary' : ''}`
                      }
                    >
                      Settings
                    </NavLink>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ active }) => (
                    <button
                      onClick={handleSignOut}
                      className={`rounded-b-xl text-left w-full ${linkBaseClass} ${hoverClass}`
                      }
                    >
                      Logout
                    </button>
                  )}
                </MenuItem>
              </MenuItems>)}
            </>
          )}
        </Menu>) 
      : (
        <button onClick={handleSignIn} id="login" className="whitespace-nopwrap truncate mr-2 btn btn-secondary text-xsm hover:btn-accent px-4">
          Google Login
        </button>
      )}
    </div>
  );
};

export default ProfileMenu;
