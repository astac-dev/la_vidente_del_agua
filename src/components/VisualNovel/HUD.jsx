import React, { useState } from 'react';
import { useGameState } from '../../context/GameStateContext';

const HUD = () => {
  const { gameState } = useGameState();
  const [isExpanded, setIsExpanded] = useState(false);

  // Evita errores si el estado de las estadísticas aún no se ha inicializado
  const confianza = gameState?.stats?.confianza ?? 0;
  const preservacion = gameState?.stats?.preservacion ?? 0;

  return (
    <div className="flex flex-row items-stretch pointer-events-auto h-auto">
      <div 
        className={`hud-panel-custom ${!isExpanded ? 'hud-panel-collapsed' : ''} flex flex-col bg-black/60 border border-neutral-800/60 border-r-0 font-mono tracking-wider transition-all duration-300 overflow-hidden whitespace-nowrap`}
        style={{ 
          minWidth: isExpanded ? undefined : '0', 
          width: isExpanded ? 'calc(200px * var(--ui-scale-multiplier, 1))' : 'calc(65px * var(--ui-scale-multiplier, 1))',
          paddingLeft: isExpanded ? undefined : 'calc(0.5rem * var(--ui-scale-multiplier, 1))',
          paddingRight: isExpanded ? undefined : 'calc(0.5rem * var(--ui-scale-multiplier, 1))'
        }}
      >
        {/* Métrica de Confianza Comunitaria */}
        <div className="flex justify-between items-center gap-2">
          <span className="text-neutral-500 font-bold">
            {isExpanded ? 'CONFIANZA //' : 'C'}
          </span>
          <span className="text-amber-400 font-bold">{confianza}</span>
        </div>

        {/* Métrica de Preservación Biocultural */}
        <div className="flex justify-between items-center gap-2">
          <span className="text-neutral-500 font-bold">
            {isExpanded ? 'PRESERVACIÓN //' : 'P'}
          </span>
          <span className="text-emerald-400 font-bold">{preservacion}</span>
        </div>
      </div>
      
      <button 
        onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
        className="bg-neutral-900/80 border border-neutral-800/60 text-neutral-500 hover:text-amber-400 hover:bg-neutral-800 flex flex-col items-center justify-center px-1 cursor-pointer transition-colors"
        title="Toggle HUD"
      >
        <span className="text-xs" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>▶</span>
      </button>
    </div>
  );
};

export default HUD;