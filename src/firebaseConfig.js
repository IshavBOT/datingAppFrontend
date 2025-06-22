import { initializeApp } from "firebase/app";
import { getAuth, isSignInWithEmailLink, sendSignInLinkToEmail, signInWithEmailLink } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAc3JiA3UIS2uPEFjEVy5TR7H57NsCSpek",
  // authDomain: "jogisuperstore.firebaseapp.com",
  projectId: "jogisuperstore",
  storageBucket: "jogisuperstore.firebasestorage.app",
  messagingSenderId: "138604450315",
  appId: "1:138604450315:web:2f9f67c79563520f066d0e",
  measurementId: "G-Z88FP52ZD4"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage, sendSignInLinkToEmail, signInWithEmailLink, isSignInWithEmailLink };
