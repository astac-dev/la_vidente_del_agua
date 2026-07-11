import React from 'react';
import { useTranslation } from 'react-i18next';
import MenuButton from './MenuButton';

const ExtrasMenu = ({ onBack, onNavigate }) => {
  const { t } = useTranslation();

  return (
    <div className="extras-menu">
      <MenuButton onClick={() => onNavigate('artGallery')}>{t('menu.artGallery')}</MenuButton>
      <MenuButton onClick={() => onNavigate('musicRoom')}>{t('menu.musicRoom')}</MenuButton>
      <MenuButton onClick={() => onNavigate('storyMap')}>{t('menu.storyMap')}</MenuButton>
      <MenuButton onClick={() => alert('Funcionalidad no implementada.')}>{t('menu.bioculturalGlossary')}</MenuButton>
      <MenuButton onClick={onBack}>{t('menu.back')}</MenuButton>
    </div>
  );
};

export default ExtrasMenu;