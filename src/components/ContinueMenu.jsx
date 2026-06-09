import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGameState } from '../context/GameStateContext';
import MenuButton from './MenuButton';
import './ContinueMenu.css';

const ContinueMenu = ({ onBack, onNavigate }) => {
  const { t, i18n } = useTranslation();
  const { saves, loadGameFromSlot } = useGameState();

  const handleSlotClick = (slotIndex) => {
    const success = loadGameFromSlot(slotIndex);
    if (success) {
      onNavigate('visualNovel');
    }
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
            <button
              key={slotIndex}
              onClick={() => hasSave && handleSlotClick(slotIndex)}
              disabled={!hasSave}
              className={`slot-card ${hasSave ? 'has-save' : 'empty-slot'}`}
            >
              <div className="slot-header">
                <span className="slot-number">{t('interface.saveSlot', 'Ranura').toUpperCase()} 0{slotIndex + 1}</span>
                {saveTime && <span className="slot-date">{saveTime}</span>}
              </div>
              <div className="slot-body">
                <span className="slot-title-text">{saveName}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="continue-footer">
        <MenuButton onClick={onBack}>{t('menu.back')}</MenuButton>
      </div>
    </div>
  );
};

export default ContinueMenu;
