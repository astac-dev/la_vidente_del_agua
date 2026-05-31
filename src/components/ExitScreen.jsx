import React from 'react';
import { useTranslation } from 'react-i18next';
import './ExitScreen.css';

const ExitScreen = () => {
  const { t } = useTranslation();
  return (
    <div className="exit-screen-container">
      <div className="exit-screen-content">
        <h1>{t('exitMessageTitle')}</h1>
        <p>{t('exitMessageBody')}</p>
      </div>
    </div>
  );
};

export default ExitScreen;