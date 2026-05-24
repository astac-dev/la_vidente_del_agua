import React from 'react';
import { useTranslation } from 'react-i18next';
import MainMenu from './components/MainMenu';
import './App.css';

function App() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="language-switcher">
          <button onClick={() => changeLanguage('es')} disabled={i18n.language === 'es'}>ES</button>
          <button onClick={() => changeLanguage('en')} disabled={i18n.language === 'en'}>EN</button>
          <button onClick={() => changeLanguage('my')} disabled={i18n.language === 'my'}>MY</button>
        </div>
      </header>
      <main className="app-main">
        <MainMenu />
      </main>
    </div>
  );
}

export default App;