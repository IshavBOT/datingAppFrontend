import { initializeApp } from "firebase/app";
import { getAuth, isSignInWithEmailLink, sendSignInLinkToEmail, signInWithEmailLink } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBBlm_A8JDlV2XTmxvu773SVIdUDSEGogs",
  authDomain: "server-eceec.firebaseapp.com",
  projectId: "server-eceec",
  storageBucket: "server-eceec.firebasestorage.app",
  messagingSenderId: "491866630406",
  appId: "1:491866630406:web:50c058c4be455323859687"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage, sendSignInLinkToEmail, signInWithEmailLink, isSignInWithEmailLink };
