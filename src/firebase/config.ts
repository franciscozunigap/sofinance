// src/firebase/config.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence, enableMultiTabIndexedDbPersistence } from "firebase/firestore";
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

// ✅ OPTIMIZADO: Habilitar persistencia offline para web
if (Platform.OS === 'web') {
  // Intentar habilitar persistencia con soporte multi-tab
  enableMultiTabIndexedDbPersistence(db)
    .then(() => {
      console.log('✅ [Firebase] Persistencia offline multi-tab habilitada');
    })
    .catch((error) => {
      if (error.code === 'failed-precondition') {
        // Múltiples tabs abiertas, usar persistencia single-tab
        console.warn('⚠️ [Firebase] Múltiples tabs detectadas, usando persistencia single-tab');
        enableIndexedDbPersistence(db).catch((err) => {
          console.error('❌ [Firebase] Error habilitando persistencia single-tab:', err);
        });
      } else if (error.code === 'unimplemented') {
        console.warn('⚠️ [Firebase] Navegador no soporta persistencia offline');
      } else {
        console.error('❌ [Firebase] Error habilitando persistencia:', error);
      }
    });
}

// Log de confirmación
console.log('🔥 [Firebase] Configuración inicializada correctamente');
console.log('🔥 [Firebase] Proyecto:', firebaseConfig.projectId);
console.log('🔥 [Firebase] Plataforma:', platform);
console.log('🔥 [Firebase] Auth Domain:', firebaseConfig.authDomain);
