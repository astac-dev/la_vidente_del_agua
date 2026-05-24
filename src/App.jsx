import React, { useState, useRef } from 'react';
import MainMenu from './components/MainMenu';
import ExtrasMenu from './components/ExtrasMenu';
import './components/MainMenu.css';

const App = () => {
  const [currentView, setCurrentView] = useState('mainMenu');
  const [animationClass, setAnimationClass] = useState('fade-in');
  const nextViewRef = useRef(null);

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
        <div className="torch-flicker"></div>
      </div>
      <div className={`menu-container ${animationClass}`} onAnimationEnd={handleAnimationEnd}>
        {renderView()}
      </div>
    </>
  );
};

export default App;