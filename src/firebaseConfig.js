import { initializeApp } from "firebase/app";
import { getAuth, isSignInWithEmailLink, sendSignInLinkToEmail, signInWithEmailLink } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyCHD6lWUdeKfI6D2ujpbXvP7P7WU_CCcSc",
  authDomain: "datingserver2.firebaseapp.com",
  projectId: "datingserver2",
  storageBucket: "datingserver2.firebasestorage.app",
  messagingSenderId: "728762668935",
  appId: "1:728762668935:web:b83bfdeb899d95a4882522",
  measurementId: "G-F7PCMJGPW3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage, sendSignInLinkToEmail, signInWithEmailLink, isSignInWithEmailLink };
