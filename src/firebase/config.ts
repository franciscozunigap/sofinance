// src/firebase/config.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

// TODO: Replace with your app's Firebase project configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.PRIVATE_FIREBASE_APIKEY,
    authDomain: process.env.PRIVATE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.PRIVATE_FIREBASE_PROYECT_ID,
    storageBucket: process.env.PRIVATE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.PRIVATE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.PRIVATE_FIREBASE_APP_ID,
    measurementId: process.env.PRIVATE_FIREBASE_MEASUREMENT_ID
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
