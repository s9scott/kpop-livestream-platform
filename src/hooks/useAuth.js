/**
 * @file useAuth.js
 * @author Jonas Matulis, Simon Tenedero
 * @created 2024-XX-XX
 * @lastModified 2025-07-02
 * @description Custom hook for handling user authentication using Google Sign-In.
 */

import { GoogleUserSignIn, GoogleUserSignOut } from "../auth/googleAuth"; // Importing Google authentication functions
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const navigate = useNavigate();

  /**
   * Handles user sign-in with Google authentication. This will trigger on authStateChanged()
   *
   * @returns {Promise<void>} A promise that resolves when the sign-in process is complete.
   * @throws {Error} If there is an error during the sign-in process.
   */
  const handleSignIn = async () => {
    //error handling is defined in googleAuth.js
    const response = await GoogleUserSignIn(); // Trigger Google sign-in, get user data such as email, profile, name, etc.
    if (response.result === "error") {
      console.error("Google sign-in failed:", response.error);
      return;
    }
    console.log("Sign-in initiated successfully.");
  };

  /**
   * Handles user sign-out and updates the UI accordingly. This will trigger the cleanup of onAuthStateChanged
   */
  const handleSignOut = () => {
    const response = GoogleUserSignOut(); // Trigger Google sign-out

    if (response.result === "error") {
      console.error("Google sign-out failed:", response.error);

      //navigate back to root on logout
      navigate("/");
      return;
    }
    console.log("Sign-out initiated successfully.");
  };

  return { handleSignIn, handleSignOut };
};
