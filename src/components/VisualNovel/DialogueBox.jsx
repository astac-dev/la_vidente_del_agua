// src/components/VisualNovel/DialogueBox.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTypewriter } from '../../hooks/useTypewriter';

const DialogueBox = React.memo(({ character, text, isHighlighted }) => {
  const { t } = useTranslation();
  const characterName = t(`personajes.${character}`, character);
  const displayedText = useTypewriter(text, 40);

  if (!text) return null;

  return (
    // Degradado limpio anclado a la base del canvas 16:9 sin recuadros duros
    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/95 via-black/60 to-transparent pt-20 pb-6 px-6 md:px-12 pointer-events-none z-20">
      <div className={`w-full flex flex-col items-start gap-1 max-w-5xl mx-auto vn-dialogue-container ${isHighlighted ? 'vn-highlight-active' : ''}`}>
        
        {/* Elemento invisible para lectores de pantalla: lee todo el diálogo de golpe con su emisor */}
        <div className="sr-only" aria-live="polite">
          {characterName ? `${characterName}: ` : ''}{text}
        </div>

        {/* Nombre del Personaje: Ámbar de alto contraste, tipografía sans-serif y ancho responsivo */}
        {character && characterName && (
          <div className="vn-character-name-container" aria-hidden="true">
            <span className="text-amber-400 font-sans font-semibold tracking-wider vn-character-name">
              {characterName}
            </span>
          </div>
        )}

        {/* Cuerpo del Diálogo: Oculto para lectores de pantalla para evitar lectura deletreada del efecto máquina de escribir */}
        <div className="flex-1 min-w-0 w-full" aria-hidden="true">
          <p className={`font-sans tracking-wide drop-shadow-md vn-dialogue-text ${character === 'narrador' ? 'text-neutral-300 italic' : 'text-white'}`}>
            {displayedText}
          </p>
        </div>

      </div>
    </div>
  );
});

export default DialogueBox;
