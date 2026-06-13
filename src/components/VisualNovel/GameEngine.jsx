// src/components/VisualNovel/GameEngine.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useVisualNovelEngine } from '../../hooks/useVisualNovelEngine';
import { useGameState } from '../../context/GameStateContext';
import BackgroundLayer from './BackgroundLayer';
import CharacterLayer from './CharacterLayer';
import DialogueBox from './DialogueBox';
import ChoiceMenu from './ChoiceMenu';
import OrientationBlocker from './OrientationBlocker'; 
import HUD from './HUD';
import FullscreenEnterIcon from '../icons/FullscreenEnterIcon';
import FullscreenExitIcon from '../icons/FullscreenExitIcon';
import glifoAgua from '../../assets/arte/glifoaguafluyendo.png';
import '../VisualNovelContainer.css';

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
 * Componente principal administrador del motor de la novela visual.
 * Carga de forma dinámica los guiones de los capítulos bajo demanda
 * para optimizar la memoria y evitar la importación estática masiva de datos.
 */
const GameEngine = ({ onNavigate }) => {
  const { t, i18n } = useTranslation();
  const { uiVisibility, settings, updateSetting, toggleUiVisibility, gameState, saves, saveGameToSlot, isFading } = useGameState();
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(!!getFullscreenElement());
  const [fullscreenError, setFullscreenError] = useState('');
  const [scriptData, setScriptData] = useState(null);
  const containerRef = useRef(null);

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
  const { currentScene, currentLine, isChoice, isEndOfScene, advance, makeChoice } = useVisualNovelEngine(scriptData);

  const handleHomeClick = () => {
    if (isFullscreen) return;
    setShowSaveModal(true);
  };

  const handleSaveAndExit = (slotIndex) => {
    saveGameToSlot(slotIndex);
    setShowSaveModal(false);
    onNavigate('mainMenu');
  };

  const handleExitWithoutSaving = () => {
    setShowSaveModal(false);
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
    const speeds = [0, 1, 2, 3, 4];
    const currentSpeedIndex = speeds.indexOf(settings.autoPlaySpeed || 0);
    const nextSpeed = speeds[(currentSpeedIndex + 1) % speeds.length];
    updateSetting('autoPlaySpeed', nextSpeed);
  };

  useEffect(() => {
    if (isChoice || !uiVisibility || !settings.autoPlaySpeed || settings.autoPlaySpeed === 0) {
      return;
    }
    if (isEndOfScene) {
      return;
    }
    const baseDelay = 1500; 
    const charsPerSecond = 20 * settings.autoPlaySpeed;
    const textLength = currentLine?.texto?.length || 0;
    const calculatedDelay = (textLength / charsPerSecond) * 1000;
    const totalDelay = baseDelay + calculatedDelay;

    const timer = setTimeout(() => {
      advance();
    }, totalDelay);

    return () => clearTimeout(timer);
  }, [currentLine, isChoice, uiVisibility, settings.autoPlaySpeed, isEndOfScene, advance]);

  const handleToggleSkip = () => {
    console.log("Modo SKIP (lógica pendiente)");
  };

  const handleToggleLog = () => {
    console.log("Historial de Diálogo (lógica pendiente)");
  };

  if (!scriptData || !currentScene) {
    return (
      <div className="ark-view-wrapper w-full h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-amber-500 font-mono text-sm tracking-wider animate-pulse">
          Sincronizando bitácora de campo...
        </div>
      </div>
    );
  }

  const buttonBaseClasses = "hud-button-custom relative flex flex-col items-center justify-center transition-all duration-150 bg-black/40 border border-neutral-800 hover:bg-neutral-900/80 hover:border-amber-400 text-neutral-400 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed pointer-events-auto";

  const dialogueKey = `historia.${gameState?.currentChapter}.escenas.${gameState?.currentSceneId}.dialogos.${gameState?.dialogueIndex}.texto`;
  const translatedDialogue = t(dialogueKey, currentLine?.texto);

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
          <CharacterLayer sprites={currentLine?.sprites || currentScene.sprites} />
          <div className="scene-overlay" />
          
          {/* Overlay de transición de fundido a negro (fade out/in) */}
          <div className={`absolute inset-0 bg-black z-[300] transition-opacity duration-500 ${isFading ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} />

          {uiVisibility && (
            <div className="absolute top-0 left-0 right-0 z-50 flex justify-between items-start p-4 pointer-events-none select-none bg-gradient-to-b from-black/70 to-transparent">
              
              <div className="flex flex-col items-start gap-1.5 pointer-events-auto">
                <div className="flex items-start gap-1.5">
                  <button 
                    onClick={toggleFullscreen} 
                    className={`${buttonBaseClasses} ${currentLine?.highlight === 'btn-fullscreen' || currentLine?.highlight === 'hud-buttons' ? 'vn-highlight-active' : ''}`} 
                    title={isFullscreen ? t('interface.fullscreenExit', 'Salir de pantalla completa') : t('interface.fullscreenEnter', 'Pantalla completa')}
                  >
                    <div className="pt-1">
                      {isFullscreen ? <FullscreenExitIcon /> : <FullscreenEnterIcon />}
                    </div>
                    <span className="hud-button-label-custom font-mono tracking-tight uppercase opacity-60">
                      {t('interface.fullscreenLabel', 'SYS.FS')}
                    </span>
                  </button>
                  <button 
                    onClick={handleHomeClick} 
                    disabled={isFullscreen} 
                    className={`${buttonBaseClasses} ${isFullscreen ? 'opacity-25 pointer-events-none' : ''} ${currentLine?.highlight === 'btn-home' || currentLine?.highlight === 'hud-buttons' ? 'vn-highlight-active' : ''}`}
                    title={t('interface.backToMenu', 'Volver al Menú')}
                  >
                    {!isFullscreen && <div className="absolute top-0 left-0 w-1 h-1 bg-amber-500" />}
                    <div className="pt-1"><HomeIcon /></div>
                    <span className="hud-button-label-custom font-mono tracking-tight uppercase opacity-60">
                      {t('interface.homeLabel', 'HOME')}
                    </span>
                  </button>
                </div>
                <HUD />
              </div>

              <div className="absolute left-1/2 -translate-x-1/2 top-4 flex flex-col border-l-2 border-amber-500 pl-2 pr-4 py-0.5 bg-black/30 font-mono hidden sm:flex pointer-events-auto vn-site-badge">
                <span className="text-[10px] font-bold text-neutral-200 tracking-wider vn-site-badge-title">INAH-SAS // EXP.2011</span>
                <span className="text-[8px] text-neutral-500 tracking-widest mt-0.5 vn-site-badge-subtitle">SITE: HOYO_NEGRO</span>
              </div>

              <div className="flex gap-1.5">
                <button 
                  onClick={handleToggleLog} 
                  className={`${buttonBaseClasses} ${currentLine?.highlight === 'btn-log' || currentLine?.highlight === 'hud-buttons' ? 'vn-highlight-active' : ''}`} 
                  title={t('interface.history', 'Historial')}
                >
                  <div className="pt-1"><LogIcon /></div>
                  <span className="hud-button-label-custom font-mono tracking-tight uppercase opacity-60">{t('interface.recLogLabel', 'REC.LOG')}</span>
                </button>
                <button 
                  onClick={handleToggleSkip} 
                  className={`${buttonBaseClasses} ${currentLine?.highlight === 'btn-skip' || currentLine?.highlight === 'hud-buttons' ? 'vn-highlight-active' : ''}`} 
                  title={t('interface.skip', 'Saltar')}
                >
                  <div className="pt-1"><SkipIcon /></div>
                  <span className="hud-button-label-custom font-mono tracking-tight uppercase opacity-60">{t('interface.narrSkpLabel', 'NARR.SKP')}</span>
                </button>
                <button 
                  onClick={handleAutoClick} 
                  className={`${buttonBaseClasses} ${settings.autoPlaySpeed > 0 ? 'border-amber-500 bg-amber-500/10 text-amber-400 hover:text-amber-300' : ''} ${currentLine?.highlight === 'btn-auto' || currentLine?.highlight === 'hud-buttons' ? 'vn-highlight-active' : ''}`} 
                  title={t('interface.autoMode', 'Modo Automático')}
                >
                  {settings.autoPlaySpeed > 0 && <div className="absolute top-0 right-0 w-1 h-1 bg-amber-500 animate-pulse" />}
                  <div className="pt-1 flex items-center justify-center gap-0.5">
                    <AutoIcon />
                    {settings.autoPlaySpeed > 0 && (<span className="text-[9px] font-mono font-bold leading-none">X{settings.autoPlaySpeed}</span>)}
                  </div>
                  <span className="hud-button-label-custom font-mono tracking-tight uppercase opacity-60">{t('interface.playAtLabel', 'PLAY.AT')}</span>
                </button>
                <button 
                  onClick={toggleUiVisibility} 
                  className={`${buttonBaseClasses} ${currentLine?.highlight === 'btn-hide' || currentLine?.highlight === 'hud-buttons' ? 'vn-highlight-active' : ''}`} 
                  title={t('interface.hideUI', 'Ocultar Interfaz')}
                >
                    <div className="pt-1">{uiVisibility ? <HideUIIcon /> : <ShowUIIcon />}</div>
                    <span className="hud-button-label-custom font-mono tracking-tight uppercase opacity-60">{t('interface.hideUIButton', 'UI.HIDE')}</span>
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
                  text={translatedDialogue}
                  isHighlighted={currentLine?.highlight === 'dialogue-box'}
                />
              )}

              {isChoice && (
                <ChoiceMenu
                  question={translatedQuestion}
                  options={translatedOptions}
                  onChoice={makeChoice}
                />
              )}

              {!isChoice && !isEndOfScene && (
                <img
                  src={glifoAgua}
                  className={`vn-glifo-indicator ${currentLine?.highlight === 'glifo-agua' ? 'vn-highlight-active' : ''}`}
                  alt="Continuar"
                  onClick={handleAdvanceClick}
                  style={{ cursor: 'pointer', pointerEvents: 'auto', zIndex: 25 }}
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

          {currentScene.type === 'custom_message' && (
            <div 
              className="absolute inset-0 z-[210] flex items-center justify-center bg-black pointer-events-auto cursor-pointer animate-[fadeIn_1s_ease-out_forwards]"
              onClick={(e) => {
                e.stopPropagation();
                if (currentScene.next === 'mainMenu') {
                  onNavigate('mainMenu');
                } else if (currentScene.next) {
                  advance();
                } else {
                  onNavigate('mainMenu');
                }
              }}
            >
              <div className="text-center px-8 text-neutral-200 font-sans max-w-xl">
                <p className="text-base md:text-lg leading-relaxed tracking-wide">
                  {t(`historia.${gameState?.currentChapter}.escenas.${gameState?.currentSceneId}.texto`, currentScene.text)}
                </p>
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
        </div>
      </div>
    </>
  );
};

export default GameEngine;
