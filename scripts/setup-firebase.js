#!/usr/bin/env node

/**
 * Script para configurar Firebase en SoFinance
 * Este script ayuda a configurar las credenciales de Firebase para diferentes plataformas
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const firebaseConfigPath = path.join(__dirname, '..', 'src', 'firebase', 'firebaseConfig.ts');

console.log('🔥 Configuración de Firebase para SoFinance');
console.log('==========================================\n');

console.log('Este script te ayudará a configurar las credenciales de Firebase.');
console.log('Necesitarás las credenciales de tu proyecto de Firebase Console.\n');

async function main() {
  try {
    console.log('📱 Configuración para iOS:');
    const iosApiKey = await question('API Key para iOS: ');
    const iosAuthDomain = await question('Auth Domain para iOS: ');
    const iosProjectId = await question('Project ID para iOS: ');
    const iosStorageBucket = await question('Storage Bucket para iOS: ');
    const iosMessagingSenderId = await question('Messaging Sender ID para iOS: ');
    const iosAppId = await question('App ID para iOS: ');
    const iosMeasurementId = await question('Measurement ID para iOS (opcional): ');

    console.log('\n🌐 Configuración para Web:');
    const webApiKey = await question('API Key para Web: ');
    const webAuthDomain = await question('Auth Domain para Web: ');
    const webProjectId = await question('Project ID para Web: ');
    const webStorageBucket = await question('Storage Bucket para Web: ');
    const webMessagingSenderId = await question('Messaging Sender ID para Web: ');
    const webAppId = await question('App ID para Web: ');
    const webMeasurementId = await question('Measurement ID para Web (opcional): ');

    console.log('\n🤖 Configuración para Android:');
    const androidApiKey = await question('API Key para Android: ');
    const androidAuthDomain = await question('Auth Domain para Android: ');
    const androidProjectId = await question('Project ID para Android: ');
    const androidStorageBucket = await question('Storage Bucket para Android: ');
    const androidMessagingSenderId = await question('Messaging Sender ID para Android: ');
    const androidAppId = await question('App ID para Android: ');
    const androidMeasurementId = await question('Measurement ID para Android (opcional): ');

    // Generar el archivo de configuración
    const configContent = `// src/firebase/firebaseConfig.ts
// Archivo de configuración de Firebase para diferentes plataformas
// Generado automáticamente el ${new Date().toISOString()}

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

// Configuración para diferentes plataformas
export const firebaseConfigs: Record<string, FirebaseConfig> = {
  // Configuración para web (usa variables de entorno)
  web: {
    apiKey: process.env.PRIVATE_FIREBASE_APIKEY || "${webApiKey}",
    authDomain: process.env.PRIVATE_FIREBASE_AUTH_DOMAIN || "${webAuthDomain}",
    projectId: process.env.PRIVATE_FIREBASE_PROYECT_ID || "${webProjectId}",
    storageBucket: process.env.PRIVATE_FIREBASE_STORAGE_BUCKET || "${webStorageBucket}",
    messagingSenderId: process.env.PRIVATE_FIREBASE_MESSAGING_SENDER_ID || "${webMessagingSenderId}",
    appId: process.env.PRIVATE_FIREBASE_APP_ID || "${webAppId}",
    measurementId: process.env.PRIVATE_FIREBASE_MEASUREMENT_ID || "${webMeasurementId || ''}"
  },
  
  // Configuración para iOS
  ios: {
    apiKey: "${iosApiKey}",
    authDomain: "${iosAuthDomain}",
    projectId: "${iosProjectId}",
    storageBucket: "${iosStorageBucket}",
    messagingSenderId: "${iosMessagingSenderId}",
    appId: "${iosAppId}",
    measurementId: "${iosMeasurementId || ''}"
  },
  
  // Configuración para Android
  android: {
    apiKey: "${androidApiKey}",
    authDomain: "${androidAuthDomain}",
    projectId: "${androidProjectId}",
    storageBucket: "${androidStorageBucket}",
    messagingSenderId: "${androidMessagingSenderId}",
    appId: "${androidAppId}",
    measurementId: "${androidMeasurementId || ''}"
  }
};

// Función para obtener la configuración según la plataforma
export const getFirebaseConfig = (platform: string): FirebaseConfig => {
  const config = firebaseConfigs[platform];
  if (!config) {
    throw new Error(\`No Firebase configuration found for platform: \${platform}\`);
  }
  return config;
};
`;

    // Escribir el archivo
    fs.writeFileSync(firebaseConfigPath, configContent);
    
    console.log('\n✅ Configuración de Firebase completada exitosamente!');
    console.log(`📁 Archivo creado en: ${firebaseConfigPath}`);
    console.log('\n📋 Próximos pasos:');
    console.log('1. Verifica que las credenciales sean correctas');
    console.log('2. Ejecuta la aplicación: npm run ios');
    console.log('3. Verifica que la autenticación funcione correctamente');
    console.log('\n📖 Para más información, consulta FIREBASE_SETUP.md');

  } catch (error) {
    console.error('❌ Error durante la configuración:', error.message);
  } finally {
    rl.close();
  }
}

main();
