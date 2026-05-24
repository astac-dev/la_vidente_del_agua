import React from 'react';
import { useTranslation } from 'react-i18next';
import './MainMenu.css';

const MainMenu = () => {
  const { t } = useTranslation();

  const menuItems = [
    'new_game',
    'load_game',
    'continue_game',
    'gallery',
    'scenes',
    'options',
    'credits',
    'exit',
  ];

  return (
    <nav className="main-menu">
      <ul>
        {menuItems.map((item) => (
          <li key={item}>
            <button className="menu-button">{t(`main_menu.${item}`)}</button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default MainMenu;