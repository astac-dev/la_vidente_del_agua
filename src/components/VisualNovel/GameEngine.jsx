// src/components/VisualNovel/GameEngine.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useVisualNovelEngine } from '../../hooks/useVisualNovelEngine';
import { useGameState } from '../../context/GameStateContext';
import { useTypewriter } from '../../hooks/useTypewriter';
import BackgroundLayer from './BackgroundLayer';
import CharacterLayer from './CharacterLayer';
import DialogueBox from './DialogueBox';
import ChoiceMenu from './ChoiceMenu';
import OrientationBlocker from './OrientationBlocker'; 
import HUD from './HUD';
import BatSwarmEffect from './BatSwarmEffect';
import RadarMinigame from './RadarMinigame';
import FullscreenEnterIcon from '../icons/FullscreenEnterIcon';
import FullscreenExitIcon from '../icons/FullscreenExitIcon';
import glifoAgua from '../../assets/arte/glifoaguafluyendo.png';
import qrCodeImage from '../../assets/qr_placeholder.png';
import '../VisualNovelContainer.css';
import DialogueLogModal from './DialogueLogModal';

const LogIcon = () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.8 5.2a1 1 0 0 0-1.4-1.4L19 5.2V4a1 1 0 0 0-2 0v1.2L15.6 3.8a1 1 0 0 0-1.4 1.4L15.6 6H8.4l1.4-1.4a1 1 0 0 0-1.4-1.4L7 5.2V4a1 1 0 0 0-2 0v1.2L3.6 3.8a1 1 0 0 0-1.4 1.4L3.6 6H3a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-.6l1.4-1.4zM19 19H5V8h14v11z"></path></svg>;
const HideUIIcon = () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5C21.27 7.61 17 4.5 12 4.5zm0 10c-2.48 0-4.5-2.02-4.5-4.5S9.52 5.5 12 5.5s4.5 2.02 4.5 4.5-2.02 4.5-4.5 4.5zm0-7C10.62 7.5 9.5 8.62 9.5 10s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5S13.38 7.5 12 7.5z"></path></svg>;
const ShowUIIcon = () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.44-4.75C21.27 7.61 17 4.5 12 4.5c-1.63 0-3.16.52-4.47 1.41l2.1 2.1C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l2.15 2.15L20.73 21 12 12.27 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2z"></path></svg>;
const HomeIcon = () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5z"></path></svg>;
const AutoIcon = () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7L8 5z"></path></svg>;
const SkipIcon = () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z"></path></svg>;

const getFullscreenElement = () => {
  return document.fullscreenElement || 
         document.webkitFullscreenElement || 
         document.mozFullScreenElement || 
         document.msFullscreenElement;
};

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

/**
 * Componente principal administrador del motor de la novela visual.
 * Carga de forma dinámica los guiones de los capítulos bajo demanda
 * para optimizar la memoria y evitar la importación estática masiva de datos.
 */
