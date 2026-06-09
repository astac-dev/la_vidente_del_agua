import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import MenuButton from './MenuButton';
import { useGameState } from '../context/GameStateContext';
import mainMenuMusic from '/bgm/theme_main_menu.mp3';

const MainMenu = ({ onNavigate, onExit }) => {
  const { t } = useTranslation();
  const { settings, resetGameState } = useGameState();
  const audioRef = useRef(null);

  // Efecto para inicializar y limpiar la música de fondo
  useEffect(() => {
    // 1. Se inicializa la instancia de audio de forma nativa
    const audio = new Audio(mainMenuMusic);
    audioRef.current = audio;

    // 2. Se configura el BGM
    audio.loop = true;
    audio.volume = settings.volumenMusica / 100;

    // 3. Se intenta la reproducción automática, manejando la política de los navegadores
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.warn("La reproducción automática de la música fue bloqueada por el navegador. Se activará con la primera interacción.", error);
        // Fallback: Si el navegador bloquea el inicio automático, se reproducirá en cuanto el usuario haga clic.
        window.addEventListener('click', () => audio.play(), { once: true });
      });
    }

    // 4. Se define la función de limpieza para detener y limpiar la instancia
    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []); // El array vacío asegura que se ejecute solo al montar y desmontar

  // Efecto para actualizar el volumen si cambia en el contexto global
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = settings.volumenMusica / 100;
    }
  }, [settings.volumenMusica]);
  
  const handleNewGame = () => {
    if (audioRef.current) {
      const audio = audioRef.current;
      const startVolume = audio.volume;
      const fadeDuration = 1500; // 1.5s
      const steps = 30;
      const stepVolume = startVolume / steps;
      const intervalTime = fadeDuration / steps;

      const fadeInterval = setInterval(() => {
        if (audio.volume > stepVolume) {
          audio.volume -= stepVolume;
        } else {
          audio.volume = 0;
          clearInterval(fadeInterval);
        }
      }, intervalTime);
    }
    resetGameState();
    onNavigate('visualNovel');
  };

  const handleExit = async () => {
    // Comprueba si la API de Tauri está disponible.
    if (window.__TAURI__) {
      try {
        // Accedemos directamente a la API core inyectada globalmente por Tauri v2 en la ventana
        await window.__TAURI__.core.invoke("plugin:window|close");
      } catch (e) {
        console.error("Error al cerrar la aplicación nativa mediante API global:", e);
      }
    } else {
      // En lugar de intentar un cierre que fallará, mostramos una pantalla de despedida.
      onExit();
    }
  };

  return (
    <div className="main-menu">
      <MenuButton onClick={() => onNavigate('continueMenu')}>{t('menu.continueGame')}</MenuButton>
      <MenuButton onClick={handleNewGame}>{t('menu.newGame')}</MenuButton>
      <MenuButton onClick={() => onNavigate('continueMenu')}>{t('menu.loadGame')}</MenuButton>
      <MenuButton onClick={() => onNavigate('extrasMenu')}>{t('menu.extras')}</MenuButton>
      <MenuButton onClick={() => onNavigate('optionsMenu')}>{t('menu.options')}</MenuButton>
      <MenuButton onClick={() => alert('Funcionalidad no implementada.')}>{t('menu.credits')}</MenuButton>
      <MenuButton onClick={handleExit}>{t('menu.exit')}</MenuButton>
    </div>
  );
};


export default MainMenu;