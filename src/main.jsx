import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './i18n'; // Importa la configuración de i18next
import { GameStateProvider } from './context/GameStateContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GameStateProvider>
      <Suspense fallback="Cargando traducciones...">
        <App />
      </Suspense>
    </GameStateProvider>
  </React.StrictMode>
);