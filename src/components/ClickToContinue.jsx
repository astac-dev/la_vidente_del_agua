import React from 'react';
import { useTranslation } from 'react-i18next';
import './ClickToContinue.css';
import LanguageSelector from './LanguageSelector';

const ClickToContinue = ({ onContinue }) => {
  const { t } = useTranslation();

  return (
    <div className="click-to-continue-container" onClick={onContinue}>
      <LanguageSelector />
      <div className="click-to-continue-content">
        <h1>{t('interface.clickToContinue')}</h1>
      </div>
    </div>
  );
};

export default ClickToContinue;