// src/components/VisualNovel/CharacterLayer.jsx
import React from 'react';

const CharacterLayer = React.memo(({ sprites }) => {
  if (!sprites || sprites.length === 0) return null;

  // Mapeo de posiciones tácticas dentro del lienzo responsivo de 16:9
  const getPositionClasses = (position) => {
    switch (position) {
      case 'left':
        return 'left-[20%] -translate-x-1/2';
      case 'right':
        return 'right-[20%] translate-x-1/2';
      case 'center':
      default:
        return 'left-1/2 -translate-x-1/2';
    }
  };

  return (
    // Contenedor bloqueado al ras inferior del marco de juego
    <div className="absolute inset-0 flex items-end justify-center pointer-events-none z-10 overflow-hidden">
      {sprites.map(sprite => {
        const spriteSrc = sprite.src.startsWith('/') 
          ? `${import.meta.env.BASE_URL}${sprite.src.slice(1)}` 
          : sprite.src;

        const positionClass = getPositionClasses(sprite.position);

        // Determinar clases de animación
        let talkingClasses = '';
        if (sprite.isTalking) {
          talkingClasses = `is-talking is-talking--${sprite.vibrationIntensity || 'normal'}`;
        }

        let entryClass = '';
        if (sprite.entry_animation === 'fade-in') {
          entryClass = 'naia-fade-in';
        }

        return (
          <div
            key={sprite.id}
            className={`absolute bottom-0 h-[85%] transition-all duration-500 ease-in-out ${positionClass}`}
          >
            <div className="relative h-full inline-block">
              <img
                src={spriteSrc}
                alt={sprite.id}
                className={`character-sprite h-full w-auto object-contain transition-transform duration-200 ${talkingClasses} ${entryClass}`}
              />
              {sprite.flameActive && sprite.id === 'naia' && (
                <div className="naia-torch-glow" />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
});

export default CharacterLayer;
