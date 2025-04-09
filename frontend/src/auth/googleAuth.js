import { getAuth, GoogleAuthProvider, signOut, signInWithPopup } from "firebase/auth";

// Initialize Firebase authentication and set it to use the device's language settings
const auth = getAuth();
auth.useDeviceLanguage(); 

/**
 * Attempts to sign the user in using a Google login pop-up via Firebase.
 * @returns {Object} An object containing the result status, user information, and token.
 *                   If successful, the userInfo and token properties are populated.
 *                   If an error occurs, userInfo and token will be null.
 */
export async function GoogleUserSignIn() {
    const provider = new GoogleAuthProvider();  // Instantiate GoogleAuthProvider

    try {
        // Attempt to sign in with a pop-up window
        const result = await signInWithPopup(auth, provider);
        const user = result.user;  // Get the authenticated user's information
        const token = await user.getIdToken(true);  // Retrieve the user's ID token
        
        // Return success result with user information and token
        return {
            result: "success",
            userInfo: user,
            token: token
        };

    } catch (error) {
        // Handle and log any errors that occur during sign-in
        const errorCode = error.code;
        const errorMessage = error.message;

        console.log("Error! Code -", errorCode, "Msg -", errorMessage);

        // Return error result with null values for userInfo and token
        return {
            result: "error",
            userInfo: null,
            token: null
        };
    }
}

/**
 * Attempts to sign the user out of the application.
 * @returns {String} A string indicating the result of the sign-out operation.
 *                   Returns "success" if the operation is successful, otherwise "error".
 */
export function signOutUser() {
    try {
        signOut(auth);  // Sign the user out
        console.log("User has been signed out...");
        return "success";  // Return success result
    } catch (error) {
        // Handle and log any errors that occur during sign-out
        console.log("An error occurred while signing out...");
        return "error";  // Return error result
    }
}
