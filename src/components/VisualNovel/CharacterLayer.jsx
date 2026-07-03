// src/components/VisualNovel/CharacterLayer.jsx
import React from 'react';

const CharacterLayer = React.memo(({ sprites, currentSpeaker }) => {
  console.log("SPRITES RECIBIDOS EN LAYER:", sprites);
  if (!sprites || sprites.length === 0) return null;

  // Mapeo de posiciones tácticas dentro del lienzo responsivo de 16:9
  const getPositionClasses = (position) => {
    switch (position) {
      case 'left':
        return 'left-[25%] -translate-x-1/2';
      case 'right':
        return 'right-[25%] translate-x-1/2';
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

        // Determinar si es el personaje que habla actualmente
        const isActiveSpeaker = currentSpeaker === sprite.id;
        
        // Efecto visual Arknights: atenuar a los personajes que no están hablando
        // Si nadie habla (ej. vacío) no atenuar. Si habla el sistema/narrador, atenuar a todos.
        const isDimmed = currentSpeaker && !isActiveSpeaker;
        const opacityClass = isDimmed ? 'brightness-50 opacity-90 scale-[0.98]' : 'brightness-100 opacity-100 scale-100';

        let entryClass = '';
        if (sprite.entry_animation === 'fade-in') {
          entryClass = 'naia-fade-in';
        }

        // Ajuste dinámico de escala basado en la edad/complexión del personaje
        let heightClass = 'h-[85%]'; // Altura estándar
        if (sprite.id === 'amaranta' || sprite.id === 'naia') {
          heightClass = 'h-[72%]'; // Adolescentes (~14 años)
        } else if (sprite.id === 'arqueologo') {
          heightClass = 'h-[92%]'; // Adultos promedio (~30 años)
        }

        return (
          <div
            key={sprite.id}
            className={`absolute bottom-0 ${heightClass} transition-all duration-300 ease-in-out ${positionClass} ${opacityClass}`}
          >
            <div className="relative h-full inline-block">
              <img
                src={spriteSrc}
                alt={sprite.id}
                className={`character-sprite h-full w-auto object-contain transition-transform duration-200 ${entryClass}`}
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
