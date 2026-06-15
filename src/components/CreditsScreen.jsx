/* eslint-disable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */
/* src/components/CreditsScreen.jsx */
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import creditsData from '../data/creditsData.json';
import './CreditsScreen.css';

/**
 * Componente que renderiza una secuencia cinematográfica de créditos.
 * Su diseño se basa en un control de tiempos estructurado desde un JSON externo
 * para facilitar modificaciones de personal y animaciones sin tocar la lógica de renderizado.
 * Implementa una salida anticipada via teclado o botón y un crossfade de fondos dual
 * para evitar parpadeos visuales al cambiar de ilustraciones de fondo.
 */
const CreditsScreen = ({ onBack }) => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Estado para controlar el crossfade suave de imágenes de fondo
  const [bgState, setBgState] = useState({
    current: creditsData[0]?.background || '',
    previous: '',
    isTransitioning: false,
  });

  const activeBlock = creditsData[currentIndex];

  // Temporizador para avanzar de bloque automáticamente
  useEffect(() => {
    if (!activeBlock) return;

    const timer = setTimeout(() => {
      if (currentIndex < creditsData.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        onBack(); // Cierra los créditos al finalizar el último bloque
      }
    }, activeBlock.duration);

    return () => clearTimeout(timer);
  }, [currentIndex, onBack, activeBlock]);

  // Manejar el cambio de fondo e inicializar el crossfade
  useEffect(() => {
    const nextBg = activeBlock?.background;
    if (nextBg && nextBg !== bgState.current) {
      setBgState(prev => ({
        previous: prev.current,
        current: nextBg,
        isTransitioning: true,
      }));
    }
  }, [currentIndex, activeBlock, bgState.current]);

  // Limpiar la imagen de fondo anterior al terminar el fundido
  const handleBgTransitionEnd = () => {
    setBgState(prev => ({
      ...prev,
      previous: '',
      isTransitioning: false,
    }));
  };

  // Salir de la pantalla de créditos al presionar cualquier tecla del teclado
  useEffect(() => {
    const handleKeyDown = () => {
      onBack();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onBack]);

  if (!activeBlock) return null;

  // Resolver la ruta completa del fondo usando la URL base de Vite para producción
  const getFullBgUrl = (src) => {
    if (!src) return '';
    return src.startsWith('/') 
      ? `${import.meta.env.BASE_URL}${src.slice(1)}` 
      : src;
  };

  return (
    <div className="credits-screen">
      {/* Botón flotante para salir de los créditos en la esquina superior derecha */}
      <button 
        className="credits-close-btn" 
        onClick={onBack}
        aria-label={t('credits.closeCredits')}
        title={t('credits.backToMenu')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Capa de fondo inferior (nueva imagen) */}
      <div 
        className={`credits-bg-layer under ${activeBlock.animationType === 'kinetic-parallax' ? 'kinetic' : ''}`}
        style={{ 
          backgroundImage: `url(${getFullBgUrl(bgState.current)})`,
          '--animation-duration': `${activeBlock.duration}ms`
        }}
      />

      {/* Capa de fondo superior (imagen anterior que hace fade-out) */}
      {bgState.previous && (
        <div 
          className="credits-bg-layer over"
          onTransitionEnd={handleBgTransitionEnd}
          style={{ 
            backgroundImage: `url(${getFullBgUrl(bgState.previous)})`,
            opacity: bgState.isTransitioning ? 0 : 1
          }}
        />
      )}

      {/* Overlay de contraste visual */}
      <div className="credits-overlay" />

      {/* Área del contenido de créditos */}
      <div className="credits-content-container">
        {/* Renderizado condicional del bloque según su estilo de animación configurado */}
        {activeBlock.animationType === 'fade' && (
          <div 
            key={activeBlock.id} 
            className="credits-block-fade"
            style={{ '--animation-duration': `${activeBlock.duration}ms` }}
          >
            {activeBlock.title && <h1 className="credits-title-large">{t(activeBlock.title)}</h1>}
            {activeBlock.subtitle && <p className="credits-subtitle">{t(activeBlock.subtitle)}</p>}
          </div>
        )}

        {activeBlock.animationType === 'kinetic-parallax' && (
          <div 
            key={activeBlock.id} 
            className="credits-block-kinetic"
            style={{ '--animation-duration': `${activeBlock.duration}ms` }}
          >
            {activeBlock.title && <h2 className="credits-title-medium">{t(activeBlock.title)}</h2>}
            <div className="credits-roles-grid">
              {activeBlock.roles?.map((roleGroup, rIdx) => (
                <div key={rIdx} className="credits-role-pair">
                  <span className="credits-role-label">{t(roleGroup.role)}</span>
                  <div className="credits-role-name">
                    {roleGroup.names.map((name, nIdx) => (
                      <div key={nIdx} className="credits-role-name-item">{t(name)}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeBlock.animationType === 'scroll' && (
          <div 
            key={activeBlock.id} 
            className="credits-block-scroll"
            style={{ '--animation-duration': `${activeBlock.duration}ms` }}
          >
            {activeBlock.title && <h2 className="credits-title-medium">{t(activeBlock.title)}</h2>}
            <div className="credits-roles-grid">
              {activeBlock.roles?.map((roleGroup, rIdx) => (
                <div key={rIdx} className="credits-role-pair">
                  <span className="credits-role-label">{t(roleGroup.role)}</span>
                  <div className="credits-role-name">
                    {roleGroup.names.map((name, nIdx) => (
                      <div key={nIdx} className="credits-role-name-item">{t(name)}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreditsScreen;
