import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import './NaiaSurvivalMinigame.css';

const COMMANDS = ['W', 'A', 'S', 'D'];
const MAX_TIME = 2500; // 2.5 segundos por comando

const NaiaSurvivalMinigame = ({ onComplete }) => {
  const { t } = useTranslation();
  const [sequence, setSequence] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [status, setStatus] = useState('playing'); // 'playing', 'success', 'failure'
  const [ringKey, setRingKey] = useState(0); // Para reiniciar la animación del anillo
  const [targetPosition, setTargetPosition] = useState({ top: '50%', left: '50%' });

  // Inicializar secuencia de 3 comandos aleatorios
  useEffect(() => {
    const seq = Array.from({ length: 3 }, () => COMMANDS[Math.floor(Math.random() * COMMANDS.length)]);
    setSequence(seq);
  }, []);

  // Cambiar la posición del círculo en cada acierto
  useEffect(() => {
    if (status === 'playing') {
      const top = Math.floor(Math.random() * 50 + 25) + '%'; // Entre 25% y 75%
      const left = Math.floor(Math.random() * 60 + 20) + '%'; // Entre 20% y 80%
      setTargetPosition({ top, left });
    }
  }, [currentIndex, status]);

  const handleSuccess = useCallback(() => {
    setStatus('success');
    setTimeout(() => {
      // Retorna éxito, modificando estadísticas globales como se solicitó
      onComplete({ 
        success: true, 
        stats: { preservacion: 1 }, 
        flags: { flag_naia_esquivo: true },
        nextNode: 'escena_1_5_exito' // Puedes ajustar esto según el motor
      });
    }, 1500);
  }, [onComplete]);

  const handleFailure = useCallback(() => {
    setStatus('failure');
    setTimeout(() => {
      // Retorna fallo, redirigiendo a daño físico
      onComplete({ 
        success: false, 
        nextNode: 'escena_1_5_ruta_a' // Redirige a ruta de daño
      });
    }, 1500);
  }, [onComplete]);

  // Manejador del temporizador
  useEffect(() => {
    if (status !== 'playing' || sequence.length === 0) return;

    const timer = setTimeout(() => {
      handleFailure();
    }, MAX_TIME);

    return () => clearTimeout(timer);
  }, [currentIndex, status, sequence, handleFailure]);

  // Manejador de teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (status !== 'playing' || sequence.length === 0) return;
      
      const key = e.key.toUpperCase();
      const expected = sequence[currentIndex];
      
      // Mapeo de flechas a WASD para mayor flexibilidad
      let mappedKey = key;
      if (key === 'ARROWUP') mappedKey = 'W';
      if (key === 'ARROWDOWN') mappedKey = 'S';
      if (key === 'ARROWLEFT') mappedKey = 'A';
      if (key === 'ARROWRIGHT') mappedKey = 'D';

      if (COMMANDS.includes(mappedKey)) {
        if (mappedKey === expected) {
          // Acierto
          if (currentIndex === sequence.length - 1) {
            handleSuccess();
          } else {
            setCurrentIndex(prev => prev + 1);
            setRingKey(prev => prev + 1); // Reiniciar animación
          }
        } else {
          // Fallo al presionar tecla incorrecta
          handleFailure();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, sequence, status, handleSuccess, handleFailure]);

  // Manejador para el click (opcional para jugadores móviles/ratón)
  const handleCircleClick = () => {
    if (status !== 'playing' || sequence.length === 0) return;
    
    if (currentIndex === sequence.length - 1) {
      handleSuccess();
    } else {
      setCurrentIndex(prev => prev + 1);
      setRingKey(prev => prev + 1);
    }
  };

  const getAssetUrl = (src) => {
    if (!src) return '';
    // Importante para Vite y despliegues en GitHub Pages/itch.io
    const base = import.meta.env.BASE_URL || '/';
    return src.startsWith('/') ? `${base}${src.slice(1)}` : src;
  };

  if (sequence.length === 0) return null;

  return (
    <div className="naia-qte-container">
      {/* Enjambre de murciélagos generados con posiciones aleatorias */}
      <div className="qte-bats-container">
        {Array.from({ length: 12 }).map((_, i) => (
          <img 
            key={i} 
            src={getAssetUrl('/sprites/murcielago.png')} 
            alt="murciélago" 
            className={`qte-bat bat-${i}`} 
          />
        ))}
      </div>

      {/* Flama temblorosa en el centro para simular pánico */}
      <div className="qte-flame-container">
        <div className="qte-flame"></div>
      </div>

      {/* Interfaz de QTE */}
      <div className="qte-ui">
        {status === 'playing' && (
          <div className="qte-prompt">
            <h2 className="qte-title">{t('minigame.defend')}</h2>
            <div 
              className="qte-target" 
              onClick={handleCircleClick}
              style={{
                top: targetPosition.top,
                left: targetPosition.left,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div 
                key={ringKey} 
                className="qte-ring" 
                style={{ animationDuration: `${MAX_TIME}ms` }}
              ></div>
              <div className="qte-key">{sequence[currentIndex]}</div>
            </div>
            <p className="qte-instruction">
              {t('minigame.sequence')} {currentIndex + 1} / 3
            </p>
          </div>
        )}
        
        {status === 'success' && (
          <div className="qte-result-container">
            <h2 className="qte-result success">{t('minigame.dodged')}</h2>
          </div>
        )}
        
        {status === 'failure' && (
          <div className="qte-result-container">
            <h2 className="qte-result failure">{t('minigame.caught')}</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default NaiaSurvivalMinigame;
