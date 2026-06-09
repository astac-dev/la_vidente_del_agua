import React from 'react';
import { useTranslation } from 'react-i18next';
import './ClickToContinue.css';
import LanguageSelector from './LanguageSelector';

import { useGameState } from '../context/GameStateContext';

const ClickToContinue = ({ onContinue }) => {
  const { t } = useTranslation();
  const { settings } = useGameState();

  return (
    <div 
      className="click-to-continue-container" 
      style={{ '--ui-scale-multiplier': `${(settings.tamanoLetra || 100) / 100}` }}
    >
      <LanguageSelector />
      <div 
        className="click-to-continue-content"
        onClick={onContinue}
      >
        <h1>{t('interface.clickToContinue')}</h1>
      </div>
    </div>
  );
};

export default ClickToContinue;