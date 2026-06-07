import React, { useState, useEffect } from 'react';
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

const VisualNovelEngine = ({ onNavigate }) => {
  const { t } = useTranslation();
  const { currentScene, currentLine, isChoice, isEndOfScene, advance, makeChoice } = useVisualNovelEngine();
  const { uiVisibility, settings, updateSetting, toggleUiVisibility, gameState } = useGameState();
  const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);

  if (!currentScene) {
    return <div className="ark-view-wrapper"><div>Cargando historia...</div></div>;
  }

  const handleAdvanceClick = (e) => {
    e.stopPropagation();
    advance();
  };

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.error(err));
    } else {
      document.exitFullscreen();
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
        
        {/* CORRECCIÓN: Se limita la anchura máxima proporcional al alto (177.78vh) para mantener 16:9 exacto y centrado */}
        <div 
          className="ark-scene-container relative w-full max-w-[177.78vh] aspect-video max-h-screen overflow-hidden"
          style={{ '--ui-scale-multiplier': `${(settings.tamanoLetra || 100) / 100}` }}
        >
          <BackgroundLayer background={currentScene.background} />
          <CharacterLayer sprites={currentLine?.sprites || currentScene.sprites} />
          <div className="scene-overlay" />

          <div className="absolute top-0 left-0 right-0 z-50 flex justify-between items-start p-4 pointer-events-none select-none bg-gradient-to-b from-black/70 to-transparent">
            
            <div className="flex flex-col items-start gap-1.5 pointer-events-auto">
              <div className="flex items-start gap-1.5">
                <button onClick={toggleFullscreen} className={buttonBaseClasses} title="Pantalla Completa">
                  <div className="pt-1">
                    {isFullscreen ? <FullscreenExitIcon /> : <FullscreenEnterIcon />}
                  </div>
                  <span className="hud-button-label-custom font-mono tracking-tight uppercase opacity-60">SYS.FS</span>
                </button>
                <button onClick={() => onNavigate('mainMenu')} disabled={isFullscreen} className={buttonBaseClasses} title="Volver al Menú">
                  {!isFullscreen && <div className="absolute top-0 left-0 w-1 h-1 bg-amber-500" />}
                  <div className="pt-1"><HomeIcon /></div>
                  <span className="hud-button-label-custom font-mono tracking-tight uppercase opacity-60">HOME</span>
                </button>
              </div>
              <HUD />
            </div>

            <div className="absolute left-1/2 -translate-x-1/2 top-4 flex flex-col border-l-2 border-amber-500 pl-2 pr-4 py-0.5 bg-black/30 font-mono hidden sm:flex pointer-events-auto">
              <span className="text-[10px] font-bold text-neutral-200 tracking-wider">INAH-SAS // EXP.2011</span>
              <span className="text-[8px] text-neutral-500 tracking-widest mt-0.5">SITE: HOYO_NEGRO</span>
            </div>

            <div className="flex gap-1.5">
              <button onClick={handleToggleLog} className={buttonBaseClasses} title="Historial">
                <div className="pt-1"><LogIcon /></div>
                <span className="hud-button-label-custom font-mono tracking-tight uppercase opacity-60">REC.LOG</span>
              </button>
              <button onClick={handleToggleSkip} className={buttonBaseClasses} title="Saltar">
                <div className="pt-1"><SkipIcon /></div>
                <span className="hud-button-label-custom font-mono tracking-tight uppercase opacity-60">NARR.SKP</span>
              </button>
              <button onClick={handleAutoClick} className={`${buttonBaseClasses} ${settings.autoPlaySpeed > 0 ? 'border-amber-500 bg-amber-500/10 text-amber-400 hover:text-amber-300' : ''}`} title="Modo Automático">
                {settings.autoPlaySpeed > 0 && <div className="absolute top-0 right-0 w-1 h-1 bg-amber-500 animate-pulse" />}
                <div className="pt-1 flex items-center justify-center gap-0.5">
                  <AutoIcon />
                  {settings.autoPlaySpeed > 0 && (<span className="text-[9px] font-mono font-bold leading-none">X{settings.autoPlaySpeed}</span>)}
                </div>
                <span className="hud-button-label-custom font-mono tracking-tight uppercase opacity-60">PLAY.AT</span>
              </button>
              <button onClick={toggleUiVisibility} className={buttonBaseClasses} title="Ocultar Interfaz">
                  <div className="pt-1">{uiVisibility ? <HideUIIcon /> : <ShowUIIcon />}</div>
                  <span className="hud-button-label-custom font-mono tracking-tight uppercase opacity-60">UI.HIDE</span>
              </button>
            </div>
          </div>

          {uiVisibility && (
            <>
              {!isChoice && currentLine && (
                <DialogueBox
                  key={translatedDialogue} 
                  character={currentLine.personaje}
                  text={translatedDialogue}
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
                  className="vn-glifo-indicator"
                  alt="Continuar"
                  onClick={handleAdvanceClick}
                  style={{ cursor: 'pointer', pointerEvents: 'auto', zIndex: 25 }}
                />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default VisualNovelEngine;