// src/components/VisualNovel/DialogueLogModal.jsx
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const DialogueLogModal = ({ isOpen, onClose, history }) => {
  const { t } = useTranslation();
  const logEndRef = useRef(null);

  // Auto-scroll to the end of the log when opened
  useEffect(() => {
    if (isOpen && logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, history]);

  return (
    <div 
      className={`fixed inset-0 bg-black/85 backdrop-blur-sm z-[400] flex items-center justify-center p-4 md:p-8 select-none transition-all duration-300 ease-in-out ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div 
        className={`relative w-full max-w-4xl h-[80vh] bg-neutral-950/95 border border-neutral-800 rounded flex flex-col shadow-2xl transition-all duration-300 ease-in-out ${
          isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
      >
        
        {/* Header de la Bitácora */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-neutral-900">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-4 bg-amber-500" />
            <h2 className="font-mono text-sm font-bold tracking-wider text-amber-500 uppercase">
              {t('interface.logTitle', 'Bitácora de Campo // Historial de Diálogos')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white hover:bg-neutral-900 px-3 py-1.5 rounded transition-colors font-mono text-xs uppercase border border-neutral-800 hover:border-amber-500"
            title={t('interface.close', 'Cerrar')}
          >
            ✕ {t('interface.closeBtn', 'Cerrar')}
          </button>
        </div>

        {/* Cuerpo del Log con Scroll */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 font-sans text-sm">
          {history && history.length > 0 ? (
            history.map((item, index) => {
              const charName = t(`personajes.${item.character}`, item.character);
              const translatedText = t(item.textKey, item.fallbackText);
              
              const isNarratorOrSystem = item.character === 'narrador' || item.character === 'sistema';

              return (
                <div 
                  key={index} 
                  className="flex flex-col md:flex-row md:items-start gap-2 md:gap-6 pb-4 border-b border-neutral-900/40 last:border-0 last:pb-0"
                >
                  {/* Nombre del Hablante */}
                  <div className="w-32 shrink-0">
                    <span className={`font-semibold tracking-wide ${isNarratorOrSystem ? 'text-amber-500/50 italic text-xs' : 'text-amber-400'}`}>
                      {isNarratorOrSystem ? `[${charName}]` : charName}
                    </span>
                  </div>

                  {/* Contenido del Texto */}
                  <div className="flex-1">
                    <p className={`${isNarratorOrSystem ? 'text-neutral-400 italic font-light' : 'text-neutral-200'}`}>
                      {translatedText}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="h-full flex items-center justify-center text-neutral-600 font-mono text-xs uppercase tracking-wider">
              {t('interface.noLog', 'No hay registros en la bitácora todavía.')}
            </div>
          )}
          <div ref={logEndRef} />
        </div>

        {/* Footer Informativo */}
        <div className="px-6 py-3 border-t border-neutral-900 bg-black/20 flex justify-between items-center text-[10px] text-neutral-500 font-mono">
          <span>INAH-SAS // REC.LOG_V0.1</span>
          <span>CAPÍTULO_ACTUAL: {history?.[0]?.chapter?.toUpperCase() || 'N/A'}</span>
        </div>
      </div>
    </div>
  );
};

export default DialogueLogModal;
