import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // <- Añade esta importación

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // <- Activa el compilador aquí
  ],
  base: './', // Ruta relativa obligatoria para Itch.io
});