import React, { useState } from 'react';

// Un componente similar a ChoiceMenu, pero permite selección múltiple.
const MultiChoiceMenu = ({ question, options, onChoice, onCancel }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const toggleOption = (idx) => {
    setSelectedOptions(prev => 
      prev.includes(idx) 
        ? prev.filter(i => i !== idx)
        : [...prev, idx]
    );
  };

  const handleConfirm = () => {
    const selected = selectedOptions.map(idx => options[idx]);
    onChoice(selected);
  };

  return (
    <div
      className="absolute inset-0 z-[60] flex flex-col items-center justify-center bg-black/75 transition-opacity duration-500 pointer-events-auto backdrop-blur-[2px] vn-choice-container animate-[fadeIn_1s_ease-out_forwards]"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="relative flex flex-col items-center justify-center w-full max-w-4xl p-10 bg-neutral-900/40 border border-neutral-800/60 rounded-2xl shadow-2xl">
        {onCancel && (
          <button 
            onClick={onCancel}
            className="absolute top-4 right-5 text-neutral-400 hover:text-amber-500 transition-colors focus:outline-none"
            title="Cancelar / Volver atrás"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {question && (
          <h2 className="text-neutral-400 font-sans tracking-widest text-center drop-shadow-md px-6 uppercase vn-choice-question mb-4">
            {question}
          </h2>
        )}
        
        <div className="flex flex-col w-full px-6 md:px-0 vn-choices-list mt-4 gap-3">
          {options.map((option, index) => {
            const isSelected = selectedOptions.includes(index);
            return (
              <label 
                key={index} 
                className={`w-full flex items-center p-3 cursor-pointer border hover:border-amber-500 font-sans tracking-wide transition-all duration-150 shadow-md ${
                  isSelected 
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300' 
                    : 'bg-neutral-900/90 border-neutral-800 text-white hover:bg-neutral-950'
                }`}
              >
                <input 
                  type="checkbox" 
                  className="mr-4 w-5 h-5 accent-amber-500" 
                  checked={isSelected}
                  onChange={() => toggleOption(index)} 
                />
                <span className="flex-grow">{option.texto}</span>
              </label>
            );
          })}
        </div>

        <button 
          onClick={handleConfirm}
          disabled={selectedOptions.length === 0}
          className={`mt-8 px-8 py-3 rounded uppercase tracking-widest font-bold transition-colors shadow-lg ${
            selectedOptions.length === 0 
              ? 'bg-neutral-800 text-neutral-600 cursor-not-allowed' 
              : 'bg-amber-500 text-black hover:bg-amber-400'
          }`}
        >
          Confirmar Selección
        </button>
      </div>
    </div>
  );
};

export default MultiChoiceMenu;
