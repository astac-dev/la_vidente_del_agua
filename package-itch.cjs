const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('==================================================');
console.log('   EMPAQUETADOR DE LA VIDENTE DEL AGUA (ITCH.IO)  ');
console.log('==================================================\n');

// 1. Validar guiones JSON
console.log('Paso 1: Validando guiones y traducciones...');
try {
  execSync('node validate-script.cjs', { stdio: 'inherit' });
  console.log('✅ Validación completada con éxito.\n');
} catch (error) {
  console.error('❌ Error crítico de validación. Revisa los archivos JSON.');
  process.exit(1);
}

// 2. Compilar con base relativa
console.log('Paso 2: Compilando el proyecto para itch.io (base: "./")...');
try {
  execSync('npm run build:itch', { stdio: 'inherit' });
  console.log('✅ Compilación finalizada en el directorio /dist.\n');
} catch (error) {
  console.error('❌ Error de compilación con Vite.');
  process.exit(1);
}

// 3. Crear el archivo ZIP
console.log('Paso 3: Creando archivo comprimido ZIP para itch.io...');
const zipName = 'la_vidente_del_agua_alpha.zip';
const zipPath = path.join(__dirname, zipName);

// Eliminar zip antiguo si existe
if (fs.existsSync(zipPath)) {
  try {
    fs.unlinkSync(zipPath);
    console.log(`🗑️ Removiendo archivo ZIP anterior: ${zipName}`);
  } catch (err) {
    console.warn(`⚠️ No se pudo eliminar el ZIP existente: ${err.message}`);
  }
}

let success = false;

// Método A: Intentar usar 'tar' (disponible nativamente en Windows 10/11, macOS y Linux)
try {
  console.log('Intentando comprimir usando "tar"...');
  // -a autodetecta compresión zip por la extensión .zip
  execSync(`tar -a -c -f "${zipName}" -C dist .`, { stdio: 'ignore' });
  if (fs.existsSync(zipPath)) {
    console.log('✅ Archivo ZIP creado exitosamente usando "tar".');
    success = true;
  }
} catch (err) {
  console.log('ℹ️ "tar" no disponible o falló, intentando método alternativo...');
}

// Método B: Si falló 'tar' y estamos en Windows, usar PowerShell Compress-Archive
if (!success && process.platform === 'win32') {
  try {
    console.log('Intentando comprimir usando PowerShell Compress-Archive...');
    execSync(`powershell -Command "Compress-Archive -Path dist\\* -DestinationPath '${zipName}' -Force"`, { stdio: 'inherit' });
    if (fs.existsSync(zipPath)) {
      console.log('✅ Archivo ZIP creado exitosamente usando PowerShell.');
      success = true;
    }
  } catch (err) {
    console.error('❌ Falló PowerShell Compress-Archive:', err.message);
  }
}

// Método C: Si falló y estamos en Unix, intentar usar command line 'zip'
if (!success && process.platform !== 'win32') {
  try {
    console.log('Intentando comprimir usando "zip"...');
    execSync(`cd dist && zip -r "../${zipName}" ./*`, { stdio: 'ignore' });
    if (fs.existsSync(zipPath)) {
      console.log('✅ Archivo ZIP creado exitosamente usando "zip".');
      success = true;
    }
  } catch (err) {
    console.error('❌ Falló comando "zip":', err.message);
  }
}

if (success) {
  console.log('\n==================================================');
  console.log(`🎉 ¡ÉXITO! Paquete listo para itch.io.`);
  console.log(`📦 Archivo generado: ${zipName}`);
  console.log('==================================================');
} else {
  console.error('\n❌ ERROR: No se pudo generar el archivo ZIP.');
  console.error('Por favor, instala "zip" o "tar", o comprime manualmente los contenidos de la carpeta "/dist" como un archivo ZIP.');
  process.exit(1);
}
