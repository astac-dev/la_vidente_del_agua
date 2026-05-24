import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './i18n'; // Importa la configuración de i18next

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Suspense fallback="Cargando traducciones...">
      <App />
    </Suspense>
  </React.StrictMode>
);