#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Iniciando SoFinance - Desarrollo Multiplataforma');
console.log('📱 Mobile: http://localhost:8081');
console.log('🌐 Web: http://localhost:3000');
console.log('');

// Función para iniciar un proceso
function startProcess(command, args, options) {
  const process = spawn(command, args, {
    stdio: 'inherit',
    shell: true,
    ...options
  });

  process.on('error', (error) => {
    console.error(`❌ Error en ${command}:`, error.message);
  });

  process.on('close', (code) => {
    if (code !== 0) {
      console.log(`⚠️  ${command} terminó con código ${code}`);
    }
  });

  return process;
}

// Iniciar Expo (Mobile)
console.log('📱 Iniciando Expo...');
const expoProcess = startProcess('npx', ['expo', 'start'], {
  cwd: process.cwd()
});

// Esperar un poco antes de iniciar webpack
setTimeout(() => {
  console.log('🌐 Iniciando Webpack...');
  const webpackProcess = startProcess('npm', ['run', 'web'], {
    cwd: process.cwd()
  });
}, 2000);

// Manejar cierre del proceso
process.on('SIGINT', () => {
  console.log('\n🛑 Cerrando procesos...');
  expoProcess.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Cerrando procesos...');
  expoProcess.kill();
  process.exit(0);
});
