import React from 'react';
import { useGameState } from '../../context/GameStateContext';
import { useTranslation } from 'react-i18next';

const InventoryModal = ({ onClose, currentBackground }) => {
  const { gameState, updateInventory, goToScene, unlockBackground, settings } = useGameState();
  const { t } = useTranslation();
  const inventory = gameState.inventory || [];

  const handleUseItem = (item) => {
    if (item.id === 'celular') {
      if (currentBackground) {
        unlockBackground(currentBackground);
      }
    }

    if (item.onUseScene) {
      goToScene(item.onUseScene);
    }
    
    const cost = item.useCost || 1;
    updateInventory('use', { id: item.id, count: cost });
    onClose();
  };

  return (
    <div 
      className="absolute inset-0 bg-black/85 flex items-center justify-center z-[250] pointer-events-auto select-none" 
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div 
        className="bg-neutral-900/95 border border-amber-500/30 p-6 rounded-lg shadow-2xl max-w-2xl w-full mx-4 font-mono text-left relative"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-500 hover:text-amber-400 transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
        
        <h3 className="text-xl font-bold text-amber-400 mb-6 border-b border-amber-500/20 pb-2 flex justify-between items-center">
          <span>{t('interface.inventoryTitle', 'INVENTARIO')}</span>
          <span className="text-[10px] font-normal text-neutral-500 tracking-wider">SYS.INV // ASSETS</span>
        </h3>

        {inventory.length === 0 ? (
          <div className="text-center py-12 text-neutral-500 italic">
            {t('interface.inventoryEmpty', 'El inventario está vacío.')}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {inventory.map((item, idx) => (
              <div key={idx} className="bg-black/50 border border-neutral-800 rounded p-4 flex flex-col items-center group hover:border-amber-500/50 transition-colors relative">
                {item.count > 1 && item.count !== -1 && (
                  <span className="absolute top-2 right-2 bg-amber-500/20 text-amber-400 text-xs px-2 py-0.5 rounded-full font-bold">
                    {item.maxDurability === 100 ? `${item.count}%` : `x${item.count}`}
                  </span>
                )}
                {item.count === 0 && (
                  <span className="absolute top-2 right-2 bg-red-500/20 text-red-400 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
                    Agotado
                  </span>
                )}
                {item.icon ? (
                  <img 
                    src={item.icon.startsWith('/') ? `${import.meta.env.BASE_URL}${item.icon.slice(1)}` : item.icon} 
                    alt={item.name} 
                    className={`w-16 h-16 object-contain mb-3 transition-opacity ${item.count === 0 ? 'opacity-30 grayscale' : 'opacity-80 group-hover:opacity-100'}`} 
                  />
                ) : (
                  <div className={`w-16 h-16 bg-neutral-800 rounded mb-3 flex items-center justify-center text-neutral-600 ${item.count === 0 ? 'opacity-30' : ''}`}>
                    ?
                  </div>
                )}
                <h4 className={`font-bold text-center text-sm mb-1 ${item.count === 0 ? 'text-neutral-500' : 'text-amber-200'}`}>{t(`items.${item.id}.name`, item.name)}</h4>
                <p 
                  className="text-neutral-400 text-center mb-4 leading-tight flex-grow text-[1em]"
                >
                  {t(`items.${item.id}.desc`, item.desc)}
                </p>
                <button
                  onClick={() => handleUseItem(item)}
                  disabled={item.count === 0}
                  className={`w-full py-1.5 text-xs font-bold rounded transition-colors border ${
                    item.count === 0 
                      ? 'bg-neutral-900 border-neutral-800 text-neutral-600 cursor-not-allowed' 
                      : 'bg-neutral-800 hover:bg-amber-500/20 text-amber-500 hover:text-amber-300 border-neutral-700 hover:border-amber-500/50'
                  }`}
                >
                  {item.count === 0 ? 'VACÍO' : t('interface.useItem', 'USAR')}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryModal;
