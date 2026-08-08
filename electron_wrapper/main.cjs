const { app, BrowserWindow, protocol, net } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    title: "La Vidente del Agua",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false // Permitimos fetch() a archivos locales para la novela visual
    },
    autoHideMenuBar: true
  });

  // El directorio dist estará copiado dentro de electron_wrapper durante el empaquetado
  mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
}

app.whenReady().then(() => {
  // Manejo especial para cargar recursos estáticos de forma local en Electron si es necesario
  // aunque loadFile con webSecurity: false suele ser suficiente.

  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
