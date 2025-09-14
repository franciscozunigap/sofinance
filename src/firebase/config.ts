// src/firebase/config.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

// TODO: Replace with your app's Firebase project configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBOeamo7JhZvlFwzZMID1LXCUjqgOghj8U",
    authDomain: "sofinance-eee64.firebaseapp.com",
    projectId: "sofinance-eee64",
    storageBucket: "sofinance-eee64.firebasestorage.app",
    messagingSenderId: "498771930398",
    appId: "1:498771930398:web:1fb16c5cf0b3ad89b12d0f",
    measurementId: "G-X6S14798CZ"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
