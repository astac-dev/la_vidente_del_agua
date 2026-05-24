import React from 'react';
import { useTranslation } from 'react-i18next';
import MenuButton from './MenuButton';

const MainMenu = ({ onNavigate }) => {
  const { t } = useTranslation();

  const handleExit = () => {
    window.close();
  };

  return (
    <div className="main-menu">
      <MenuButton onClick={() => alert('Funcionalidad no implementada.')}>{t('continueGame')}</MenuButton>
      <MenuButton onClick={() => alert('Funcionalidad no implementada.')}>{t('newGame')}</MenuButton>
      <MenuButton onClick={() => alert('Funcionalidad no implementada.')}>{t('loadGame')}</MenuButton>
      <MenuButton onClick={() => onNavigate('extrasMenu')}>{t('extras')}</MenuButton>
      <MenuButton onClick={() => alert('Funcionalidad no implementada.')}>{t('options')}</MenuButton>
      <MenuButton onClick={() => alert('Funcionalidad no implementada.')}>{t('credits')}</MenuButton>
      <MenuButton onClick={handleExit}>{t('exit')}</MenuButton>
    </div>
  );
};

export default MainMenu;