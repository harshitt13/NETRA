import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration from environment (Vite-style)
// Falls back to existing values if env vars are not provided.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCZGnxvp23EnikkOZERAto4tq5JWOAsL9g",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "netra-project-14bec.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "netra-project-14bec",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "netra-project-14bec.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "463771287096",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:463771287096:web:d351ca996b369a2dc470cd",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };




