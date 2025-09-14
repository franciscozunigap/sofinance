#!/usr/bin/env node

/**
 * Script para probar las variables de entorno
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Probando variables de entorno...\n');

// Verificar si existe el archivo .env
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  console.log('✅ Archivo .env encontrado');
  
  // Leer y mostrar las variables
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));
  
  console.log(`📝 ${lines.length} variables encontradas:`);
  lines.forEach(line => {
    const [key] = line.split('=');
    console.log(`   - ${key}`);
  });
  
  // Verificar variables específicas de Firebase
  const requiredVars = [
    'PRIVATE_FIREBASE_APIKEY',
    'IOS_FIREBASE_APIKEY',
    'ANDROID_FIREBASE_APIKEY'
  ];
  
  console.log('\n🔍 Verificando variables requeridas:');
  let missingVars = [];
  requiredVars.forEach(varName => {
    if (envContent.includes(varName)) {
      console.log(`   ✅ ${varName}`);
    } else {
      console.log(`   ❌ ${varName}`);
      missingVars.push(varName);
    }
  });
  
  if (missingVars.length === 0) {
    console.log('\n🎉 ¡Todas las variables requeridas están configuradas!');
  } else {
    console.log('\n⚠️  Variables faltantes:');
    missingVars.forEach(varName => {
      console.log(`   - ${varName}`);
    });
    console.log('\n💡 Ejecuta: npm run setup:firebase');
  }
  
} else {
  console.log('❌ Archivo .env NO encontrado');
  console.log('📝 Crea un archivo .env en la raíz del proyecto con tus credenciales de Firebase');
  console.log('💡 Puedes usar env.example como plantilla');
  console.log('💡 O ejecuta: npm run setup:firebase');
}

console.log('\n📖 Para más información: FIREBASE_SETUP.md');
