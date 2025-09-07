#!/usr/bin/env node

const { spawn } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 SoFinance - Desarrollo Multiplataforma');
console.log('==========================================');
console.log('');

// Función para mostrar el menú
function showMenu() {
  console.log('Selecciona el modo de desarrollo:');
  console.log('1. 🌐 Solo Web (puerto 3000)');
  console.log('2. 📱 Solo Mobile (Expo - puerto 8081)');
  console.log('3. 🔥 Web + Mobile (ambos simultáneamente)');
  console.log('4. 📱 Mobile iOS + Android');
  console.log('5. 🛠️  Solo iOS Simulator');
  console.log('6. 🤖 Solo Android Emulator');
  console.log('7. ❌ Salir');
  console.log('');
}

// Función para iniciar un proceso
function startProcess(command, args, options = {}) {
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

// Función para iniciar desarrollo web
function startWeb() {
  console.log('🌐 Iniciando desarrollo web...');
  console.log('   URL: http://localhost:3000');
  return startProcess('npm', ['run', 'web']);
}

// Función para iniciar desarrollo mobile
function startMobile() {
  console.log('📱 Iniciando desarrollo mobile...');
  console.log('   URL: http://localhost:8081');
  return startProcess('npx', ['expo', 'start']);
}

// Función para iniciar iOS
function startIOS() {
  console.log('🍎 Iniciando iOS Simulator...');
  return startProcess('npx', ['expo', 'start', '--ios']);
}

// Función para iniciar Android
function startAndroid() {
  console.log('🤖 Iniciando Android Emulator...');
  return startProcess('npx', ['expo', 'start', '--android']);
}

// Función para iniciar ambos (web + mobile)
function startBoth() {
  console.log('🔥 Iniciando desarrollo completo...');
  console.log('   Web: http://localhost:3000');
  console.log('   Mobile: http://localhost:8081');
  
  const webProcess = startWeb();
  
  setTimeout(() => {
    const mobileProcess = startMobile();
    
    // Manejar cierre
    process.on('SIGINT', () => {
      console.log('\n🛑 Cerrando procesos...');
      webProcess.kill();
      mobileProcess.kill();
      process.exit(0);
    });
  }, 2000);
}

// Función para iniciar mobile completo
function startMobileFull() {
  console.log('📱 Iniciando desarrollo mobile completo...');
  console.log('   iOS + Android: http://localhost:8081');
  
  const mobileProcess = startMobile();
  
  process.on('SIGINT', () => {
    console.log('\n🛑 Cerrando procesos...');
    mobileProcess.kill();
    process.exit(0);
  });
}

// Función principal
function main() {
  showMenu();
  
  rl.question('Ingresa tu opción (1-7): ', (answer) => {
    switch (answer.trim()) {
      case '1':
        startWeb();
        break;
      case '2':
        startMobile();
        break;
      case '3':
        startBoth();
        break;
      case '4':
        startMobileFull();
        break;
      case '5':
        startIOS();
        break;
      case '6':
        startAndroid();
        break;
      case '7':
        console.log('👋 ¡Hasta luego!');
        rl.close();
        process.exit(0);
        break;
      default:
        console.log('❌ Opción inválida. Inténtalo de nuevo.');
        main();
        break;
    }
  });
}

// Manejar cierre
rl.on('close', () => {
  console.log('\n👋 ¡Hasta luego!');
  process.exit(0);
});

// Iniciar
main();
