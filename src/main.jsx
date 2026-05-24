import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n'; // Importa la configuración de i18next
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Suspense fallback={<div>Cargando idiomas...</div>}>
      <App />
    </Suspense>
  </StrictMode>,
)
