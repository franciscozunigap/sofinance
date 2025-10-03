#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Verificando configuración para despliegue en Vercel...\n');

// Verificar archivos necesarios
const requiredFiles = [
  'vercel.json',
  '.vercelignore',
  'web/webpack.config.js',
  'package.json'
];

console.log('📁 Verificando archivos necesarios:');
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - FALTANTE`);
    process.exit(1);
  }
});

// Verificar scripts en package.json
console.log('\n📦 Verificando scripts en package.json:');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

const requiredScripts = ['build:web'];
requiredScripts.forEach(script => {
  if (packageJson.scripts && packageJson.scripts[script]) {
    console.log(`  ✅ ${script}: ${packageJson.scripts[script]}`);
  } else {
    console.log(`  ❌ ${script} - FALTANTE`);
    process.exit(1);
  }
});

// Verificar dependencias críticas
console.log('\n📚 Verificando dependencias críticas:');
const criticalDeps = [
  'webpack',
  'webpack-cli',
  'html-webpack-plugin',
  'react',
  'react-dom',
  'react-native-web'
];

criticalDeps.forEach(dep => {
  if (packageJson.dependencies && packageJson.dependencies[dep]) {
    console.log(`  ✅ ${dep}: ${packageJson.dependencies[dep]}`);
  } else if (packageJson.devDependencies && packageJson.devDependencies[dep]) {
    console.log(`  ✅ ${dep}: ${packageJson.devDependencies[dep]} (dev)`);
  } else {
    console.log(`  ❌ ${dep} - FALTANTE`);
    process.exit(1);
  }
});

// Verificar que el build funciona
console.log('\n🔨 Verificando que el build funciona:');
try {
  console.log('  Ejecutando: npm run build:web');
  execSync('npm run build:web', { stdio: 'pipe' });
  console.log('  ✅ Build exitoso');
} catch (error) {
  console.log('  ❌ Build falló:');
  console.log(error.message);
  process.exit(1);
}

// Verificar que el directorio dist existe y tiene contenido
console.log('\n📂 Verificando directorio de salida:');
if (fs.existsSync('dist')) {
  const distFiles = fs.readdirSync('dist');
  if (distFiles.length > 0) {
    console.log('  ✅ Directorio dist creado con archivos:');
    distFiles.forEach(file => {
      console.log(`    - ${file}`);
    });
  } else {
    console.log('  ❌ Directorio dist vacío');
    process.exit(1);
  }
} else {
  console.log('  ❌ Directorio dist no existe');
  process.exit(1);
}

// Verificar variables de entorno (opcional)
console.log('\n🔐 Verificando variables de entorno:');
const envFile = '.env';
if (fs.existsSync(envFile)) {
  console.log('  ✅ Archivo .env encontrado');
  const envContent = fs.readFileSync(envFile, 'utf8');
  const requiredEnvVars = [
    'PRIVATE_FIREBASE_APIKEY',
    'PRIVATE_FIREBASE_AUTH_DOMAIN',
    'PRIVATE_FIREBASE_PROYECT_ID'
  ];
  
  requiredEnvVars.forEach(envVar => {
    if (envContent.includes(envVar)) {
      console.log(`  ✅ ${envVar}`);
    } else {
      console.log(`  ⚠️  ${envVar} - No encontrada en .env`);
    }
  });
} else {
  console.log('  ⚠️  Archivo .env no encontrado - Asegúrate de configurar las variables en Vercel');
}

console.log('\n🎉 ¡Verificación completada!');
console.log('\n📋 Próximos pasos:');
console.log('1. Sube tu código a GitHub');
console.log('2. Conecta el repositorio en Vercel');
console.log('3. Configura las variables de entorno en Vercel Dashboard');
console.log('4. Despliega!');
console.log('\n📖 Para más detalles, consulta DEPLOY_VERCEL.md');
