import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useGameState } from '../context/GameStateContext';
import FullscreenEnterIcon from './icons/FullscreenEnterIcon.jsx';
import FullscreenExitIcon from './icons/FullscreenExitIcon.jsx';
import HomeIcon from './HomeIcon.jsx';
import glifoAgua from '/public/arte/glifoaguafluyendo.png';

// Componente interno para mostrar el aviso de rotación.
const RotateDevicePrompt = () => {
    const { t } = useTranslation();
    return (
        <div className="rotate-prompt-overlay">
            <div className="rotate-prompt-content">
                <svg className="rotate-icon" xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M370-80q-99.38 0-169.69-70.31Q130-220.62 130-320v-320q0-99.38 70.31-169.69Q270.62-880 370-880h220q99.38 0 169.69 70.31Q830-739.38 830-640v320q0 99.38-70.31 169.69Q689.38-80 590-80H370Zm0-60h220q75 0 125-50t50-125v-320q0-75-50-125t-125-50H370q-75 0-125 50t-50 125v320q0 75 50 125t125 50Zm110-200-71-71 29-29 42 42 42-42 29 29-71 71Zm0 120L240-440l42-42 88 88v-286h60v286l88-88 42 42-140 140Z"/></svg>
                <p>{t('interface.rotateDevicePrompt')}</p>
            </div>
        </div>
    );
};

const VisualNovelContainer = ({ onNavigate }) => {
    // Estado para saber si la orientación es horizontal (landscape)
    const { t } = useTranslation();
    const { settings } = useGameState();
    const [isLandscape, setIsLandscape] = useState(window.innerWidth > window.innerHeight);
    const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);
    const [isAuto, setIsAuto] = useState(false);
    const [isTextFinished, setIsTextFinished] = useState(true); // Para controlar el indicador de avance

    const handleGoToMenu = () => {
        if (onNavigate) {
            onNavigate('mainMenu');
        }
    };

    const toggleAuto = () => {
        setIsAuto(prev => !prev);
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            // Entrar en pantalla completa
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error al intentar activar el modo de pantalla completa: ${err.message} (${err.name})`);
            });
        } else {
            // Salir de pantalla completa
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    useEffect(() => {
        const checkOrientation = () => {
            setIsLandscape(window.innerWidth > window.innerHeight);
        };

        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        // Listener para la orientación
        // Se revisa la orientación cada vez que la ventana cambia de tamaño.
        window.addEventListener('resize', checkOrientation);
        checkOrientation(); // Comprobación inicial

        // Listeners para el estado de pantalla completa
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange); // Safari
        document.addEventListener('mozfullscreenchange', handleFullscreenChange); // Firefox
        document.addEventListener('MSFullscreenChange', handleFullscreenChange); // IE/Edge

        // Limpieza del evento al desmontar el componente.
        return () => {
            window.removeEventListener('resize', checkOrientation);
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
            document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
            document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
        };
    }, []);

    // Si no es horizontal, muestra el aviso.
    if (!isLandscape) {
        return <RotateDevicePrompt />;
    }

    // Si es horizontal, muestra el contenedor de la novela visual.
    return (
        <div className="ark-view-wrapper">
            <div
                className="ark-scene-container"
                style={{
                    '--dialogue-font-size-multiplier': `${settings.tamanoLetra / 100}`
                }}
            >
                {/* La imagen de fondo de la escena se controla por CSS */}
                <div className="scene-overlay"></div>

                {/* Contenedor para los Sprites de Personajes */}
                <div className="character-sprite-container">
                    {/* <img src="/path/to/character.png" alt="Character" className="character-sprite" /> */}
                </div>

                {/* --- UI HUD --- */}
                {/* Controles Superiores Izquierdos (Existentes) */}
                <div className="ui-buttons-container-topleft">
                    <button onClick={toggleFullscreen} className="ui-button" title={t('interface.toggleFullscreen')}>
                        {isFullscreen ? <FullscreenExitIcon /> : <FullscreenEnterIcon />}
                    </button>
                    <button
                        onClick={handleGoToMenu}
                        className="ui-button"
                        title={t('interface.backToMenu')}
                        disabled={isFullscreen}
                    >
                        <HomeIcon />
                    </button>
                </div>

                {/* Controles Superiores Derechos (Nuevos) */}
                <div className="ui-buttons-container-topright">
                    <button onClick={toggleAuto} className={`ark-uibutton auto-button ${isAuto ? 'active' : ''}`}>
                        AUTO
                    </button>
                    <button className="ark-uibutton skip-button">
                        SKIP ▶
                    </button>
                </div>

                {/* Caja de Diálogo Cinematográfica */}
                <div className="dialogue-box-cinematic">
                    <div className="character-name-container">
                        <p className="character-name">Dra. Sofía (INAH)</p>
                    </div>
                    <p className="dialogue-text">Qué bueno que llegas. Los pescadores locales encontraron restos de madera vieja cerca del arrecife exterior. Podría ser un pecio arqueológico importante.</p>
                    
                    {/* Indicador de Glifo de Agua */}
                    {isTextFinished && <img src={glifoAgua} alt="Continuar" className="vn-glifo-indicator" />}
                </div>
            </div>
        </div>
    );
};

export default VisualNovelContainer;