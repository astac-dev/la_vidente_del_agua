// src/components/VisualNovel/DialogueBox.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTypewriter } from '../../hooks/useTypewriter';

const DialogueBox = React.memo(({ character, text }) => {
  const { t } = useTranslation();
  const characterName = t(`personajes.${character}`, character);
  const displayedText = useTypewriter(text, 40);

  if (!text) return null;

  return (
    // Degradado limpio anclado a la base del canvas 16:9 sin recuadros duros
    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/95 via-black/60 to-transparent pt-20 pb-6 px-6 md:px-12 pointer-events-none z-20">
      <div className="w-full flex items-start gap-4 md:gap-8 max-w-5xl mx-auto">
        
        {/* Nombre del Personaje: Gris claro, tipografía sans-serif y ancho responsivo controlado */}
        {character && character !== 'narrador' ? (
          <div className="w-20 md:w-32 flex-shrink-0 text-right mt-0.5">
            <span 
              className="text-neutral-400 font-sans text-sm md:text-base lg:text-lg font-medium tracking-wider"
              style={{ fontSize: 'calc(1em * var(--ui-scale-multiplier, 1))' }}
            >
              {characterName}
            </span>
          </div>
        ) : (
          // Espacio en blanco estructural para mantener alineado el texto del narrador
          <div className="w-20 md:w-32 flex-shrink-0"></div>
        )}

        {/* Cuerpo del Diálogo: Blanco de alta legibilidad, escala fluida según resolución */}
        <div className="flex-1 min-w-0">
          <p 
            className={`font-sans text-xs sm:text-sm md:text-base lg:text-lg tracking-wide leading-relaxed drop-shadow-md ${character === 'narrador' ? 'text-neutral-300 italic' : 'text-white'}`}
            style={{ fontSize: 'calc(1em * var(--ui-scale-multiplier, 1))' }}
          >
            {displayedText}
          </p>
        </div>

      </div>
    </div>
  );
});

export default DialogueBox;
