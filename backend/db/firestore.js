import { getFirestore } from "firebase/firestore/lite";
import { app } from "../firebaseConfig.js";

export const db = getFirestore(app);