// src/firebase/confijs.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";

/* Firebase config
  const firebaseConfig = {
  apiKey: "AIzaSyBizqRNYz0FuecKG786iV0j82u3_oFzcJQ",
  authDomain: "ai-browser-agent-bfbbb.firebaseapp.com",
  projectId: "ai-browser-agent-bfbbb",
  storageBucket: "ai-browser-agent-bfbbb.appspot.com", // FIXED .app → .app**spot**
  messagingSenderId: "849951203739",
  appId: "1:849951203739:web:4a9470ffd1469f9b55013e",
  measurementId: "G-65DXNMVB31",
};*/

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth and Providers
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
