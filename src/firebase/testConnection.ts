// src/firebase/testConnection.ts
// Script para probar la conexión de Firebase

import { auth, db } from './config';
import { signInAnonymously } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { Platform } from 'react-native';

export const testFirebaseConnection = async (): Promise<boolean> => {
  try {
    // Probar autenticación
    const userCredential = await signInAnonymously(auth);
    
    // Probar Firestore
    const testCollection = collection(db, 'test');
    const snapshot = await getDocs(testCollection);
    
    // Cerrar sesión
    await auth.signOut();
    
    return true;
  } catch (error) {
    return false;
  }
};

// Función para probar solo la configuración (sin hacer requests)
export const testFirebaseConfig = (): boolean => {
  try {
    // Verificar que auth y db estén definidos
    if (!auth) {
      return false;
    }
    
    if (!db) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
};
