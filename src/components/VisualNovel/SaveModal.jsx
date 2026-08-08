import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGameState } from '../../context/GameStateContext';

const SaveModal = ({ isOpen, onClose, onSaveAndExit, onExitWithoutSaving }) => {
  const { t, i18n } = useTranslation();
  const { saves } = useGameState();

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-black/85 flex items-center justify-center z-[200] pointer-events-auto select-none">
      <div className="bg-neutral-900/95 border border-amber-500/30 p-6 rounded-lg shadow-2xl max-w-md w-full mx-4 font-mono text-left vn-save-modal">
        <h3 className="text-lg font-bold text-amber-400 mb-2 border-b border-amber-500/20 pb-2 flex justify-between items-center vn-save-modal-title">
          <span>{t('interface.saveSlotTitle', 'GUARDAR PARTIDA')}</span>
          <span className="text-[9px] font-normal text-neutral-500 tracking-wider vn-save-modal-subtitle">SYS.SAV // SLOT_SELECT</span>
        </h3>
        <p className="text-xs text-neutral-400 mb-4 leading-relaxed vn-save-modal-prompt">
          {t('interface.saveSlotPrompt', 'Selecciona una ranura de guardado para registrar tu progreso antes de salir:')}
        </p>
        
        <div className="flex flex-col gap-2.5 mb-5 vn-save-slots-container">
          {[0, 1, 2].map((slotIndex) => {
            const save = saves[slotIndex];
            const hasSave = !!save;
            let saveName = t('interface.emptySlot', 'Espacio Vacío');
            let saveTime = '';
            if (hasSave) {
              const chTitle = t(`historia.${save.chapterId}.titulo`, save.chapterId);
              const scTitle = t(`historia.${save.chapterId}.escenas.${save.sceneId}.titulo_escena`, save.sceneId);
              saveName = `${chTitle} - ${scTitle}`;
              const dateLocale = i18n.language === 'my' ? 'es-MX' : i18n.language;
              saveTime = new Date(save.timestamp).toLocaleString(dateLocale);
            }

            return (
              <button
                key={slotIndex}
                onClick={() => onSaveAndExit(slotIndex)}
                className="w-full text-left p-3 rounded border border-neutral-800 bg-neutral-950/70 hover:bg-neutral-900 hover:border-amber-400 transition-all group flex flex-col gap-1 cursor-pointer vn-save-slot-btn"
              >
                <div className="flex justify-between items-center w-full vn-save-slot-header">
                  <span className="text-[10px] font-bold text-neutral-500 group-hover:text-amber-400 vn-save-slot-label">
                    {t('interface.saveSlot', 'Ranura').toUpperCase()} 0{slotIndex + 1}
                  </span>
                  {saveTime && (
                    <span className="text-[9px] text-neutral-500 vn-save-slot-time">{saveTime}</span>
                  )}
                </div>
                <span className={`text-xs truncate max-w-full vn-save-slot-text ${hasSave ? 'text-neutral-200' : 'text-neutral-600 italic'}`}>
                  {saveName}
                </span>
              </button>
            );
          })}
        </div>
        
        <div className="flex justify-between gap-3 pt-1 border-t border-neutral-800 vn-save-modal-actions">
          <button
            onClick={onExitWithoutSaving}
            className="px-3 py-1.5 border border-red-900/40 bg-red-950/10 hover:bg-red-900/30 text-red-400 text-[10px] font-bold uppercase tracking-wider rounded transition-all cursor-pointer vn-save-modal-exit-btn"
          >
            {t('interface.exitWithoutSaving', 'SALIR SIN GUARDAR')}
          </button>
          <button
            onClick={onClose}
            className="px-3 py-1.5 border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[10px] font-bold uppercase tracking-wider rounded transition-all cursor-pointer vn-save-modal-cancel-btn"
          >
            {t('interface.cancel', 'CANCELAR')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveModal;
