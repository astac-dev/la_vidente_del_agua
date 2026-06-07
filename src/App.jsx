import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import MainMenu from './components/MainMenu';
import ExtrasMenu from './components/ExtrasMenu';
import LanguageSelector from './components/LanguageSelector';
import OptionsMenu from './components/OptionsMenu';
import VisualNovelEngine from './components/VisualNovel/VisualNovelEngine';
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
    if (view !== currentView && animationClass !== 'fade-out') {
      nextViewRef.current = view;
      setAnimationClass('fade-out');
    }
  };

  const handleAnimationEnd = () => {
    if (animationClass === 'fade-out') {
      setCurrentView(nextViewRef.current);
      setAnimationClass('fade-in');
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'extrasMenu':
        return <ExtrasMenu onBack={() => handleNavigate('mainMenu')} />;
      case 'optionsMenu':
        return <OptionsMenu onBack={() => handleNavigate('mainMenu')} />;
      case 'visualNovel':
        return <VisualNovelEngine onNavigate={handleNavigate} />;
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

  if (currentView === 'visualNovel') {
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
        className={`menu-container w-full h-screen min-h-screen relative overflow-hidden flex flex-col ${animationClass}`} 
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