// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBiudhQfJNIn4Ph-mS0H837p_GJ3HCi2XA",
  authDomain: "iwd-app.firebaseapp.com",
  projectId: "iwd-app",
  storageBucket: "iwd-app.appspot.com",
  messagingSenderId: "664439190213",
  appId: "1:664439190213:web:9dbb473f9f5de1b8acf6ac",
  measurementId: "G-J5EBBRQKCW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
