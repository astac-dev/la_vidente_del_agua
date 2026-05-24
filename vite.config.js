import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // 🚀 Esto permite que funcione en local y que GitHub Pages encuentre los archivos en internet
  base: '/la_vidente_del_agua/',
})
