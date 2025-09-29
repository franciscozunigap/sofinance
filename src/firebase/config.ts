// src/firebase/config.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { Platform } from 'react-native';
import { getFirebaseConfig } from './firebaseConfig';

// Obtener la configuración según la plataforma
const platform = Platform.OS;
const firebaseConfig = getFirebaseConfig(platform);

// Verificar que la configuración esté completa
const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
const missingKeys = requiredKeys.filter(key => !firebaseConfig[key as keyof typeof firebaseConfig]);

if (missingKeys.length > 0) {
  throw new Error(`Firebase configuration is incomplete for ${platform}. Missing: ${missingKeys.join(', ')}`);
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Log de confirmación