const GameEngine = ({ onNavigate }) => {
  const { t, i18n } = useTranslation();
  const { uiVisibility, settings, updateSetting, toggleUiVisibility, gameState, saves, saveGameToSlot, isFading, addToHistory, goToScene } = useGameState();
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(!!getFullscreenElement());
  const [fullscreenError, setFullscreenError] = useState('');
  const [scriptData, setScriptData] = useState(null);
  const containerRef = useRef(null);

  /**
   * Referencias persistentes para la gestión nativa de los canales de audio BGM y SFX.
   * Se declaran con useRef para mantener vivas las instancias del reproductor HTML5
   * y controlarlas de forma directa evitando re-creaciones en cada render.
   */
  const bgmAudioRef = useRef(null);
  const sfxAudioRef = useRef(null);
  const currentBgmSrcRef = useRef(null);

  /**
   * Normaliza y resuelve las rutas del directorio público (/public) del juego.
   * Modula la ruta base con import.meta.env.BASE_URL para garantizar consistencia
   * en los despliegues de producción (GitHub Pages) y portabilidad (itch.io).
   * 
   * @param {string} src - Ruta original del recurso en el proyecto.
   * @returns {string} Ruta de recurso final del entorno.
   */
  const getAssetUrl = (src) => {
    if (!src) return '';
    return src.startsWith('/') 
      ? `${import.meta.env.BASE_URL}${src.slice(1)}` 
      : src;
  };

  // Carga dinámica asíncrona del capítulo actual de la novela visual
  useEffect(() => {
    const loadChapterData = async () => {
      try {
        const chapterModule = await import(`../../data/chapters/${gameState.currentChapter}.json`);
        setScriptData(chapterModule.default);
      } catch (error) {
        console.error("Error crítico al cargar el mapa narrativo:", error);
      }
    };
    loadChapterData();
  }, [gameState.currentChapter]);

  // Hook del motor adaptado para recibir scriptData cargado dinámicamente
  const { currentScene, currentLine, isChoice, isEndOfScene, advance, makeChoice, skipToNextChoice, cancelChoice } = useVisualNovelEngine(scriptData);

  /**
   * Determina si un elemento específico de la interfaz debe estar resaltado
   * basándose en la configuración de la línea actual del guion.
   * Soporta cadenas simples, listas separadas por comas o arreglos.
   * 
   * @param {string} target - Identificador del componente de UI (ej. 'btn-fullscreen', 'glifo-agua').
   * @returns {boolean} Verdadero si el componente debe ser resaltado.
   */
  const isHighlighted = (target) => {
    if (!currentLine?.highlight) return false;
    
    if (Array.isArray(currentLine.highlight)) {
      return currentLine.highlight.includes(target);
    }
    
    if (typeof currentLine.highlight === 'string') {
      const parts = currentLine.highlight.split(',').map(s => s.trim());
      if (parts.includes(target)) return true;
      if (parts.includes('hud-buttons')) {
        const hudButtons = ['btn-fullscreen', 'btn-home', 'btn-log', 'btn-skip', 'btn-auto', 'btn-hide'];
        if (hudButtons.includes(target)) return true;
      }
      return currentLine.highlight === target;
    }
    
    return false;
  };

  /**
   * Gestiona el inicio, cambio y detención de la música de fondo (BGM).
   * Se dispara ante cambios en la escena actual; si la escena define la misma
   * pista que la anterior, se da continuidad a la reproducción sin interrupción.
   */
  useEffect(() => {
    if (!currentScene) return;

    const bgm = currentScene.bgm;
    if (bgm && bgm.action === 'play') {
      const src = getAssetUrl(bgm.src);
      if (currentBgmSrcRef.current !== src) {
        if (bgmAudioRef.current) {
          const prevAudio = bgmAudioRef.current;
          fadeAudio(prevAudio, 0, 1000, () => {
            prevAudio.pause();
            prevAudio.src = '';
          });
        }

        const audio = new Audio(src);
        audio.loop = true;
        audio.volume = 0; // Iniciar en 0 para el fade-in
        
        audio.addEventListener('error', (e) => {
          console.warn(`No se pudo cargar el archivo BGM: ${src}`, e);
        });

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            fadeAudio(audio, settings.volumenMusica / 100, 1000);
          }).catch(err => {
            console.warn(`Reproducción de BGM bloqueada o interrumpida: ${src}`, err);
          });
        }

        bgmAudioRef.current = audio;
        currentBgmSrcRef.current = src;
      }
    } else if (bgm && bgm.action === 'stop') {
      if (bgmAudioRef.current) {
        const audio = bgmAudioRef.current;
        fadeAudio(audio, 0, 1000, () => {
          audio.pause();
          audio.src = '';
        });
        bgmAudioRef.current = null;
      }
      currentBgmSrcRef.current = null;
    }
  }, [currentScene]);

  /**
   * Gestiona la ejecución puntual de efectos de sonido (SFX).
   * Reproduce el sonido de una sola vez sin loops y detiene cualquier
   * efecto anterior activo para prevenir ruidos encimados.
   */
  useEffect(() => {
    if (!currentScene) return;

    const sfx = currentScene.sfx;
    if (sfx && sfx.action === 'play') {
      const src = getAssetUrl(sfx.src);
      
      if (sfxAudioRef.current) {
        sfxAudioRef.current.pause();
        sfxAudioRef.current.src = '';
      }

      const audio = new Audio(src);
      audio.loop = sfx.loop || false;
      audio.volume = settings.volumenEfectos / 100;

      audio.addEventListener('error', (e) => {
        console.warn(`No se pudo cargar el archivo SFX: ${src}`, e);
      });

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.warn(`Reproducción de SFX bloqueada o interrumpida: ${src}`, err);
        });
      }

      sfxAudioRef.current = audio;
    } else if (sfx && sfx.action === 'stop') {
      if (sfxAudioRef.current) {
        sfxAudioRef.current.pause();
        sfxAudioRef.current.src = '';
        sfxAudioRef.current = null;
      }
    }
  }, [currentScene]);

  /**
   * Gestiona la ejecución puntual de efectos de sonido (SFX) a nivel de línea de diálogo.
   */
  useEffect(() => {
    if (!currentLine || !currentLine.sfx) return;

    const sfx = currentLine.sfx;
    if (sfx.action === 'play') {
      const src = getAssetUrl(sfx.src);
      
      const audio = new Audio(src);
      audio.loop = sfx.loop || false;
      audio.volume = settings.volumenEfectos / 100;

      audio.addEventListener('error', (e) => {
        console.warn(`No se pudo cargar el archivo SFX de línea: ${src}`, e);
      });

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.warn(`Reproducción de SFX de línea bloqueada o interrumpida: ${src}`, err);
        });
      }
    }
  }, [currentLine]);

  /**
   * Sincroniza dinámicamente los cambios de volumen de música.
   * Esto permite ajustar la música de fondo en tiempo real desde el menú de opciones.
   */
  useEffect(() => {
    if (bgmAudioRef.current) {
      bgmAudioRef.current.volume = settings.volumenMusica / 100;
    }
  }, [settings.volumenMusica]);

  /**
   * Sincroniza dinámicamente los cambios de volumen de efectos de sonido.
   * Esto permite ajustar los efectos de sonido en tiempo real desde el menú de opciones.
   */
  useEffect(() => {
    if (sfxAudioRef.current) {
      sfxAudioRef.current.volume = settings.volumenEfectos / 100;
    }
  }, [settings.volumenEfectos]);

  /**
   * Limpia y libera los recursos de audio ocupados al desmontar el motor de juego.
   * Esto previene fugas de audio de fondo y previene problemas al regresar al menú principal.
   */
  useEffect(() => {
    return () => {
      if (bgmAudioRef.current) {
        if (bgmAudioRef.current.fadeInterval) {
          clearInterval(bgmAudioRef.current.fadeInterval);
        }
        bgmAudioRef.current.pause();
        bgmAudioRef.current.src = '';
      }
      if (sfxAudioRef.current) {
        sfxAudioRef.current.pause();
        sfxAudioRef.current.src = '';
      }
    };
  }, []);

  // Registrar cada diálogo visto en el historial
  useEffect(() => {
    if (!currentLine || isChoice) return;
    
    addToHistory({
      chapter: gameState.currentChapter,
      sceneId: gameState.currentSceneId,
      dialogueIndex: gameState.dialogueIndex,
      character: currentLine.personaje,
      textKey: `historia.${gameState.currentChapter}.escenas.${gameState.currentSceneId}.dialogos.${gameState.dialogueIndex}.texto`,
      fallbackText: currentLine.texto
    });
  }, [currentLine, isChoice, gameState.currentChapter, gameState.currentSceneId, gameState.dialogueIndex, addToHistory]);

  const handleHomeClick = () => {
    if (isFullscreen) return;
    setShowSaveModal(true);
  };

  const handleSaveAndExit = (slotIndex) => {
    saveGameToSlot(slotIndex);
    setShowSaveModal(false);
    if (bgmAudioRef.current) {
      fadeAudio(bgmAudioRef.current, 0, 1500, () => {
        if (bgmAudioRef.current) {
          bgmAudioRef.current.pause();
          bgmAudioRef.current.src = '';
        }
      });
    }
    onNavigate('mainMenu');
  };

  const handleExitWithoutSaving = () => {
    setShowSaveModal(false);
    if (bgmAudioRef.current) {
      fadeAudio(bgmAudioRef.current, 0, 1500, () => {
        if (bgmAudioRef.current) {
          bgmAudioRef.current.pause();
          bgmAudioRef.current.src = '';
        }
      });
    }
    onNavigate('mainMenu');
  };

  useEffect(() => {
    if (fullscreenError) {
      const timer = setTimeout(() => setFullscreenError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [fullscreenError]);

  const handleAdvanceClick = (e) => {
    e.stopPropagation();
    advance();
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!getFullscreenElement());
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    const element = document.documentElement;
    const fullscreenElement = getFullscreenElement();

    const handleFullscreenBlock = (err) => {
      console.error(err);
      if (window.self !== window.top) {
        setFullscreenError("Modo pantalla completa (F11) bloqueado por el contenedor de vista previa. Abre el juego en una pestaña externa de Chrome/Edge.");
      } else {
        setFullscreenError(err.message || String(err));
      }
    };

    if (!fullscreenElement) {
      if (element.requestFullscreen) {
        element.requestFullscreen().catch(handleFullscreenBlock);
      } else if (element.webkitRequestFullscreen) {
        try {
          element.webkitRequestFullscreen();
        } catch (err) {
          handleFullscreenBlock(err);
        }
      } else if (element.mozRequestFullScreen) {
        try {
          element.mozRequestFullScreen();
        } catch (err) {
          handleFullscreenBlock(err);
        }
      } else if (element.msRequestFullscreen) {
        try {
          element.msRequestFullscreen();
        } catch (err) {
          handleFullscreenBlock(err);
        }
      } else {
        setFullscreenError("Su navegador no admite la API de pantalla completa.");
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(handleFullscreenBlock);
      } else if (document.webkitExitFullscreen) {
        try {
          document.webkitExitFullscreen();
        } catch (err) {
          handleFullscreenBlock(err);
        }
      } else if (document.mozCancelFullScreen) {
        try {
          document.mozCancelFullScreen();
        } catch (err) {
          handleFullscreenBlock(err);
        }
      } else if (document.msExitFullscreen) {
        try {
          document.msExitFullscreen();
        } catch (err) {
          handleFullscreenBlock(err);
        }
      }
    }
  };

  const handleAutoClick = () => {
    const speeds = [1, 2, 3, 4];
    const currentSpeedIndex = speeds.indexOf(settings.textSpeed || 1);
    const nextSpeed = speeds[(currentSpeedIndex + 1) % speeds.length];
    updateSetting('textSpeed', nextSpeed);
  };



  const handleToggleSkip = () => {
    skipToNextChoice();
  };

  const handleToggleLog = () => {
    setShowLogModal(true);
  };

  const dialogueKey = `historia.${gameState?.currentChapter}.escenas.${gameState?.currentSceneId}.dialogos.${gameState?.dialogueIndex}.texto`;
  const translatedDialogue = t(dialogueKey, currentLine?.texto);
  
  const speedMapping = {
    1: 40,  // x1: Efecto maquina de escribir (40ms por letra)
    2: 100, // x2: 2 palabras/seg (aprox 100ms por letra)
    3: 40,  // x3: 5 palabras/seg (aprox 40ms por letra)
    4: 0    // x4: De golpe
  };
  const textSpeedValue = speedMapping[settings.textSpeed || 1];
  const { displayedText, isTyping } = useTypewriter(translatedDialogue, textSpeedValue);

  if (!scriptData || !currentScene) {
    return (
      <div className="ark-view-wrapper w-full h-screen bg-neutral-950 flex flex-col items-center justify-center relative">
        <button 
          onClick={() => onNavigate('mainMenu')} 
          className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-neutral-700 rounded text-neutral-300 hover:text-white hover:border-amber-500 transition-colors pointer-events-auto shadow-lg"
          title={t('interface.backToMenu', 'Volver al Menú')}
        >
          <div className="w-5 h-5"><HomeIcon /></div>
          <span className="font-mono text-xs font-bold tracking-wider uppercase">{t('interface.homeLabel', 'HOME')}</span>
        </button>
        <div className="text-amber-500 font-mono text-sm tracking-wider animate-pulse mt-12">
          Sincronizando bitácora de campo...
        </div>
      </div>
    );
  }

  const buttonBaseClasses = "hud-button-custom relative flex flex-col items-center justify-center transition-all duration-150 bg-black/40 border border-neutral-800 hover:bg-neutral-900/80 hover:border-amber-400 text-neutral-400 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed pointer-events-auto";

  const questionKey = `historia.${gameState?.currentChapter}.escenas.${gameState?.currentSceneId}.elecciones.pregunta`;
  const translatedQuestion = t(questionKey, currentScene?.pregunta);

  const translatedOptions = currentScene?.opciones
    ? currentScene.opciones.map((option, index) => {
        const optionKey = `historia.${gameState?.currentChapter}.escenas.${gameState?.currentSceneId}.elecciones.opciones.${index}.texto`;
        return {
          ...option,
          texto: t(optionKey, option.texto),
        };
      })
    : [];

  return (
    <>
      <OrientationBlocker />

      <div className="ark-view-wrapper w-full h-screen bg-neutral-950 flex items-center justify-center overflow-hidden">
        
        <div 
          ref={containerRef}
          className="ark-scene-container relative w-full max-w-[177.78vh] aspect-video max-h-screen overflow-hidden"
          style={{ '--ui-scale-multiplier': `${(settings.tamanoLetra || 100) / 100}` }}
        >
          {fullscreenError && (
            <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[100] bg-red-950/90 border border-red-500 text-red-200 px-4 py-2 rounded shadow-lg font-mono text-xs max-w-md text-center pointer-events-auto">
              <strong className="block text-red-400 font-bold mb-0.5">ERROR PANTALLA COMPLETA:</strong>
              {fullscreenError}
            </div>
          )}
          <BackgroundLayer background={currentScene.background} />
          <CharacterLayer 
            currentSpeaker={currentLine?.personaje}
            sprites={
              currentLine?.character_sprite 
                ? [{
                    id: currentLine.personaje && currentLine.personaje !== 'sistema' && currentLine.personaje !== 'narrador' ? currentLine.personaje : 'amaranta',
                    src: currentLine.character_sprite.startsWith('/') 
                      ? currentLine.character_sprite 
                      : `/${currentLine.character_sprite}`,
                    position: currentLine.position || 'left',
                    expression: currentLine.expression,
                    entry_animation: currentLine.entry_animation,
                    flameActive: gameState.currentChapter === 'capitulo_0' || currentLine.flame_active || false
                  }]
                : (currentLine?.sprites || currentScene.sprites)
            } 
          />
          <div className="scene-overlay" />

          {/* Efectos visuales en pantalla basados en el diálogo actual */}
          {currentLine?.screen_effect === 'white_flash' && (
            <div key={`effect-flash-${gameState?.dialogueIndex}`} className="effect-flash-white" />
          )}
          {currentLine?.screen_effect === 'bat_swarm' && (
            <BatSwarmEffect key={`effect-bats-${gameState?.dialogueIndex}`} />
          )}
          
          {/* Overlay de transición de fundido a negro (fade out/in) */}
          <div className={`absolute inset-0 bg-black z-[300] transition-opacity duration-500 ${isFading ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} />

          {uiVisibility && (
            <div className="absolute top-0 left-0 right-0 z-50 flex justify-between items-start p-4 pointer-events-none select-none bg-gradient-to-b from-black/70 to-transparent">
              
              <div className="flex flex-col items-start gap-1.5 pointer-events-auto">
                <div className="flex items-start gap-1.5">
                  <button 
                    onClick={toggleFullscreen} 
                    className={`${buttonBaseClasses} ${isHighlighted('btn-fullscreen') ? 'vn-highlight-active' : ''}`} 
                    title={isFullscreen ? t('interface.fullscreenExit', 'Salir de pantalla completa') : t('interface.fullscreenEnter', 'Pantalla completa')}
                  >
                    <div className="pt-1">
                      {isFullscreen ? <FullscreenExitIcon /> : <FullscreenEnterIcon />}
                    </div>
                    <span className="hud-button-label-custom font-mono tracking-tight uppercase opacity-60">
                      {t('interface.fullscreenLabel', 'PANTALLA COMPLETA')}
                    </span>
                  </button>
                  <button 
                    onClick={handleHomeClick} 
                    disabled={isFullscreen} 
                    className={`${buttonBaseClasses} ${isFullscreen ? 'opacity-25 pointer-events-none' : ''} ${isHighlighted('btn-home') ? 'vn-highlight-active' : ''}`}
                    title={t('interface.backToMenu', 'Volver al Menú')}
                  >
                    {!isFullscreen && <div className="absolute top-0 left-0 w-1 h-1 bg-amber-500" />}
                    <div className="pt-1"><HomeIcon /></div>
                    <span className="hud-button-label-custom font-mono tracking-tight uppercase opacity-60">
                      {t('interface.homeLabel', 'INICIO')}
                    </span>
                  </button>
                </div>
                {!isChoice && <HUD />}
              </div>

              <div className="absolute left-1/2 -translate-x-1/2 top-4 flex flex-col border-l-2 border-amber-500 pl-2 pr-4 py-0.5 bg-black/30 font-mono hidden sm:flex pointer-events-auto vn-site-badge">
                <span className="text-[10px] font-bold text-neutral-200 tracking-wider vn-site-badge-title">INAH-SAS // EXP.2011</span>
                <span className="text-[8px] text-neutral-500 tracking-widest mt-0.5 vn-site-badge-subtitle">SITE: HOYO_NEGRO</span>
              </div>

              <div className="flex gap-1.5">
                <button 
                  onClick={handleToggleLog} 
                  className={`${buttonBaseClasses} ${isHighlighted('btn-log') ? 'vn-highlight-active' : ''}`} 
                  title={t('interface.history', 'Historial')}
                >
                  <div className="pt-1"><LogIcon /></div>
                  <span className="hud-button-label-custom font-mono tracking-tight uppercase opacity-60">{t('interface.recLogLabel', 'HISTORIAL')}</span>
                </button>
                <button 
                  onClick={handleToggleSkip} 
                  className={`${buttonBaseClasses} ${isHighlighted('btn-skip') ? 'vn-highlight-active' : ''}`} 
                  title={t('interface.skip', 'Saltar')}
                >
                  <div className="pt-1"><SkipIcon /></div>
                  <span className="hud-button-label-custom font-mono tracking-tight uppercase opacity-60">{t('interface.narrSkpLabel', 'SALTAR')}</span>
                </button>
                <button 
                  onClick={handleAutoClick} 
                  className={`${buttonBaseClasses} ${isHighlighted('btn-auto') ? 'vn-highlight-active' : ''}`} 
                  title={t('interface.textSpeedMode', 'Velocidad de Texto')}
                >
                  <div className="pt-1 flex items-center justify-center gap-0.5">
                    <AutoIcon />
                    <span className="hud-button-speed-indicator leading-none">X{settings.textSpeed || 1}</span>
                  </div>
                  <span className="hud-button-label-custom font-mono tracking-tight uppercase opacity-60">{t('interface.textSpeedLabel', 'VELOCIDAD')}</span>
                </button>
                <button 
                  onClick={toggleUiVisibility} 
                  className={`${buttonBaseClasses} ${isHighlighted('btn-hide') ? 'vn-highlight-active' : ''}`} 
                  title={t('interface.hideUI', 'Ocultar Interfaz')}
                >
                    <div className="pt-1">{uiVisibility ? <HideUIIcon /> : <ShowUIIcon />}</div>
                    <span className="hud-button-label-custom font-mono tracking-tight uppercase opacity-60">{t('interface.hideUIButton', 'OCULTAR')}</span>
                </button>
              </div>
            </div>
          )}

          {uiVisibility && (
            <>
              {!isChoice && currentLine && (
                <DialogueBox
                  key={translatedDialogue} 
                  character={currentLine.personaje}
                  text={displayedText}
                  isHighlighted={isHighlighted('dialogue-box')}
                />
              )}

              {isChoice && (
                <ChoiceMenu
                  question={translatedQuestion}
                  options={translatedOptions}
                  onChoice={makeChoice}
                  onCancel={cancelChoice}
                />
              )}

              {!isChoice && !isEndOfScene && (
                <img
                  src={glifoAgua}
                  className={`vn-glifo-indicator ${isHighlighted('glifo-agua') ? 'vn-highlight-active' : ''}`}
                  alt="Continuar"
                  onClick={handleAdvanceClick}
                  style={{ cursor: 'pointer', pointerEvents: 'auto', zIndex: 100 }}
                />
              )}
            </>
          )}

          {!uiVisibility && (
            <div 
              className="absolute inset-0 z-50 cursor-pointer pointer-events-auto bg-transparent"
              onClick={toggleUiVisibility}
              title={t('interface.showUI', 'Haga clic en cualquier parte para mostrar la interfaz')}
            />
          )}

          {currentScene.type === 'minigame' && currentScene.minigame === 'radar_sonar' && (
            <RadarMinigame
              onSuccess={() => {
                if (currentScene.onSuccess) goToScene(currentScene.onSuccess);
              }}
              onFailure={() => {
                if (currentScene.onFailure) goToScene(currentScene.onFailure);
              }}
            />
          )}

          {currentScene.type === 'custom_message' && (
            <div 
              className="absolute inset-0 z-[210] flex items-center justify-center bg-black pointer-events-auto cursor-pointer animate-[fadeIn_1s_ease-out_forwards]"
              onClick={(e) => {
                e.stopPropagation();
                if (currentScene.next === 'mainMenu') {
                  if (bgmAudioRef.current) {
                    fadeAudio(bgmAudioRef.current, 0, 1500, () => {
                      if (bgmAudioRef.current) {
                        bgmAudioRef.current.pause();
                        bgmAudioRef.current.src = '';
                      }
                    });
                  }
                  onNavigate('mainMenu');
                } else if (currentScene.next) {
                  advance();
                } else {
                  if (bgmAudioRef.current) {
                    fadeAudio(bgmAudioRef.current, 0, 1500, () => {
                      if (bgmAudioRef.current) {
                        bgmAudioRef.current.pause();
                        bgmAudioRef.current.src = '';
                      }
                    });
                  }
                  onNavigate('mainMenu');
                }
              }}
            >
              <div className="text-center px-8 text-neutral-200 font-sans max-w-xl">
                <p className="leading-relaxed tracking-wide vn-dialogue-text">
                  {t(`historia.${gameState?.currentChapter}.escenas.${gameState?.currentSceneId}.texto`, currentScene.text)}
                </p>
                {currentScene.showQR && (
                  <div className="mt-8 flex flex-col items-center justify-center">
                    <div className="w-48 h-48 bg-white p-2 rounded-lg mb-4 flex items-center justify-center shadow-[0_0_15px_rgba(251,191,36,0.3)] border border-amber-500/30">
                      <img src={qrCodeImage} alt="QR Code" className="w-full h-full object-contain" onError={(e) => e.target.src = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://www.inah.gob.mx/'} />
                    </div>
                    <p className="text-amber-400 font-mono font-bold tracking-wider" style={{ fontSize: `calc(0.875rem * var(--ui-scale-multiplier, 1))` }}>{t('interface.scanQr', '¡Escanea para jugar la versión completa!')}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {showSaveModal && (
            <div className="absolute inset-0 bg-black/85 flex items-center justify-center z-[200] pointer-events-auto select-none">
              <div className="bg-neutral-900/95 border border-amber-500/30 p-6 rounded-lg shadow-2xl max-w-md w-full mx-4 font-mono text-left vn-save-modal">
                <h3 className="text-lg font-bold text-amber-400 mb-2 border-b border-amber-500/20 pb-2 flex justify-between items-center vn-save-modal-title">
                  <span>{t('interface.saveSlotTitle', 'GUARDAR PARTIDA')}</span>
                  <span className="text-[9px] font-normal text-neutral-500 tracking-wider vn-save-modal-subtitle">SYS.SAV // SLOT_SELECT</span>
                </h3>
                <p className="text-xs text-neutral-400 mb-4 leading-relaxed vn-save-modal-prompt">
                  {t('interface.saveSlotPrompt', 'Selecciona una ranura de guardado para registrar tu progreso antes de salir:')}
                </p>
                
                <div className="flex flex-col gap-2.5 mb-5 vn-save-slots-container">
                  {[0, 1, 2].map((slotIndex) => {
                    const save = saves[slotIndex];
                    const hasSave = !!save;
                    let saveName = t('interface.emptySlot', 'Espacio Vacío');
                    let saveTime = '';
                    if (hasSave) {
                      const chTitle = t(`historia.${save.chapterId}.titulo`, save.chapterId);
                      const scTitle = t(`historia.${save.chapterId}.escenas.${save.sceneId}.titulo_escena`, save.sceneId);
                      saveName = `${chTitle} - ${scTitle}`;
                      const dateLocale = i18n.language === 'my' ? 'es-MX' : i18n.language;
                      saveTime = new Date(save.timestamp).toLocaleString(dateLocale);
                    }

                    return (
                      <button
                        key={slotIndex}
                        onClick={() => handleSaveAndExit(slotIndex)}
                        className="w-full text-left p-3 rounded border border-neutral-800 bg-neutral-950/70 hover:bg-neutral-900 hover:border-amber-400 transition-all group flex flex-col gap-1 cursor-pointer vn-save-slot-btn"
                      >
                        <div className="flex justify-between items-center w-full vn-save-slot-header">
                          <span className="text-[10px] font-bold text-neutral-500 group-hover:text-amber-400 vn-save-slot-label">
                            {t('interface.saveSlot', 'Ranura').toUpperCase()} 0{slotIndex + 1}
                          </span>
                          {saveTime && (
                            <span className="text-[9px] text-neutral-500 vn-save-slot-time">{saveTime}</span>
                          )}
                        </div>
                        <span className={`text-xs truncate max-w-full vn-save-slot-text ${hasSave ? 'text-neutral-200' : 'text-neutral-600 italic'}`}>
                          {saveName}
                        </span>
                      </button>
                    );
                  })}
                </div>
                
                <div className="flex justify-between gap-3 pt-1 border-t border-neutral-800 vn-save-modal-actions">
                  <button
                    onClick={handleExitWithoutSaving}
                    className="px-3 py-1.5 border border-red-900/40 bg-red-950/10 hover:bg-red-900/30 text-red-400 text-[10px] font-bold uppercase tracking-wider rounded transition-all cursor-pointer vn-save-modal-exit-btn"
                  >
                    {t('interface.exitWithoutSaving', 'SALIR SIN GUARDAR')}
                  </button>
                  <button
                    onClick={() => setShowSaveModal(false)}
                    className="px-3 py-1.5 border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[10px] font-bold uppercase tracking-wider rounded transition-all cursor-pointer vn-save-modal-cancel-btn"
                  >
                    {t('interface.cancel', 'CANCELAR')}
                  </button>
                </div>
              </div>
            </div>
          )}
          <DialogueLogModal
            isOpen={showLogModal}
            onClose={() => setShowLogModal(false)}
            history={gameState.dialogueHistory}
          />
        </div>
      </div>
    </>
  );
};

export default GameEngine;
