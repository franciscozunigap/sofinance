// src/firebase/firebaseConfig.ts
// Archivo de configuración de Firebase para diferentes plataformas

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

// Configuración para desarrollo - REEMPLAZAR CON TUS CREDENCIALES REALES
export const firebaseConfigs: Record<string, FirebaseConfig> = {
  // Configuración para web (usa variables de entorno)
  web: {
    apiKey: process.env.PRIVATE_FIREBASE_APIKEY || "",
    authDomain: process.env.PRIVATE_FIREBASE_AUTH_DOMAIN || "",
    projectId: process.env.PRIVATE_FIREBASE_PROYECT_ID || "",
    storageBucket: process.env.PRIVATE_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: process.env.PRIVATE_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: process.env.PRIVATE_FIREBASE_APP_ID || "",
    measurementId: process.env.PRIVATE_FIREBASE_MEASUREMENT_ID || ""
  },
  
  // Configuración para iOS - REEMPLAZAR CON TUS CREDENCIALES REALES
  ios: {
    apiKey: process.env.IOS_FIREBASE_APIKEY || "",
    authDomain: process.env.IOS_FIREBASE_AUTH_DOMAIN || "",
    projectId: process.env.IOS_FIREBASE_PROYECT_ID || "",
    storageBucket: process.env.IOS_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: process.env.IOS_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: process.env.IOS_FIREBASE_APP_ID || "",
  },

  
  // Configuración para Android - REEMPLAZAR CON TUS CREDENCIALES REALES
  android: {
    apiKey: "AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", // Reemplazar con tu API key
    authDomain: "sofinance-xxxxx.firebaseapp.com", // Reemplazar con tu dominio
    projectId: "sofinance-xxxxx", // Reemplazar con tu project ID
    storageBucket: "sofinance-xxxxx.appspot.com", // Reemplazar con tu storage bucket
    messagingSenderId: "123456789012", // Reemplazar con tu sender ID
    appId: "1:123456789012:android:abcdef1234567890", // Reemplazar con tu app ID
    measurementId: "G-XXXXXXXXXX" // Reemplazar con tu measurement ID
  }
};

// Función para obtener la configuración según la plataforma
export const getFirebaseConfig = (platform: string): FirebaseConfig => {
  const config = firebaseConfigs[platform];
  if (!config) {
    throw new Error(`No Firebase configuration found for platform: ${platform}`);
  }
  return config;
};
