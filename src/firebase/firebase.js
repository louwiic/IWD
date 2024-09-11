// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

/* const firebaseConfig = {
  apiKey: "AIzaSyBiudhQfJNIn4Ph-mS0H837p_GJ3HCi2XA",
  authDomain: "iwd-app.firebaseapp.com",
  projectId: "iwd-app",
  storageBucket: "iwd-app.appspot.com",
  messagingSenderId: "664439190213",
  appId: "1:664439190213:web:9dbb473f9f5de1b8acf6ac",
  measurementId: "G-J5EBBRQKCW",
}; */

const firebaseConfig = {
  apiKey: "AIzaSyBylRS0YqbF1XcMvi37ANtQGy2YR0GMYy8",
  authDomain: "leadership-tensegrity.firebaseapp.com",
  projectId: "leadership-tensegrity",
  storageBucket: "leadership-tensegrity.appspot.com",
  messagingSenderId: "240524144830",
  appId: "1:240524144830:web:b891e8ec86b0c9e5556eef",
  measurementId: "G-E4P4JFQK16",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
