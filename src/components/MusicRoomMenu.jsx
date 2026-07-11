import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useGameState } from '../context/GameStateContext';
import bgmData from '../data/bgmData.json';
import './MusicRoomMenu.css';

const MusicRoomMenu = ({ onBack }) => {
  const { t } = useTranslation();
  const { settings } = useGameState();
  const unlockedNodes = settings.unlockedNodes || ['cap_0'];
  
  const [activeTrack, setActiveTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // Inicializar reproductor
    audioRef.current = new Audio();
    audioRef.current.loop = true;

    // Sincronizar volumen
    const targetVolume = (settings.volumenMusica || 100) / 100;
    audioRef.current.volume = targetVolume;

    return () => {
      // Limpiar al desmontar
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, []);

  // Sincronizar cambios de volumen en tiempo real
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = (settings.volumenMusica || 100) / 100;
    }
  }, [settings.volumenMusica]);

  const handlePlayTrack = (track) => {
    if (!audioRef.current) return;

    if (activeTrack && activeTrack.id === track.id) {
      // Toggle play/pause
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    } else {
      // Play new track
      const base = import.meta.env.BASE_URL;
      const cleanFilename = track.filename.startsWith('/') ? track.filename.slice(1) : track.filename;
      
      audioRef.current.src = `${base}${cleanFilename}`;
      audioRef.current.play().then(() => {
        setActiveTrack(track);
        setIsPlaying(true);
      }).catch(err => {
        console.warn('Error reproduciendo BGM:', err);
      });
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="music-screen fade-in">
      <button 
        className="gallery-close-btn" 
        onClick={onBack}
        aria-label={t('music.closeRoom') || 'Cerrar'}
        title={t('menu.back') || 'Volver'}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <header className="gallery-header">
        <h1 className="gallery-title-main">
          {t('menu.musicRoom')}
        </h1>
        <p className="gallery-subtitle">
          {t('music.subtitle')}
        </p>
      </header>

      <main className="music-body">
        {/* Player superior */}
        <div className="music-player-panel">
          <div className="music-player-status">
            <span className="status-label">{t('music.nowPlaying') || 'Reproduciendo:'}</span>
            <span className="status-track">
              {activeTrack ? t(activeTrack.titleKey) : '--'}
            </span>
          </div>
          {activeTrack && (
            <div className="music-player-controls">
              <button 
                className="music-control-btn stop-btn"
                onClick={handleStop}
                disabled={!isPlaying}
              >
                {t('music.stop') || 'Detener'}
              </button>
            </div>
          )}
        </div>

        {/* Lista de pistas */}
        <div className="music-track-list">
          {bgmData.map((track) => {
            const isUnlocked = track.unlockCondition === 'always' || unlockedNodes.includes(track.unlockCondition);
            const title = isUnlocked ? t(track.titleKey) : (t('music.lockedTitle') || '???');
            const desc = isUnlocked ? t(track.descKey) : (t('music.lockedDesc') || 'Sigue jugando para desbloquear.');
            const isActive = activeTrack && activeTrack.id === track.id;

            return (
              <div 
                key={track.id} 
                className={`music-track-item ${!isUnlocked ? 'locked' : ''} ${isActive ? 'active' : ''}`}
                onClick={() => isUnlocked && handlePlayTrack(track)}
              >
                <div className="track-icon">
                  {isUnlocked ? (
                    isActive && isPlaying ? (
                      <div className="audio-bars">
                        <div className="bar"></div>
                        <div className="bar"></div>
                        <div className="bar"></div>
                      </div>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  )}
                </div>
                <div className="track-info">
                  <h3 className="track-title">{title}</h3>
                  <p className="track-desc">{desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default MusicRoomMenu;
