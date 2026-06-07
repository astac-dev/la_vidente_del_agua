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
      {sprites.map(sprite => (
        <img
          key={sprite.id}
          src={sprite.src}
          alt={sprite.id}
          className={`absolute bottom-0 h-[85%] object-contain transition-all duration-500 ease-in-out ${getPositionClasses(sprite.position)}`}
        />
      ))}
    </div>
  );
});

export default CharacterLayer;
