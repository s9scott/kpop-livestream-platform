import React, { useState, useEffect } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { GoogleUserSignIn, signOutUser } from '../../auth/googleAuth'; // Authentication functions
import {addUser, fetchUserInfo} from '../../utils/usersUtils';
import { NavLink } from 'react-router-dom'; // React Router component for navigation
import './styles/LoginHeader.css'; // Custom CSS for LoginHeader component

/**
 * LoginHeader component displays user login/logout functionality and user profile menu.
 * @param {Object} props - Component properties.
 * @param {Object} props.user - Current user information.
 * @param {Function} props.setUser - Function to update user information.
 * @returns {JSX.Element} The rendered component.
 */
const LoginHeader = ({ user, setUser }) => {
  const [curUser, setCurUser] = useState(user); // State to store the current user

  useEffect(() => {
    const lastUserData = localStorage.getItem("lastUser");
    if (lastUserData && !curUser) {
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
    }
  }

  return (
    <div className="relative text-xsm">
      {curUser ? (
        <Menu as="div" className="relative inline-block text-left z-[1001]">
          <MenuButton className="btn btn-secondary relative text-xsm btn-md rounded-md bg-secondary font-semibold shadow-sm hover:btn-accent transform hover:scale-110 hover:-translate-y-1 duration-200 delay-100 px-4">
            <div className='flex items-center'>
              <ChevronDownIcon aria-hidden="true" className="h-5 w-5 mr-2" />
              <img
                alt="User Avatar"
                src={curUser.photoURL || curUser.profilePicture}
                className="rounded-full w-10 h-10"
              />
            </div>
          </MenuButton>

          <MenuItems
            transition
            className="absolute text-xsm right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-primary shadow-lg ring-1 ring-black ring-opacity-5 transition data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
          >
            <div className="py-1">
              <MenuItem>
                {({ active }) => (
                  <NavLink
                    to="/account"
                    className={`block px-4 py-2 text-black font-semibold rounded hover:bg-accent hover:rounded hover:m-1 focus:bg-neutral focus:text-white`}
                  >
                    Profile
                  </NavLink>
                )}
              </MenuItem>
              <MenuItem>
                {({ active }) => (
                  <NavLink
                    to="/settings"
                    className={`block px-4 py-2 text-black font-semibold rounded hover:bg-accent hover:rounded hover:m-1 focus:bg-neutral focus:text-white`}
                  >
                    Settings
                  </NavLink>
                )}
              </MenuItem>
              <MenuItem>
                {({ active }) => (
                  <button
                    onClick={handleSignOut}
                    className={`block w-full px-4 py-2 text-left text-black font-semibold rounded hover:bg-accent hover:rounded hover:m-1 focus:bg-neutral focus:text-white`}
                  >
                    Logout
                  </button>
                )}
              </MenuItem>
            </div>
          </MenuItems>
        </Menu>
      ) : (
        <button onClick={handleSignIn} id="login" className="whitespace-nopwrap truncate mr-2 btn btn-secondary text-xsm hover:btn-accent transform hover:-translate-y-1 hover:scale-110 delay-100 duration-200 px-4 py-2">
          Google Login
        </button>
      )}
    </div>
  );
};

export default LoginHeader;
