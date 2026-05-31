import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

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

const VisualNovelContainer = () => {
    // Estado para saber si la orientación es horizontal (landscape)
    const [isLandscape, setIsLandscape] = useState(window.innerWidth > window.innerHeight);

    useEffect(() => {
        const checkOrientation = () => {
            setIsLandscape(window.innerWidth > window.innerHeight);
        };

        // Se revisa la orientación cada vez que la ventana cambia de tamaño.
        window.addEventListener('resize', checkOrientation);
        checkOrientation(); // Comprobación inicial

        // Limpieza del evento al desmontar el componente.
        return () => window.removeEventListener('resize', checkOrientation);
    }, []);

    // Si no es horizontal, muestra el aviso.
    if (!isLandscape) {
        return <RotateDevicePrompt />;
    }

    // Si es horizontal, muestra el contenedor de la novela visual.
    return (
        <div className="visual-novel-container">
            {/* Aquí se integraría el motor de la novela visual. */}
            {/* Por ahora, es un marcador de posición. */}
            <div className="dialogue-box">
                <p className="character-name">Personaje</p>
                <p className="dialogue-text">Este es el espacio donde se mostrará el diálogo de la novela visual...</p>
            </div>
        </div>
    );
};

export default VisualNovelContainer;