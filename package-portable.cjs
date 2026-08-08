const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('==================================================');
console.log('   EMPAQUETADOR PORTABLE (ELECTRON) - LA VIDENTE  ');
console.log('==================================================\n');

// 1. Compilar Vite
console.log('Paso 1: Compilando el proyecto Vite para producción (base: "./")...');
try {
  execSync('npm run build:itch', { stdio: 'inherit' });
  console.log('✅ Compilación de Vite finalizada.\n');
} catch (error) {
  console.error('❌ Error de compilación con Vite.');
  process.exit(1);
}

// 2. Copiar dist a electron_wrapper
console.log('Paso 2: Copiando archivos a electron_wrapper/dist...');
const sourceDist = path.join(__dirname, 'dist');
const targetDist = path.join(__dirname, 'electron_wrapper', 'dist');

try {
  // Limpiar dist de destino si existe
  if (fs.existsSync(targetDist)) {
    fs.rmSync(targetDist, { recursive: true, force: true });
  }
  
  // Copiar recursivamente (Node v16.7+)
  fs.cpSync(sourceDist, targetDist, { recursive: true });
  console.log('✅ Archivos estáticos copiados al wrapper.\n');
} catch (error) {
  console.error('❌ Error al copiar los archivos a electron_wrapper:', error.message);
  process.exit(1);
}

// 3. Empaquetar con Electron Builder
console.log('Paso 3: Empaquetando la aplicación nativa portable...');
try {
  // Ejecutamos electron-builder usando el package.json dentro de electron_wrapper
  execSync('npm run dist', { cwd: path.join(__dirname, 'electron_wrapper'), stdio: 'inherit' });
  console.log('✅ Ejecutable generado exitosamente en electron_wrapper/release.\n');
} catch (error) {
  console.error('❌ Error al empaquetar con Electron Builder.');
  process.exit(1);
}

console.log('==================================================');
console.log('🎉 ¡ÉXITO! Ejecutable listo.');
console.log('📦 Encuentra tu versión portable en: electron_wrapper/release');
console.log('==================================================');
