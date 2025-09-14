// src/firebase/testEnvVars.ts
// Script para probar que las variables de entorno se carguen correctamente

import {
  PRIVATE_FIREBASE_APIKEY,
  IOS_FIREBASE_APIKEY,
  ANDROID_FIREBASE_APIKEY,
} from '@env';

export const testEnvironmentVariables = () => {
  console.log('🔧 Probando variables de entorno...\n');

  // Probar variables de Web
  console.log('🌐 Variables de Web:');
  console.log('  PRIVATE_FIREBASE_APIKEY:', PRIVATE_FIREBASE_APIKEY ? '✅ Configurada' : '❌ No configurada');
  console.log('  Valor:', PRIVATE_FIREBASE_APIKEY || 'undefined');

  // Probar variables de iOS
  console.log('\n📱 Variables de iOS:');
  console.log('  IOS_FIREBASE_APIKEY:', IOS_FIREBASE_APIKEY ? '✅ Configurada' : '❌ No configurada');
  console.log('  Valor:', IOS_FIREBASE_APIKEY || 'undefined');

  // Probar variables de Android
  console.log('\n🤖 Variables de Android:');
  console.log('  ANDROID_FIREBASE_APIKEY:', ANDROID_FIREBASE_APIKEY ? '✅ Configurada' : '❌ No configurada');
  console.log('  Valor:', ANDROID_FIREBASE_APIKEY || 'undefined');

  // Resumen
  const webConfigured = !!PRIVATE_FIREBASE_APIKEY;
  const iosConfigured = !!IOS_FIREBASE_APIKEY;
  const androidConfigured = !!ANDROID_FIREBASE_APIKEY;

  console.log('\n📊 Resumen:');
  console.log(`  Web: ${webConfigured ? '✅' : '❌'}`);
  console.log(`  iOS: ${iosConfigured ? '✅' : '❌'}`);
  console.log(`  Android: ${androidConfigured ? '✅' : '❌'}`);

  if (!webConfigured || !iosConfigured || !androidConfigured) {
    console.log('\n⚠️  Algunas variables no están configuradas.');
    console.log('💡 Asegúrate de tener un archivo .env en la raíz del proyecto.');
    console.log('💡 Ejecuta: npm run setup:firebase');
  } else {
    console.log('\n🎉 ¡Todas las variables están configuradas correctamente!');
  }

  return {
    web: webConfigured,
    ios: iosConfigured,
    android: androidConfigured,
  };
};
