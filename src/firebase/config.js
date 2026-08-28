import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBhu2m_1L3muPAXM-hqqS8o7-ErXbNu8M4",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "festhub-7168f.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "festhub-7168f",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "festhub-7168f.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "593664139486",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:593664139486:web:755837cb40d1d764e4e24f",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-7FHYPY58PV"
};

// Initialize Firebase singleton
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
const db = getFirestore(app);

export { app, auth, googleProvider, db };
