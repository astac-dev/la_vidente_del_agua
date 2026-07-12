const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const manifestPath = path.join(publicDir, 'manifest.json');

// Directorios a escanear dentro de public/
const directoriesToScan = [
  'backgrounds',
  'bgm',
  'sprites',
  'arte',
  'assets/thumbnails',
  'vfx',
  'fonts'
];

// Opcional: Agregar archivos fijos que siempre se deben precargar
const baseAssets = [
  { name: 'Logotipo principal', url: './logo.jpg' },
  { name: 'Ilustración del menú', url: './assets/ui/fondo_menu_principal.jpg' }
];

function scanDirectory(dirRelativePath) {
  const dirPath = path.join(publicDir, dirRelativePath);
  let filesList = [];
  
  if (!fs.existsSync(dirPath)) return filesList;

  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      filesList = filesList.concat(scanDirectory(path.join(dirRelativePath, file)));
    } else {
      // Filtrar por extensiones válidas para precarga (imágenes, audio, fuentes)
      const ext = path.extname(file).toLowerCase();
      if (['.png', '.jpg', '.jpeg', '.webp', '.mp3', '.ogg', '.wav', '.woff2', '.ttf'].includes(ext)) {
        // Normalizar la ruta para web con forward slashes
        const urlPath = './' + path.join(dirRelativePath, file).replace(/\\/g, '/');
        filesList.push({
          name: file,
          url: urlPath
        });
      }
    }
  }
  return filesList;
}

function generateManifest() {
  console.log('Generando manifest de recursos para la pantalla de carga...');
  let allAssets = [...baseAssets];

  for (const dir of directoriesToScan) {
    const assetsInDir = scanDirectory(dir);
    allAssets = allAssets.concat(assetsInDir);
  }

  // Eliminar duplicados si los hubiera
  const uniqueUrls = new Set();
  const finalAssets = [];
  for (const asset of allAssets) {
    if (!uniqueUrls.has(asset.url)) {
      uniqueUrls.add(asset.url);
      finalAssets.push(asset);
    }
  }

  const manifestContent = {
    generatedAt: new Date().toISOString(),
    totalAssets: finalAssets.length,
    assets: finalAssets
  };

  fs.writeFileSync(manifestPath, JSON.stringify(manifestContent, null, 2));
  console.log(`Manifest generado exitosamente con ${finalAssets.length} recursos en ${manifestPath}`);
}

generateManifest();
