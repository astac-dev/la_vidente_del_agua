import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGameState } from '../context/GameStateContext';
import './ExitScreen.css';

const ExitScreen = () => {
  const { t } = useTranslation();
  const { settings } = useGameState();
  return (
    <div 
      className="exit-screen-container"
      style={{ '--ui-scale-multiplier': `${(settings.tamanoLetra || 100) / 100}` }}
    >
      <div className="exit-screen-content">
        <h1>{t('exitMessageTitle')}</h1>
        <p>{t('exitMessageBody')}</p>
      </div>
    </div>
  );
};

export default ExitScreen;