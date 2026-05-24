import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGameState } from '../context/GameStateContext';
import './LanguageSelector.css';

const LanguageSelector = () => {
  const { t } = useTranslation();
  const { settings, updateSetting } = useGameState();

  return (
    <div className="language-selector-wrapper">
      <div className="language-label">{t('language')}</div>
      <div className="language-buttons">
        <button onClick={() => updateSetting('idioma', 'es')} className={settings.idioma === 'es' ? 'active' : ''}>Español</button>
        <button onClick={() => updateSetting('idioma', 'en')} className={settings.idioma === 'en' ? 'active' : ''}>English</button>
        <button onClick={() => updateSetting('idioma', 'my')} className={settings.idioma === 'my' ? 'active' : ''}>Maaya t'aan</button>
      </div>
    </div>
  );
};

export default LanguageSelector;