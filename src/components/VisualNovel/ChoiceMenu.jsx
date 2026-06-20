// src/components/VisualNovel/ChoiceMenu.jsx
import React from 'react';

// NOTA DE DISEÑO: Todos los menús de elección (ChoiceMenu) deben utilizar una transición
// de entrada suave de tipo 'fadeIn' con una duración de 1 segundo (animate-[fadeIn_1s_ease-out_forwards])
// para evitar apariciones bruscas y mantener consistencia visual a lo largo del juego.
const ChoiceMenu = ({ question, options, onChoice }) => {
  return (
    // Overlay absoluto adaptado al contenedor 16:9 que oscurece el fondo
    // Se incluye la animación de entrada suave de 1 segundo (fadeIn)
    <div
      className="absolute inset-0 z-[60] flex flex-col items-center justify-center bg-black/75 transition-opacity duration-500 pointer-events-auto backdrop-blur-[2px] vn-choice-container animate-[fadeIn_1s_ease-out_forwards]"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Pregunta o contexto: Tipografía responsiva y espaciado compacto */}
      {question && (
        <h2 className="text-neutral-400 font-sans tracking-widest text-center drop-shadow-md px-6 uppercase vn-choice-question">
          {question}
        </h2>
      )}
      
      {/* Lista de opciones: Ancho dinámico y escalado elástico */}
      <div className="flex flex-col w-full px-6 md:px-0 vn-choices-list">
        {options.map((option, index) => (
          <button 
            key={index} 
            onClick={() => onChoice(option)} 
            className="w-full bg-neutral-900/90 border border-neutral-800 hover:border-amber-500 hover:bg-neutral-950 text-white font-sans tracking-wide transition-all duration-150 shadow-md text-center focus:outline-none vn-choice-button"
          >
            {option.texto}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChoiceMenu;