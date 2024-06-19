import { getAuth, GoogleAuthProvider, signOut, signInWithPopup } from "firebase/auth";
import { app } from "../firebaseConfig.js";

const auth = getAuth();

export default async function GoogleUserSignIn() {
    const provider = new GoogleAuthProvider();
    auth.useDeviceLanguage();

    try {
        const result = await signInWithPopup(auth, provider)
        const credentials = GoogleAuthProvider.credentialFromResult(result);
        const token = credentials.accessToken;
        const user = result.user;
        
        return {
            result: "success",
            userInfo: user
        }

    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log("Error! Code - ", errorCode, " Msg - ", errorMessage);
        return {
            result: "error",
            userInfo: null
        }
    }

}

export function signOutUser() {
    try {
        signOut(auth);
        console.log("User has been signed out...");
    } catch (error) {
        console.log("An error occurred while signing out...");
    }
}