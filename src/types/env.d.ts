// src/types/env.d.ts
// Tipos para las variables de entorno

declare module '@env' {
  // Firebase Web Configuration
  export const PRIVATE_FIREBASE_APIKEY: string;
  export const PRIVATE_FIREBASE_AUTH_DOMAIN: string;
  export const PRIVATE_FIREBASE_PROYECT_ID: string;
  export const PRIVATE_FIREBASE_STORAGE_BUCKET: string;
  export const PRIVATE_FIREBASE_MESSAGING_SENDER_ID: string;
  export const PRIVATE_FIREBASE_APP_ID: string;
  export const PRIVATE_FIREBASE_MEASUREMENT_ID: string;

  // Firebase iOS Configuration
  export const IOS_FIREBASE_APIKEY: string;
  export const IOS_FIREBASE_AUTH_DOMAIN: string;
  export const IOS_FIREBASE_PROYECT_ID: string;
  export const IOS_FIREBASE_STORAGE_BUCKET: string;
  export const IOS_FIREBASE_MESSAGING_SENDER_ID: string;
  export const IOS_FIREBASE_APP_ID: string;
  export const IOS_FIREBASE_MEASUREMENT_ID: string;

  // Firebase Android Configuration
  export const ANDROID_FIREBASE_APIKEY: string;
  export const ANDROID_FIREBASE_AUTH_DOMAIN: string;
  export const ANDROID_FIREBASE_PROYECT_ID: string;
  export const ANDROID_FIREBASE_STORAGE_BUCKET: string;
  export const ANDROID_FIREBASE_MESSAGING_SENDER_ID: string;
  export const ANDROID_FIREBASE_APP_ID: string;
  export const ANDROID_FIREBASE_MEASUREMENT_ID: string;
}
