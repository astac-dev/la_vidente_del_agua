import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import MenuButton from './MenuButton';
import { useGameState } from '../context/GameStateContext';
import mainMenuMusic from '/bgm/theme_main_menu.mp3';

/**
 * Realiza una transición suave (fade) del volumen de un elemento de audio.
 * Se implementa para evitar cortes de sonido secos que degraden la estética premium.
 * 
 * @param {HTMLAudioElement} audio - Elemento de audio a controlar.
 * @param {number} targetVolume - Volumen objetivo (entre 0.0 y 1.0).
 * @param {number} duration - Duración de la transición en milisegundos.
 * @param {function} [callback] - Función a ejecutar al completarse la transición.
 */
const fadeAudio = (audio, targetVolume, duration, callback) => {
  if (!audio) {
    if (callback) callback();
    return;
  }

  const startVolume = audio.volume;
  const diff = targetVolume - startVolume;
  if (diff === 0) {
    if (callback) callback();
    return;
  }

  const stepTime = 50;
  const steps = duration / stepTime;
  const stepChange = diff / steps;
  let currentStep = 0;

  if (audio.fadeInterval) {
    clearInterval(audio.fadeInterval);
  }

  audio.fadeInterval = setInterval(() => {
    currentStep++;
    let newVolume = startVolume + (stepChange * currentStep);

    if (diff > 0 && newVolume > targetVolume) newVolume = targetVolume;
    if (diff < 0 && newVolume < targetVolume) newVolume = targetVolume;
    if (newVolume < 0) newVolume = 0;
    if (newVolume > 1) newVolume = 1;

    audio.volume = newVolume;

    if (currentStep >= steps || newVolume === targetVolume) {
      clearInterval(audio.fadeInterval);
      audio.fadeInterval = null;
      if (callback) callback();
    }
  }, stepTime);
};

const MainMenu = ({ onNavigate, onExit }) => {
  const { t } = useTranslation();
  const { settings, resetGameState } = useGameState();
  const audioRef = useRef(null);

  // Efecto para inicializar y limpiar la música de fondo
  useEffect(() => {
    // 1. Se inicializa la instancia de audio de forma nativa con volumen 0 para el fade in
    const audio = new Audio(mainMenuMusic);
    audioRef.current = audio;
    audio.loop = true;
    audio.volume = 0;

    // 2. Se intenta la reproducción automática, manejando la política de los navegadores
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        // Desvanecimiento suave de entrada al iniciar exitosamente
        fadeAudio(audio, settings.volumenMusica / 100, 1500);
      }).catch(error => {
        console.warn("La reproducción automática de la música fue bloqueada por el navegador. Se activará con la primera interacción.", error);
        const handleInteraction = () => {
          audio.play().then(() => {
            fadeAudio(audio, settings.volumenMusica / 100, 1500);
          }).catch(err => console.error(err));
        };
        window.addEventListener('click', handleInteraction, { once: true });
      });
    }

    // 3. Se define la función de limpieza para detener y limpiar la instancia
    return () => {
      if (audio.fadeInterval) {
        clearInterval(audio.fadeInterval);
      }
      audio.pause();
      audio.src = '';
    };
  }, []); // El array vacío asegura que se ejecute solo al montar y desmontar

  // Efecto para actualizar el volumen si cambia en el contexto global (si no hay fade activo)
  useEffect(() => {
    if (audioRef.current && !audioRef.current.fadeInterval) {
      audioRef.current.volume = settings.volumenMusica / 100;
    }
  }, [settings.volumenMusica]);

  /**
   * Ejecuta una transición de navegación con un desvanecimiento de salida (fade out) de audio previo.
   * Esto sincroniza la desaparición del sonido con las animaciones de la UI.
   * 
   * @param {string} targetView - Nombre de la vista destino.
   * @param {number} fadeDuration - Duración del desvanecimiento en milisegundos.
   */
  const navigateWithFade = (targetView, fadeDuration, overrides = null) => {
    if (audioRef.current) {
      fadeAudio(audioRef.current, 0, fadeDuration, () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.src = '';
        }
      });
    }
    if (targetView === 'visualNovel') {
      resetGameState(overrides || { isModoExposicion: false });
    }
    onNavigate(targetView);
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
      {settings.juegoCompleto && (
        <MenuButton onClick={() => navigateWithFade('continueMenu', 500)}>{t('menu.continueGame')}</MenuButton>
      )}

      {/* Nueva partida ahora inicia la partida rápida */}
      <MenuButton onClick={() => navigateWithFade('visualNovel', 1500, { isModoExposicion: true, currentChapter: 'capitulo_1_1', currentSceneId: 'escena_1_1_inicio' })}>{t('menu.newGame')}</MenuButton>

      {settings.juegoCompleto && (
        <>
          {/* Opcionalmente dejar una vía al juego desde cero si está en juego completo */}
          <MenuButton onClick={() => navigateWithFade('visualNovel', 1500, { isModoExposicion: false })}>{t('menu.fullGame', 'Nueva partida (Modo historia)')}</MenuButton>
          <MenuButton onClick={() => navigateWithFade('continueMenu', 500)}>{t('menu.loadGame')}</MenuButton>
          <MenuButton onClick={() => navigateWithFade('extrasMenu', 500)}>{t('menu.extras')}</MenuButton>
        </>
      )}
      
      <MenuButton onClick={() => navigateWithFade('optionsMenu', 500)}>{t('menu.options')}</MenuButton>
      
      {settings.juegoCompleto && (
        <MenuButton onClick={() => navigateWithFade('credits', 1500)}>{t('menu.credits')}</MenuButton>
      )}
      
      <MenuButton onClick={handleExit}>{t('menu.exit')}</MenuButton>
    </div>
  );
};

export default MainMenu;