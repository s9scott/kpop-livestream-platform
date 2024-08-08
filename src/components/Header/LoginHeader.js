import React, { useState, useEffect } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { GoogleUserSignIn, signOutUser } from '../../auth/googleAuth';
import { addUser, fetchUserInfo } from '../../utils/firestoreUtils';
import { NavLink } from 'react-router-dom';
import './styles/LoginHeader.css';

const LoginHeader = ({ user, setUser }) => {
  const [curUser, setCurUser] = useState(user);

  useEffect(() => {
    const lastUserData = localStorage.getItem("lastUser");
    if (lastUserData && !curUser) {
      const lastUser = JSON.parse(lastUserData);
      setCurUser(lastUser);
      setUser(lastUser);
    }
  }, [curUser, setUser]);

  async function handleSignIn() {
    const response = await GoogleUserSignIn();
    if (response.result === "error") {
      console.log("An error occurred while signing in...");
    } else {
      const user = response.userInfo;
      if (user) {
        try {
          console.log("Fetching user...");
          const login = await fetchUserInfo(user.uid);
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
            localStorage.setItem("lastUser", JSON.stringify(userInfo));
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
            await addUser(userInfo);
            localStorage.setItem("lastUser", JSON.stringify(userInfo));
            setCurUser(userInfo);
            setUser(userInfo);
          }
        } catch (error) {
          console.log("An error occured, trying to fetch user info: ", error);
        }
      }
    }
  }

  function handleSignOut() {
    const response = signOutUser();
    if (response === "error") {
      console.log("Error, user not signed out!");
    } else {
      setCurUser(null);
      setUser(null);
      localStorage.removeItem("lastUser");
    }
  }

  return (
    <div className="relative">
      {curUser ? (
        <Menu as="div" className="relative inline-block text-left z-[1001]">
          <div>
            <MenuButton className="btn btn-secondary inline-flex w-full btn-lg justify-center gap-x-1.5 rounded-md bg-secondary text-sm font-semibold shadow-sm hover:btn-accent transform hover:scale-110 hover:-translate-y-1 duration-200 delay-100 px-4">
              <img
                alt="User Avatar"
                src={curUser.photoURL || curUser.profilePicture}
                className="rounded-full w-12 h-12"
              />
              <ChevronDownIcon aria-hidden="true" className="-mr-1 h-5 w-5 text-black" />
            </MenuButton>
          </div>

          <MenuItems
            transition
            className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-primary shadow-lg ring-1 ring-black ring-opacity-5 transition data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
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
        <button onClick={handleSignIn} id="login" className="btn btn-secondary text-xl hover:btn-accent transform hover:-translate-y-1 hover:scale-110 delay-100 duration-200 px-4 py-2">
          Google Login
        </button>
      )}
    </div>
  );
};

export default LoginHeader;
