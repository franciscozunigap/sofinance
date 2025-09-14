// src/firebase/firebaseConfig.ts
// Archivo de configuración de Firebase para diferentes plataformas

import {
  PRIVATE_FIREBASE_APIKEY,
  PRIVATE_FIREBASE_AUTH_DOMAIN,
  PRIVATE_FIREBASE_PROYECT_ID,
  PRIVATE_FIREBASE_STORAGE_BUCKET,
  PRIVATE_FIREBASE_MESSAGING_SENDER_ID,
  PRIVATE_FIREBASE_APP_ID,
  PRIVATE_FIREBASE_MEASUREMENT_ID,
  IOS_FIREBASE_APIKEY,
  IOS_FIREBASE_AUTH_DOMAIN,
  IOS_FIREBASE_PROYECT_ID,
  IOS_FIREBASE_STORAGE_BUCKET,
  IOS_FIREBASE_MESSAGING_SENDER_ID,
  IOS_FIREBASE_APP_ID,
  IOS_FIREBASE_MEASUREMENT_ID,
  ANDROID_FIREBASE_APIKEY,
  ANDROID_FIREBASE_AUTH_DOMAIN,
  ANDROID_FIREBASE_PROYECT_ID,
  ANDROID_FIREBASE_STORAGE_BUCKET,
  ANDROID_FIREBASE_MESSAGING_SENDER_ID,
  ANDROID_FIREBASE_APP_ID,
  ANDROID_FIREBASE_MEASUREMENT_ID,
} from '@env';

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
    apiKey: PRIVATE_FIREBASE_APIKEY || "",
    authDomain: PRIVATE_FIREBASE_AUTH_DOMAIN || "",
    projectId: PRIVATE_FIREBASE_PROYECT_ID || "",
    storageBucket: PRIVATE_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: PRIVATE_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: PRIVATE_FIREBASE_APP_ID || "",
    measurementId: PRIVATE_FIREBASE_MEASUREMENT_ID || ""
  },
  
  // Configuración para iOS - REEMPLAZAR CON TUS CREDENCIALES REALES
  ios: {
    apiKey: IOS_FIREBASE_APIKEY || "",
    authDomain: IOS_FIREBASE_AUTH_DOMAIN || "",
    projectId: IOS_FIREBASE_PROYECT_ID || "",
    storageBucket: IOS_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: IOS_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: IOS_FIREBASE_APP_ID || "",
    measurementId: IOS_FIREBASE_MEASUREMENT_ID || ""
  },

  
  // Configuración para Android - REEMPLAZAR CON TUS CREDENCIALES REALES
  android: {
    apiKey: ANDROID_FIREBASE_APIKEY || "",
    authDomain: ANDROID_FIREBASE_AUTH_DOMAIN || "",
    projectId: ANDROID_FIREBASE_PROYECT_ID || "",
    storageBucket: ANDROID_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: ANDROID_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: ANDROID_FIREBASE_APP_ID || "",
    measurementId: ANDROID_FIREBASE_MEASUREMENT_ID || ""
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
