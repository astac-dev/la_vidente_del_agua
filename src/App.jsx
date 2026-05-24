import React, { useState, useRef, useLayoutEffect } from 'react';
import MainMenu from './components/MainMenu';
import ExtrasMenu from './components/ExtrasMenu';
import LanguageSelector from './components/LanguageSelector';
import Auth from './components/Auth';
import './components/MainMenu.css';
import './components/LanguageSelector.css';
import './components/Auth.css';

const App = () => {
  const [currentView, setCurrentView] = useState('mainMenu');
  const [animationClass, setAnimationClass] = useState('fade-in');
  const nextViewRef = useRef(null);
  const [torchStyle, setTorchStyle] = useState({});

  useLayoutEffect(() => {
    const updateTorchPosition = () => {
      // Dimensiones y coordenadas originales de la imagen y la antorcha
      const imageWidth = 1024;
      const imageHeight = 768;
      const torchX = 400;
      const torchY = 418;
      const baseTorchSize = 80; // Tamaño base del destello en píxeles

      const imageRatio = imageWidth / imageHeight;
      const torchXRelative = torchX / imageWidth;
      const torchYRelative = torchY / imageHeight;

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const viewportRatio = viewportWidth / viewportHeight;

      let renderedWidth, renderedHeight, offsetX, offsetY;

      if (viewportRatio > imageRatio) {
        // El viewport es más ancho que la imagen, la imagen se ajusta a la altura.
        renderedHeight = viewportHeight;
        renderedWidth = viewportHeight * imageRatio;
        offsetX = (viewportWidth - renderedWidth) / 2;
        offsetY = 0;
      } else {
        // El viewport es más angosto, la imagen se ajusta al ancho.
        renderedWidth = viewportWidth;
        renderedHeight = viewportWidth / imageRatio;
        offsetX = 0;
        offsetY = (viewportHeight - renderedHeight) / 2;
      }

      // Se calcula la escala actual de la imagen y el tamaño dinámico del destello
      const scaleRatio = renderedWidth / imageWidth;
      const dynamicTorchSize = baseTorchSize * scaleRatio;

      // Se calcula la posición y el tamaño final en píxeles
      setTorchStyle({
        left: `${offsetX + (renderedWidth * torchXRelative)}px`,
        top: `${offsetY + (renderedHeight * torchYRelative)}px`,
        width: `${dynamicTorchSize}px`,
        height: `${dynamicTorchSize}px`,
      });
    };

    updateTorchPosition(); // Calcular al inicio
    window.addEventListener('resize', updateTorchPosition); // Recalcular al redimensionar

    return () => window.removeEventListener('resize', updateTorchPosition); // Limpiar el evento
  }, []);

  const handleNavigate = (view) => {
    // Evita iniciar una nueva animación si ya se está desvaneciendo
    if (view !== currentView && animationClass !== 'fade-out') {
      nextViewRef.current = view;
      setAnimationClass('fade-out');
    }
  };

  const handleAnimationEnd = () => {
    // Cambia la vista solo cuando la animación de desvanecimiento termina
    if (animationClass === 'fade-out') {
      setCurrentView(nextViewRef.current);
      setAnimationClass('fade-in');
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'extrasMenu':
        return <ExtrasMenu onBack={() => handleNavigate('mainMenu')} />;
      case 'mainMenu':
      default:
        return <MainMenu onNavigate={handleNavigate} />;
    }
  };

  return (
    <>
      {/* Contenedor para las animaciones de fondo, como la antorcha */}
      <div className="background-animations">
        <div className="torch-flicker" style={torchStyle}></div>
      </div>
      <div className={`menu-container ${animationClass}`} onAnimationEnd={handleAnimationEnd}>
        <Auth />
        <LanguageSelector />
        {renderView()}
      </div>
    </>
  );
};

export default App;