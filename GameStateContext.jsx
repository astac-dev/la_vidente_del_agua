import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from '../i18n'; // Importar la instancia de i18n

const GameStateContext = createContext();

const defaultSettings = {
  idioma: 'es',
  volumenMusica: 80,
  volumenEfectos: 100,
  velocidadTexto: 50,
};

export const GameStateProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    try {
      const storedSettings = localStorage.getItem('vidente_agua_settings');
      return storedSettings ? JSON.parse(storedSettings) : defaultSettings;
    } catch (error) {
      console.error("Error al leer la configuración de localStorage:", error);
      return defaultSettings;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('vidente_agua_settings', JSON.stringify(settings));
      if (i18n.language !== settings.idioma) {
        i18n.changeLanguage(settings.idioma);
      }
    } catch (error) {
      console.error("Error al guardar la configuración en localStorage:", error);
    }
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings(prevSettings => ({ ...prevSettings, [key]: value }));
  };

  return (
    <GameStateContext.Provider value={{ settings, updateSetting }}>
      {children}
    </GameStateContext.Provider>
  );
};

export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (context === undefined) {
    throw new Error('useGameState debe ser usado dentro de un GameStateProvider');
  }
  return context;
};