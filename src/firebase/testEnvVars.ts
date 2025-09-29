// src/firebase/testEnvVars.ts
// Script para probar que las variables de entorno se carguen correctamente

import {
  PRIVATE_FIREBASE_APIKEY,
  IOS_FIREBASE_APIKEY,
  ANDROID_FIREBASE_APIKEY,
} from '@env';

export const testEnvironmentVariables = () => {

  // Resumen
  const webConfigured = !!PRIVATE_FIREBASE_APIKEY;
  const iosConfigured = !!IOS_FIREBASE_APIKEY;
  const androidConfigured = !!ANDROID_FIREBASE_APIKEY;


  return {
    web: webConfigured,
    ios: iosConfigured,
    android: androidConfigured,
  };
};
