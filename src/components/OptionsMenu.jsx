import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGameState } from '../context/GameStateContext';
import MenuButton from './MenuButton';
import './OptionsMenu.css';

const OptionsMenu = ({ onBack }) => {
    const { t } = useTranslation();
    const { settings, updateSetting } = useGameState();

    const handleSettingChange = (key, value) => {
        updateSetting(key, parseInt(value, 10));
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
                    <input
                        type="range"
                        id="font-size"
                        min="80"  // 80% del tamaño base
                        max="150" // 150% del tamaño base
                        value={settings.tamanoLetra}
                        onChange={(e) => handleSettingChange('tamanoLetra', e.target.value)}
                    />
                    <span className="slider-value">{settings.tamanoLetra}%</span>
                </div>
            </div>

            <div className="options-footer">
                <MenuButton onClick={onBack}>{t('menu.back')}</MenuButton>
            </div>
        </div>
    );
};

export default OptionsMenu;