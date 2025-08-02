import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "bjiapur-e6d52.firebaseapp.com",
  projectId: "bjiapur-e6d52",
  storageBucket: "bjiapur-e6d52.firebasestorage.app",
  messagingSenderId: "600230375072",
  appId: "1:600230375072:web:1a427611b3a09baa8c23c5",
  measurementId: "G-VBTNCYG25Z"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
