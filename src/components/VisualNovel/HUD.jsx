// src/components/VisualNovel/HUD.jsx
import React from 'react';
import { useGameState } from '../../context/GameStateContext';

const HUD = () => {
  const { gameState } = useGameState();

  // Evita errores si el estado de las estadísticas aún no se ha inicializado
  const confianza = gameState?.stats?.confianza ?? 0;
  const preservacion = gameState?.stats?.preservacion ?? 0;

  return (
    <div className="hud-panel-custom flex flex-col bg-black/40 border border-neutral-800/60 font-mono text-neutral-300 tracking-wider">
      {/* Métrica de Confianza Comunitaria */}
      <div className="flex justify-between items-center gap-4">
        <span className="text-neutral-500 font-bold">CONFIANZA //</span>
        <span className="text-amber-400 font-bold">{confianza} XP</span>
      </div>

      {/* Métrica de Preservación Biocultural */}
      <div className="flex justify-between items-center gap-4">
        <span className="text-neutral-500 font-bold">PRESERVACIÓN //</span>
        <span className="text-emerald-400 font-bold">{preservacion} XP</span>
      </div>
    </div>
  );
};

export default HUD;