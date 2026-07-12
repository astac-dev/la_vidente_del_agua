import React, { useState } from 'react';
import { useGameState } from '../../context/GameStateContext';
import { useTranslation } from 'react-i18next';

const DiarioModal = ({ onClose }) => {
  const { gameState } = useGameState();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('logs');

  const history = gameState.dialogueHistory || [];
  const backgrounds = gameState.unlockedBackgrounds || [];

  return (
    <div 
      className="absolute inset-0 bg-black/90 flex items-center justify-center z-[300] pointer-events-auto select-none" 
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div 
        className="bg-[#1a1512] border border-amber-500/40 p-1 w-full h-full md:w-[90vw] md:h-[90vh] md:rounded-lg shadow-2xl flex flex-col relative overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-5 bg-[url('/assets/noise.png')] mix-blend-overlay"></div>
        
        {/* Encabezado */}
        <div className="flex justify-between items-center p-4 border-b border-amber-500/20 bg-black/50 z-10">
          <h2 className="text-2xl font-serif font-bold text-amber-500 tracking-wider">DIARIO DE VISIONES</h2>
          <button onClick={onClose} className="text-amber-500/60 hover:text-amber-400 transition-colors p-2">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        {/* Pestañas */}
        <div className="flex border-b border-amber-500/20 bg-black/30 z-10">
          <button 
            className={`flex-1 py-3 font-mono text-sm tracking-widest transition-colors ${activeTab === 'logs' ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-500/10' : 'text-neutral-500 hover:text-amber-200 hover:bg-white/5'}`}
            onClick={() => setActiveTab('logs')}
          >
            LOGS (HISTORIA)
          </button>
          <button 
            className={`flex-1 py-3 font-mono text-sm tracking-widest transition-colors ${activeTab === 'visiones' ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-500/10' : 'text-neutral-500 hover:text-amber-200 hover:bg-white/5'}`}
            onClick={() => setActiveTab('visiones')}
          >
            VISIONES (FONDOS)
          </button>
          <button 
            className={`flex-1 py-3 font-mono text-sm tracking-widest transition-colors ${activeTab === 'perfiles' ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-500/10' : 'text-neutral-500 hover:text-amber-200 hover:bg-white/5'}`}
            onClick={() => setActiveTab('perfiles')}
          >
            PERFILES
          </button>
        </div>

        {/* Contenido */}
        <div className="flex-grow overflow-y-auto p-6 z-10 custom-scrollbar relative">
          
          {activeTab === 'logs' && (
            <div className="max-w-3xl mx-auto space-y-6">
              {history.length === 0 ? (
                <div className="text-center text-neutral-600 font-mono italic mt-10">Las páginas están en blanco...</div>
              ) : (
                history.map((log, idx) => (
                  <div key={idx} className="border-l-2 border-amber-500/30 pl-4 py-1">
                    <span className="text-amber-500/70 font-bold uppercase text-xs tracking-wider block mb-1">
                      {log.personaje}
                    </span>
                    <p className="text-neutral-300 font-serif leading-relaxed text-lg">
                      "{log.texto}"
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'visiones' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {backgrounds.length === 0 ? (
                <div className="col-span-full text-center text-neutral-600 font-mono italic mt-10">
                  No hay registros visuales. Usa el celular en diferentes lugares para capturarlos.
                </div>
              ) : (
                backgrounds.map((bgSrc, idx) => (
                  <div key={idx} className="group relative aspect-video bg-black rounded-md overflow-hidden border border-neutral-800 hover:border-amber-500/50 transition-colors">
                    <img 
                      src={bgSrc.startsWith('/') ? `${import.meta.env.BASE_URL}${bgSrc.slice(1)}` : bgSrc} 
                      alt={`Visión ${idx}`} 
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <span className="text-amber-400 font-mono text-xs">VISIÓN_#{idx.toString().padStart(3, '0')}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'perfiles' && (
            <div className="text-center text-neutral-600 font-mono italic mt-10">
              Perfiles de personajes próximamente...
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default DiarioModal;
