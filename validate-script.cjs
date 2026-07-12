const fs = require('fs');
const path = require('path');

const filesToValidate = [
  { name: 'capitulo_0.json', path: 'src/data/chapters/capitulo_0.json' },
  { name: 'capitulo_1_1.json', path: 'src/data/chapters/capitulo_1_1.json' },
  { name: 'es/translation.json', path: 'public/locales/es/translation.json' },
  { name: 'en/translation.json', path: 'public/locales/en/translation.json' },
  { name: 'my/translation.json', path: 'public/locales/my/translation.json' }
];

let hasErrors = false;

filesToValidate.forEach((item) => {
  const fullPath = path.join(__dirname, item.path);
  try {
    const fileContent = fs.readFileSync(fullPath, 'utf8');
    JSON.parse(fileContent);
    console.log(`✅ Validación exitosa: JSON válido para ${item.name}.`);
  } catch (e) {
    console.error(`❌ Error crítico: JSON inválido para ${item.name}:`, e.message);
    hasErrors = true;
  }
});

if (hasErrors) {
  process.exit(1);
}
