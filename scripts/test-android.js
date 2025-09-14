#!/usr/bin/env node

/**
 * Script para probar la configuración de Firebase en Android
 */

const fs = require('fs');
const path = require('path');

console.log('🤖 Probando configuración de Firebase para Android...\n');

// Verificar archivo google-services.json
const googleServicesPath = path.join(__dirname, '..', 'android', 'app', 'google-services.json');
if (fs.existsSync(googleServicesPath)) {
  console.log('✅ Archivo google-services.json encontrado');
  
  try {
    const googleServices = JSON.parse(fs.readFileSync(googleServicesPath, 'utf8'));
    const projectId = googleServices.project_info?.project_id;
    const packageName = googleServices.client?.[0]?.client_info?.android_client_info?.package_name;
    
    console.log(`   📱 Package Name: ${packageName || 'No encontrado'}`);
    console.log(`   🔥 Project ID: ${projectId || 'No encontrado'}`);
    
    if (packageName !== 'com.sofinancetemp') {
      console.log('⚠️  ADVERTENCIA: El package name no coincide con com.sofinancetemp');
      console.log('   Actualiza el applicationId en android/app/build.gradle si es necesario');
    }
  } catch (error) {
    console.log('❌ Error al leer google-services.json:', error.message);
  }
} else {
  console.log('❌ Archivo google-services.json NO encontrado');
  console.log('   📥 Descarga el archivo desde Firebase Console y colócalo en android/app/');
}

// Verificar variables de entorno
console.log('\n🔧 Verificando variables de entorno...');

const envVars = [
  'ANDROID_FIREBASE_APIKEY',
  'ANDROID_FIREBASE_AUTH_DOMAIN',
  'ANDROID_FIREBASE_PROYECT_ID',
  'ANDROID_FIREBASE_STORAGE_BUCKET',
  'ANDROID_FIREBASE_MESSAGING_SENDER_ID',
  'ANDROID_FIREBASE_APP_ID'
];

let missingVars = [];
envVars.forEach(varName => {
  if (!process.env[varName]) {
    missingVars.push(varName);
  }
});

if (missingVars.length === 0) {
  console.log('✅ Todas las variables de entorno de Android están configuradas');
} else {
  console.log('❌ Variables de entorno faltantes:');
  missingVars.forEach(varName => {
    console.log(`   - ${varName}`);
  });
  console.log('\n💡 Ejecuta: npm run setup:firebase');
}

// Verificar configuración en firebaseConfig.ts
console.log('\n📝 Verificando configuración en firebaseConfig.ts...');

const firebaseConfigPath = path.join(__dirname, '..', 'src', 'firebase', 'firebaseConfig.ts');
if (fs.existsSync(firebaseConfigPath)) {
  const configContent = fs.readFileSync(firebaseConfigPath, 'utf8');
  
  if (configContent.includes('ANDROID_FIREBASE_APIKEY')) {
    console.log('✅ Configuración de Android encontrada en firebaseConfig.ts');
  } else {
    console.log('❌ Configuración de Android NO encontrada en firebaseConfig.ts');
  }
} else {
  console.log('❌ Archivo firebaseConfig.ts no encontrado');
}

console.log('\n🚀 Para probar la aplicación en Android:');
console.log('   npm run android');
console.log('\n📖 Para más información: FIREBASE_SETUP.md');
