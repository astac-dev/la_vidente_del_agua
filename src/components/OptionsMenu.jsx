import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGameState } from '../context/GameStateContext';
import MenuButton from './MenuButton';
import './OptionsMenu.css';

const OptionsMenu = ({ onBack }) => {
    const { t } = useTranslation();
    const { settings, updateSetting } = useGameState();
    const [tempFontSize, setTempFontSize] = useState(settings.tamanoLetra || 100);

    const handleSettingChange = (key, value) => {
        updateSetting(key, parseInt(value, 10));
    };

    const handleBackClick = () => {
        updateSetting('tamanoLetra', tempFontSize);
        onBack();
    };

    return (
        <div className="options-menu">
            <h2 className="options-title">{t('menu.options')}</h2>
            
            <div className="option-item">
                <label htmlFor="music-volume">{t('interface.musicVolume')}</label>
                <div className="slider-container">
                    <input
                        type="range"
                        id="music-volume"
                        min="0"
                        max="100"
                        value={settings.volumenMusica}
                        onChange={(e) => handleSettingChange('volumenMusica', e.target.value)}
                    />
                    <span className="slider-value">{settings.volumenMusica}%</span>
                </div>
            </div>

            <div className="option-item">
                <label htmlFor="effects-volume">{t('interface.effectsVolume')}</label>
                <div className="slider-container">
                    <input
                        type="range"
                        id="effects-volume"
                        min="0"
                        max="100"
                        value={settings.volumenEfectos}
                        onChange={(e) => handleSettingChange('volumenEfectos', e.target.value)}
                    />
                    <span className="slider-value">{settings.volumenEfectos}%</span>
                </div>
            </div>

            <div className="option-item">
                <label htmlFor="font-size">{t('interface.tamanoLetra')}</label>
                <div className="slider-container">
                    <span 
                        className="font-size-preview" 
                        style={{ 
                            fontSize: `calc(1.1rem * ${tempFontSize / 100})`,
                            color: 'var(--accent-color)',
                            minWidth: '80px',
                            textAlign: 'left',
                            display: 'inline-block',
                            transition: 'font-size 0.05s ease-out'
                        }}
                    >
                        {t('interface.previewText', 'Texto')}
                    </span>
                    <input
                        type="range"
                        id="font-size"
                        min="80"  // 80% del tamaño base
                        max="200" // 200% del tamaño base
                        value={tempFontSize}
                        onChange={(e) => setTempFontSize(parseInt(e.target.value, 10))}
                    />
                    <span className="slider-value">{tempFontSize}%</span>
                </div>
            </div>

            <div className="options-footer">
                <MenuButton onClick={handleBackClick}>{t('menu.back')}</MenuButton>
            </div>
        </div>
    );
};

export default OptionsMenu;