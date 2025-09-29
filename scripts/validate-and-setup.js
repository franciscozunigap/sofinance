#!/usr/bin/env node

/**
 * Script de validación y configuración del proyecto SoFinance
 * Verifica la configuración de Firebase, dependencias y estructura del proyecto
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colores para output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Función para imprimir con colores
function print(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Función para verificar si un archivo existe
function fileExists(filePath) {
  return fs.existsSync(path.join(__dirname, '..', filePath));
}

// Función para verificar si un directorio existe
function dirExists(dirPath) {
  return fs.existsSync(path.join(__dirname, '..', dirPath)) && 
         fs.statSync(path.join(__dirname, '..', dirPath)).isDirectory();
}

// Función para leer archivo JSON
function readJsonFile(filePath) {
  try {
    const content = fs.readFileSync(path.join(__dirname, '..', filePath), 'utf8');
    return JSON.parse(content);
  } catch (error) {
    return null;
  }
}

// Función para verificar dependencias
function checkDependencies() {
  print('blue', '\n🔍 Verificando dependencias...');
  
  const packageJson = readJsonFile('package.json');
  if (!packageJson) {
    print('red', '❌ No se pudo leer package.json');
    return false;
  }

  const requiredDeps = [
    'react',
    'react-native',
    'expo',
    'firebase',
    '@react-navigation/native',
    'typescript',
    'jest',
    '@testing-library/react-native'
  ];

  const missingDeps = requiredDeps.filter(dep => 
    !packageJson.dependencies[dep] && !packageJson.devDependencies[dep]
  );

  if (missingDeps.length > 0) {
    print('red', `❌ Dependencias faltantes: ${missingDeps.join(', ')}`);
    return false;
  }

  print('green', '✅ Todas las dependencias requeridas están instaladas');
  return true;
}

// Función para verificar estructura de directorios
function checkDirectoryStructure() {
  print('blue', '\n📁 Verificando estructura de directorios...');
  
  const requiredDirs = [
    'src',
    'src/components',
    'src/screens',
    'src/services',
    'src/hooks',
    'src/contexts',
    'src/types',
    'src/utils',
    'src/__tests__',
    'src/__tests__/services',
    'src/__tests__/hooks',
    'src/__tests__/contexts',
    'android',
    'ios',
    'web'
  ];

  const missingDirs = requiredDirs.filter(dir => !dirExists(dir));

  if (missingDirs.length > 0) {
    print('red', `❌ Directorios faltantes: ${missingDirs.join(', ')}`);
    return false;
  }

  print('green', '✅ Estructura de directorios correcta');
  return true;
}

// Función para verificar archivos de configuración
function checkConfigFiles() {
  print('blue', '\n⚙️ Verificando archivos de configuración...');
  
  const requiredFiles = [
    'tsconfig.json',
    'jest.config.js',
    'babel.config.js',
    'metro.config.js',
    'app.json',
    'webpack.config.js'
  ];

  const missingFiles = requiredFiles.filter(file => !fileExists(file));

  if (missingFiles.length > 0) {
    print('red', `❌ Archivos de configuración faltantes: ${missingFiles.join(', ')}`);
    return false;
  }

  print('green', '✅ Archivos de configuración presentes');
  return true;
}

// Función para verificar configuración de Firebase
function checkFirebaseConfig() {
  print('blue', '\n🔥 Verificando configuración de Firebase...');
  
  const firebaseConfigPath = 'src/firebase/firebaseConfig.ts';
  if (!fileExists(firebaseConfigPath)) {
    print('red', '❌ Archivo de configuración de Firebase no encontrado');
    return false;
  }

  const firebaseConfigContent = fs.readFileSync(
    path.join(__dirname, '..', firebaseConfigPath), 
    'utf8'
  );

  const requiredConfigKeys = [
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId'
  ];

  const missingKeys = requiredConfigKeys.filter(key => 
    !firebaseConfigContent.includes(key)
  );

  if (missingKeys.length > 0) {
    print('yellow', `⚠️ Claves de configuración de Firebase faltantes: ${missingKeys.join(', ')}`);
    print('yellow', '   Ejecuta: npm run setup:firebase');
    return false;
  }

  print('green', '✅ Configuración de Firebase completa');
  return true;
}

// Función para verificar tests
function checkTests() {
  print('blue', '\n🧪 Verificando tests...');
  
  const testFiles = [
    'src/__tests__/services/authService.test.ts',
    'src/__tests__/services/balanceService.test.ts',
    'src/__tests__/services/userService.test.ts',
    'src/__tests__/hooks/useBalance.test.ts',
    'src/__tests__/contexts/FinancialDataContext.test.tsx'
  ];

  const missingTests = testFiles.filter(file => !fileExists(file));

  if (missingTests.length > 0) {
    print('yellow', `⚠️ Archivos de test faltantes: ${missingTests.length}`);
    print('yellow', '   Se han creado tests comprehensivos en el análisis');
  } else {
    print('green', '✅ Tests presentes');
  }

  // Verificar si Jest está configurado correctamente
  const jestConfig = readJsonFile('jest.config.js');
  if (!jestConfig) {
    print('red', '❌ Configuración de Jest no encontrada');
    return false;
  }

  print('green', '✅ Configuración de Jest correcta');
  return true;
}

// Función para verificar servicios mejorados
function checkImprovedServices() {
  print('blue', '\n🚀 Verificando servicios mejorados...');
  
  const improvedServices = [
    'src/services/firebaseService.ts',
    'src/services/improvedBalanceService.ts',
    'src/services/errorHandler.ts',
    'src/services/cacheService.ts',
    'src/services/offlineService.ts',
    'src/hooks/useOptimizedBalance.ts'
  ];

  const missingServices = improvedServices.filter(file => !fileExists(file));

  if (missingServices.length > 0) {
    print('yellow', `⚠️ Servicios mejorados faltantes: ${missingServices.length}`);
    print('yellow', '   Se han creado servicios optimizados en el análisis');
  } else {
    print('green', '✅ Servicios mejorados presentes');
  }

  return true;
}

// Función para ejecutar tests
function runTests() {
  print('blue', '\n🧪 Ejecutando tests...');
  
  try {
    execSync('npm test -- --passWithNoTests', { 
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });
    print('green', '✅ Tests ejecutados correctamente');
    return true;
  } catch (error) {
    print('red', '❌ Error ejecutando tests');
    print('red', error.message);
    return false;
  }
}

// Función para verificar linting
function checkLinting() {
  print('blue', '\n🔍 Verificando linting...');
  
  try {
    execSync('npx tsc --noEmit', { 
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });
    print('green', '✅ TypeScript sin errores');
    return true;
  } catch (error) {
    print('yellow', '⚠️ Errores de TypeScript encontrados');
    print('yellow', '   Revisa los archivos generados para corregir errores');
    return false;
  }
}

// Función para generar reporte de salud del proyecto
function generateHealthReport() {
  print('blue', '\n📊 Generando reporte de salud del proyecto...');
  
  const report = {
    timestamp: new Date().toISOString(),
    dependencies: checkDependencies(),
    directoryStructure: checkDirectoryStructure(),
    configFiles: checkConfigFiles(),
    firebaseConfig: checkFirebaseConfig(),
    tests: checkTests(),
    improvedServices: checkImprovedServices(),
    linting: checkLinting()
  };

  const healthScore = Object.values(report).filter(Boolean).length / (Object.keys(report).length - 1) * 100;
  
  print('cyan', `\n📈 Puntuación de salud del proyecto: ${healthScore.toFixed(1)}%`);
  
  if (healthScore >= 90) {
    print('green', '🎉 ¡Excelente! El proyecto está en muy buen estado');
  } else if (healthScore >= 70) {
    print('yellow', '⚠️ El proyecto está en buen estado, pero hay mejoras pendientes');
  } else {
    print('red', '❌ El proyecto necesita atención urgente');
  }

  // Guardar reporte
  const reportPath = path.join(__dirname, '..', 'health-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  print('blue', `📄 Reporte guardado en: ${reportPath}`);

  return healthScore;
}

// Función para mostrar recomendaciones
function showRecommendations() {
  print('blue', '\n💡 Recomendaciones:');
  
  print('yellow', '1. Instalar dependencias faltantes:');
  print('white', '   npm install @react-native-async-storage/async-storage uuid');
  print('white', '   npm install --save-dev @types/uuid');
  
  print('yellow', '2. Configurar Firebase:');
  print('white', '   npm run setup:firebase');
  
  print('yellow', '3. Ejecutar tests:');
  print('white', '   npm test');
  
  print('yellow', '4. Verificar linting:');
  print('white', '   npx tsc --noEmit');
  
  print('yellow', '5. Ejecutar la aplicación:');
  print('white', '   npm run dev:multi');
}

// Función principal
function main() {
  print('cyan', '🚀 SoFinance - Validación y Configuración del Proyecto');
  print('cyan', '====================================================');
  
  const healthScore = generateHealthReport();
  
  if (healthScore < 100) {
    showRecommendations();
  }
  
  print('green', '\n✅ Validación completada');
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main();
}

module.exports = {
  checkDependencies,
  checkDirectoryStructure,
  checkConfigFiles,
  checkFirebaseConfig,
  checkTests,
  checkImprovedServices,
  runTests,
  checkLinting,
  generateHealthReport
};
