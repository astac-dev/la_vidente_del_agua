import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import MainMenu from './components/MainMenu';
import ExtrasMenu from './components/ExtrasMenu';
import ContinueMenu from './components/ContinueMenu';
import StoryMap from './components/StoryMap';
import LanguageSelector from './components/LanguageSelector';
import OptionsMenu from './components/OptionsMenu';
import GameEngine from './components/VisualNovel/GameEngine';
import CreditsScreen from './components/CreditsScreen';
import GalleryMenu from './components/GalleryMenu';
import OrientationBlocker from './components/VisualNovel/OrientationBlocker';
import ClickToContinue from './components/ClickToContinue';
import ExitScreen from './components/ExitScreen';
import Auth from './components/Auth';
import { useGameState } from './context/GameStateContext';
import './components/MainMenu.css';
import './components/LanguageSelector.css';
import './components/Auth.css';
import './components/ExitScreen.css';
import './components/ClickToContinue.css';
import './components/OptionsMenu.css';
import './components/ContinueMenu.css';

const App = () => {
  const { settings } = useGameState();
  const [isExited, setIsExited] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [currentView, setCurrentView] = useState('mainMenu');
  const [animationClass, setAnimationClass] = useState('fade-in');
  const nextViewRef = useRef(null);
  const [torchStyle, setTorchStyle] = useState({});

  useLayoutEffect(() => {
    const updateTorchPosition = () => {
      // Dimensiones base de tu ilustración original
      const imageWidth = 1024;
      const imageHeight = 768;
      const torchX = 400;
      const torchY = 418;
      const baseTorchSize = 80; 

      const imageRatio = imageWidth / imageHeight;
      const torchXRelative = torchX / imageWidth;
      const torchYRelative = torchY / imageHeight;

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const viewportRatio = viewportWidth / viewportHeight;

      let renderedWidth, renderedHeight, offsetX, offsetY;

      // CORRECCIÓN CORAZÓN DEL PROBLEMA: Cambiamos la matemática a modo "COVER" 
      // para expandir el fondo al 100% de la ventana y destruir las líneas de recorte.
      if (viewportRatio > imageRatio) {
        // El monitor es más ancho: la imagen cubre todo el ancho y se autoajusta verticalmente
        renderedWidth = viewportWidth;
        renderedHeight = viewportWidth / imageRatio;
        offsetX = 0;
        offsetY = (viewportHeight - renderedHeight) / 2; 
      } else {
        // El monitor es más alto/estrecho: la imagen cubre todo el alto y se autoajusta a los lados
        renderedHeight = viewportHeight;
        renderedWidth = viewportHeight * imageRatio;
        offsetX = (viewportWidth - renderedWidth) / 2;
        offsetY = 0;
      }

      // El tamaño del destello de la antorcha ahora escala proporcionalmente al llenado real
      const scaleRatio = renderedWidth / imageWidth;
      const dynamicTorchSize = baseTorchSize * scaleRatio;

      setTorchStyle({
        left: `${offsetX + (renderedWidth * torchXRelative)}px`,
        top: `${offsetY + (renderedHeight * torchYRelative)}px`,
        width: `${dynamicTorchSize}px`,
        height: `${dynamicTorchSize}px`,
      });
    };

    updateTorchPosition(); 
    window.addEventListener('resize', updateTorchPosition); 

    return () => window.removeEventListener('resize', updateTorchPosition); 
  }, []);

  useEffect(() => {
    if (isReady) {
      document.body.classList.add('game-ready');
    }
    return () => document.body.classList.remove('game-ready');
  }, [isReady]);

  const handleNavigate = (view) => {
    if (view !== currentView && animationClass !== 'fade-out' && animationClass !== 'fade-out-cinematic') {
      nextViewRef.current = view;
      if (view === 'visualNovel' || currentView === 'visualNovel' || view === 'storyMap' || currentView === 'storyMap' || view === 'credits' || currentView === 'credits' || view === 'artGallery' || currentView === 'artGallery') {
        setAnimationClass('fade-out-cinematic');
      } else {
        setAnimationClass('fade-out');
      }
    }
  };

  const handleAnimationEnd = () => {
    if (animationClass === 'fade-out' || animationClass === 'fade-out-cinematic') {
      setCurrentView(nextViewRef.current);
      if (nextViewRef.current === 'visualNovel' || currentView === 'visualNovel' || nextViewRef.current === 'storyMap' || currentView === 'storyMap' || nextViewRef.current === 'credits' || currentView === 'credits' || nextViewRef.current === 'artGallery' || currentView === 'artGallery') {
        setAnimationClass('fade-in-cinematic');
      } else {
        setAnimationClass('fade-in');
      }
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'extrasMenu':
        return <ExtrasMenu onBack={() => handleNavigate('mainMenu')} onNavigate={handleNavigate} />;
      case 'storyMap':
        return <StoryMap onBack={() => handleNavigate('extrasMenu')} onNavigate={handleNavigate} />;
      case 'optionsMenu':
        return <OptionsMenu onBack={() => handleNavigate('mainMenu')} />;
      case 'continueMenu':
        return <ContinueMenu onBack={() => handleNavigate('mainMenu')} onNavigate={handleNavigate} />;
      case 'visualNovel':
        return <GameEngine onNavigate={handleNavigate} />;
      case 'credits':
        return <CreditsScreen onBack={() => handleNavigate('mainMenu')} />;
      case 'artGallery':
        return <GalleryMenu onBack={() => handleNavigate('extrasMenu')} />;
      case 'mainMenu':
      default:
        return <MainMenu onNavigate={handleNavigate} onExit={() => setIsExited(true)} />;
    }
  };

  if (!isReady) {
    return <ClickToContinue onContinue={() => setIsReady(true)} />;
  }

  if (isExited) {
    return <ExitScreen />;
  }

  if (currentView === 'visualNovel' || currentView === 'storyMap' || currentView === 'credits' || currentView === 'artGallery') {
    return (
      <>
        <div className={animationClass} onAnimationEnd={handleAnimationEnd}>
          {renderView()}
        </div>
        <OrientationBlocker />
      </>
    );
  }

  return (
    <>
      <div className="background-animations">
        <div className="torch-flicker" style={torchStyle}></div>
      </div>
      {/* CORRECCIÓN: Quitamos cualquier restricción horizontal previa de clases nativas */}
      <div 
        className={`menu-container w-full min-h-screen relative overflow-y-auto flex flex-col ${animationClass}`} 
        onAnimationEnd={handleAnimationEnd}
        style={{ '--ui-scale-multiplier': `${(settings.tamanoLetra || 100) / 100}` }}
      >
        <Auth />
        <LanguageSelector />
        {renderView()}
      </div>
    </>
  );
};

export default App;