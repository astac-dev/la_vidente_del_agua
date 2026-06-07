// src/components/VisualNovel/ChoiceMenu.jsx
import React from 'react';

const ChoiceMenu = ({ question, options, onChoice }) => {
  return (
    // Overlay absoluto adaptado al contenedor 16:9 que oscurece el fondo
    <div
      className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/75 transition-opacity duration-500 pointer-events-auto backdrop-blur-[2px]"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Pregunta o contexto: Tipografía responsiva y espaciado compacto */}
      {question && (
        <h2 className="text-neutral-400 font-sans text-xs sm:text-sm md:text-base lg:text-lg tracking-widest mb-4 md:mb-6 text-center drop-shadow-md px-6 uppercase">
          {question}
        </h2>
      )}
      
      {/* Lista de opciones: Ancho dinámico y escalado elástico */}
      <div className="flex flex-col gap-2.5 md:gap-4 w-full max-w-xl lg:max-w-2xl px-6 md:px-0">
        {options.map((option, index) => (
          <button 
            key={index} 
            onClick={() => onChoice(option)} 
            className="w-full py-2.5 md:py-4 px-4 md:px-8 bg-neutral-900/90 border border-neutral-800 hover:border-amber-500 hover:bg-neutral-950 text-white font-sans text-xs sm:text-sm md:text-base tracking-wide transition-all duration-150 shadow-md text-center focus:outline-none"
          >
            {option.texto}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChoiceMenu;