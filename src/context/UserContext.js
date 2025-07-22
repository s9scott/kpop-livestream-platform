/**
 * @file UserContext.js
 * @author Simon Tenedero
 * @created 2025-06-11
 * @lastModified 2025-07-02
 * @description file containing UserContext, decided to implement a user context to prevent prop drilling
 */

import { createContext, useContext, useState, useEffect } from "react";
import { fetchUserInfo } from "../utils/usersUtils";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useAuth } from "../hooks/useAuth.js"; // Custom hook for authentication

//1. create the context
const UserContext = createContext();

/**
 * 2. Hook to access user context
 *
 * @returns {Object} Object containing user, setUser, loading, loginTime, and setLoginTime
 */
export const useUser = () => {
  const context = useContext(UserContext); //provides the context value provided by the nearest UserProvider
  if (!context) {
    //this ensures useUser is not used with children not nested in a provider - this catches 'undefined'
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

/**
 * 3. create the context provider, 'children' is a special prop that represents any nested JSX inside the component
 *
 * UserProvider component provides user authentication state and user data to the application.
 * It listens for authentication state changes and updates the user context accordingly.
 */
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); //create a local state inside UserProvider
  const [loading, setLoading] = useState(true); //used when auth state hasn't resolved yet - "checking if user is signed in on app startup"

  //IF WE USE CLOUD FUNCTIONS TO CREATE USER DOCUMENTS, WE CAN USE THE FOLLOWING CODE:
  const { handleSignOut } = useAuth();
  useEffect(() => {
    const auth = getAuth();
    let userDocUnsubscribe = null; //track the user document listener

    //this will trigger whenever handleSignIn() or handleSignOut() is called in ProfileMenu.js
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      //clean up previous user document listener
      if (userDocUnsubscribe) {
        userDocUnsubscribe();
        userDocUnsubscribe = null;
      }

      //check user is signed in
      if (authUser) {
        try {
          //try and fetch info from firestore using auth uid
          let existingUserData = await fetchUserInfo(authUser.uid);

          //could not fetch user info on first try, proceed with re-fetch attempts and error handling if fail
          if (!existingUserData) {
            //our cloud function in functions/index.js detects when users login for the first time and handles the doc creation
            console.log(
              "user document not found, waiting for cloud function to automatically create it...",
            );

            let attempts = 0;
            const maxAttempts = 10;

            while (!existingUserData && attempts < maxAttempts) {
              await new Promise((resolve) => setTimeout(resolve, 1000)); //delay 1 second
              existingUserData = await fetchUserInfo(authUser.uid); //try and fetch again
              attempts++;
            }

            //after max 10 attempts, still could not retrieve document
            if (!existingUserData) {
              handleSignOut(); //force users to sign up, this will call the onAuthStateChanged cleanup function.
              return;
            }
          }

          //succeeded in fetching user info
          if (existingUserData) {
            const userInfo = {
              //user authUser as source of truth when possible
              uid: authUser.uid, //unique id for firebase document
              email: authUser.email, //google email
              displayName: authUser.displayName, //username from google account
              photoURL: authUser.photoURL, //profile photo from google account

              //these are custom fields, so we must use firebase for this.
              username: existingUserData.username, //custom name for our website (set in profile menu)
              profilePicture: existingUserData.profilePicture, //custom photo for our website (set in profile menu)
              role: existingUserData.role.roleName, //role
            };
            setUser(userInfo);

          }

        } catch (error) {
          //catch errors in setting up user
          console.error("Error setting up user:", error);
          setUser(null);
        }
      }
      //clean-up, user signs out
      else {
        setUser(null);
        localStorage.removeItem('lastVideoId');
      }
      setLoading(false); //auth state is now determined.
    });

    //cleanup function
    return () => {
      unsubscribe();
      if (userDocUnsubscribe) {
        userDocUnsubscribe();
      }
    };
  }); //don't put user or login time in dependency, causes infinite loop.

  return (
    <UserContext.Provider
      value={{ user, setUser, loading }}
    >
      {/*the value prop is what will be passed to children from the context*/}
      {children}
    </UserContext.Provider>
  );
};
