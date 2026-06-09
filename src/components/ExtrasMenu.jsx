import React from 'react';
import { useTranslation } from 'react-i18next';
import MenuButton from './MenuButton';

const ExtrasMenu = ({ onBack }) => {
  const { t } = useTranslation();

  return (
    <div className="extras-menu">
      <MenuButton onClick={() => alert('Funcionalidad no implementada.')}>{t('menu.artGallery')}</MenuButton>
      <MenuButton onClick={() => alert('Funcionalidad no implementada.')}>{t('menu.sceneSelector')}</MenuButton>
      <MenuButton onClick={() => alert('Funcionalidad no implementada.')}>{t('menu.bioculturalGlossary')}</MenuButton>
      <MenuButton onClick={onBack}>{t('menu.back')}</MenuButton>
    </div>
  );
};

export default ExtrasMenu;