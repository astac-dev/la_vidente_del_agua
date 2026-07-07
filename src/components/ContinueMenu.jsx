import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGameState } from '../context/GameStateContext';
import MenuButton from './MenuButton';
import './ContinueMenu.css';

const ContinueMenu = ({ onBack, onNavigate }) => {
  const { t, i18n } = useTranslation();
  const { saves, loadGameFromSlot, deleteSaveSlot } = useGameState();
  const [slotToDelete, setSlotToDelete] = useState(null);

  const handleSlotClick = (slotIndex) => {
    const success = loadGameFromSlot(slotIndex);
    if (success) {
      onNavigate('visualNovel');
    }
  };

  const handleDeleteClick = (e, slotIndex) => {
    e.stopPropagation();
    setSlotToDelete(slotIndex);
  };

  const confirmDelete = () => {
    if (slotToDelete !== null) {
      deleteSaveSlot(slotToDelete);
      setSlotToDelete(null);
    }
  };

  const cancelDelete = () => {
    setSlotToDelete(null);
  };

  return (
    <div className="continue-menu">
      <h2 className="continue-title">{t('menu.continueGame')}</h2>
      
      <div className="slots-container">
        {[0, 1, 2].map((slotIndex) => {
          const save = saves[slotIndex];
          const hasSave = !!save;
          let saveName = t('interface.emptySlot', 'Espacio Vacío');
          let saveTime = '';
          
          if (hasSave) {
            const chTitle = t(`historia.${save.chapterId}.titulo`, save.chapterId);
            const scTitle = t(`historia.${save.chapterId}.escenas.${save.sceneId}.titulo_escena`, save.sceneId);
            saveName = `${chTitle} - ${scTitle}`;
            // Map custom 'my' code to 'es-MX' to avoid Burmese date formatting
            const dateLocale = i18n.language === 'my' ? 'es-MX' : i18n.language;
            saveTime = new Date(save.timestamp).toLocaleString(dateLocale);
          }

          return (
            <div
              key={slotIndex}
              onClick={() => hasSave && handleSlotClick(slotIndex)}
              className={`slot-card ${hasSave ? 'has-save' : 'empty-slot'}`}
              role="button"
              tabIndex={hasSave ? 0 : -1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  hasSave && handleSlotClick(slotIndex);
                }
              }}
            >
              <div className="slot-header">
                <div className="slot-header-left">
                  <span className="slot-number">{t('interface.saveSlot', 'Ranura').toUpperCase()} 0{slotIndex + 1}</span>
                  {saveTime && <span className="slot-date">{saveTime}</span>}
                </div>
                {hasSave && (
                  <button 
                    className="delete-slot-btn" 
                    onClick={(e) => handleDeleteClick(e, slotIndex)}
                    title={t('interface.deleteSave', 'Eliminar punto de guardado')}
                  >
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" className="delete-icon">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                )}
              </div>
              <div className="slot-body">
                <span className="slot-title-text">{saveName}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="continue-footer">
        <MenuButton onClick={onBack}>{t('menu.back')}</MenuButton>
      </div>

      {slotToDelete !== null && (
        <div className="delete-modal-overlay">
          <div className="delete-modal continue-menu">
            <h3 className="continue-title" style={{ fontSize: '1.5rem', textAlign: 'center', marginBottom: '1.5rem' }}>
              {t('interface.confirmDelete', '¿Deseas eliminar este punto de guardado?')}
            </h3>
            <div className="delete-modal-actions">
              <MenuButton onClick={confirmDelete}>{t('interface.yes', 'Sí')}</MenuButton>
              <MenuButton onClick={cancelDelete}>{t('interface.no', 'No')}</MenuButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContinueMenu;
