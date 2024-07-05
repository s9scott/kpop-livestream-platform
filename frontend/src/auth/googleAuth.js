// googleAuth.js
import { getAuth, GoogleAuthProvider, signOut, signInWithPopup } from "firebase/auth";
import { app } from "../firebaseConfig.js";

const auth = getAuth();
auth.useDeviceLanguage(); 

export async function GoogleUserSignIn() {
    const provider = new GoogleAuthProvider();

    try {
        const result = await signInWithPopup(auth, provider);
        const credentials = GoogleAuthProvider.credentialFromResult(result);
        const user = result.user;
        const token = await user.getIdToken(true);       
        
        return {
            result: "success",
            userInfo: user,
            token: token
        }

    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;

        console.log("Error! Code - ", errorCode, " Msg - ", errorMessage);

        return {
            result: "error",
            userInfo: null,
            token: null
        }
    }

}

export function signOutUser() {
    try {
        signOut(auth);
        console.log("User has been signed out...");
        return "success";
    } catch (error) {
        console.log("An error occurred while signing out...");
        return "error";
    }
}
