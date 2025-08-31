import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// IMPORTANT: Replace these with your actual Firebase project credentials
// You can find these in your Firebase project settings
const firebaseConfig = {
  apiKey: "AIzaSyCZGnxvp23EnikkOZERAto4tq5JWOAsL9g",
  authDomain: "netra-project-14bec.firebaseapp.com",
  projectId: "netra-project-14bec",
  storageBucket: "netra-project-14bec.firebasestorage.app",
  messagingSenderId: "463771287096",
  appId: "1:463771287096:web:d351ca996b369a2dc470cd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };




