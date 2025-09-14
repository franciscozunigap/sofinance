// src/firebase/testConnection.ts
// Script para probar la conexión de Firebase

import { auth, db } from './config';
import { signInAnonymously } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { Platform } from 'react-native';

export const testFirebaseConnection = async (): Promise<boolean> => {
  try {
    console.log(`Testing Firebase connection for ${Platform.OS} platform...`);
    
    // Probar autenticación
    console.log('Testing authentication...');
    const userCredential = await signInAnonymously(auth);
    console.log('Authentication successful:', userCredential.user.uid);
    
    // Probar Firestore
    console.log('Testing Firestore connection...');
    const testCollection = collection(db, 'test');
    const snapshot = await getDocs(testCollection);
    console.log('Firestore connection successful. Documents found:', snapshot.size);
    
    // Cerrar sesión
    await auth.signOut();
    console.log('Firebase connection test completed successfully');
    
    return true;
  } catch (error) {
    console.error('Firebase connection test failed:', error);
    return false;
  }
};

// Función para probar solo la configuración (sin hacer requests)
export const testFirebaseConfig = (): boolean => {
  try {
    console.log(`Testing Firebase configuration for ${Platform.OS} platform...`);
    
    // Verificar que auth y db estén definidos
    if (!auth) {
      console.error('Firebase auth is not initialized');
      return false;
    }
    
    if (!db) {
      console.error('Firebase db is not initialized');
      return false;
    }
    
    console.log('Firebase configuration is valid');
    return true;
  } catch (error) {
    console.error('Firebase configuration test failed:', error);
    return false;
  }
};
