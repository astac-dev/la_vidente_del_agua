import { useEffect, useRef, useCallback } from 'react';

/**
 * Realiza una transición suave (fade) del volumen de un elemento de audio.
 * Se implementa para evitar cortes de sonido secos que degraden la estética premium.
 */
export const fadeAudio = (audio, targetVolume, duration, callback) => {
  if (!audio) {
    if (callback) callback();
    return;
  }

  const startVolume = audio.volume;
  const diff = targetVolume - startVolume;
  if (diff === 0) {
    if (callback) callback();
    return;
  }

  const stepTime = 50;
  const steps = duration / stepTime;
  const stepChange = diff / steps;
  let currentStep = 0;

  if (audio.fadeInterval) {
    clearInterval(audio.fadeInterval);
  }

  audio.fadeInterval = setInterval(() => {
    currentStep++;
    let newVolume = startVolume + (stepChange * currentStep);

    if (diff > 0 && newVolume > targetVolume) newVolume = targetVolume;
    if (diff < 0 && newVolume < targetVolume) newVolume = targetVolume;
    if (newVolume < 0) newVolume = 0;
    if (newVolume > 1) newVolume = 1;

    audio.volume = newVolume;

    if (currentStep >= steps || newVolume === targetVolume) {
      clearInterval(audio.fadeInterval);
      audio.fadeInterval = null;
      if (callback) callback();
    }
  }, stepTime);
};

/**
 * Normaliza y resuelve las rutas del directorio público (/public) del juego.
 */
const getAssetUrl = (src) => {
  if (!src) return '';
  return src.startsWith('/') 
    ? `${import.meta.env.BASE_URL}${src.slice(1)}` 
    : src;
};

export const useAudioController = (currentScene, currentLine, gameState, settings) => {
  const bgmAudioRef = useRef(null);
  const sfxAudioRef = useRef(null);
  const currentBgmSrcRef = useRef(null);

  const resolvedBgm = currentScene?.bgm || gameState?.activeBgm;
  const resolvedSfx = currentScene?.sfx || gameState?.activeSfx;

  // BGM Manager
  useEffect(() => {
    const bgm = resolvedBgm;
    if (bgm && bgm.action === 'play') {
      const src = getAssetUrl(bgm.src);
      if (currentBgmSrcRef.current !== src) {
        if (bgmAudioRef.current) {
          const prevAudio = bgmAudioRef.current;
          fadeAudio(prevAudio, 0, 1000, () => {
            prevAudio.pause();
            prevAudio.src = '';
          });
        }

        const audio = new Audio(src);
        audio.loop = true;
        audio.volume = 0; // Iniciar en 0 para el fade-in
        
        audio.addEventListener('error', (e) => {
          console.warn(`No se pudo cargar el archivo BGM: ${src}`, e);
        });

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            fadeAudio(audio, settings.volumenMusica / 100, 1000);
          }).catch(err => {
            console.warn(`Reproducción de BGM bloqueada o interrumpida: ${src}`, err);
          });
        }

        bgmAudioRef.current = audio;
        currentBgmSrcRef.current = src;
      }
    } else if (bgm && bgm.action === 'stop') {
      if (bgmAudioRef.current) {
        const audio = bgmAudioRef.current;
        fadeAudio(audio, 0, 1000, () => {
          audio.pause();
          audio.src = '';
        });
        bgmAudioRef.current = null;
      }
      currentBgmSrcRef.current = null;
    }
  }, [resolvedBgm, settings.volumenMusica]);

  // SFX Manager (Scene level)
  useEffect(() => {
    const sfx = resolvedSfx;
    if (sfx && sfx.action === 'play') {
      const src = getAssetUrl(sfx.src);
      
      if (sfxAudioRef.current) {
        sfxAudioRef.current.pause();
        sfxAudioRef.current.src = '';
      }

      const audio = new Audio(src);
      audio.loop = sfx.loop || false;
      audio.volume = settings.volumenEfectos / 100;

      audio.addEventListener('error', (e) => {
        console.warn(`No se pudo cargar el archivo SFX: ${src}`, e);
      });

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.warn(`Reproducción de SFX bloqueada o interrumpida: ${src}`, err);
        });
      }

      sfxAudioRef.current = audio;
    } else if (sfx && sfx.action === 'stop') {
      if (sfxAudioRef.current) {
        sfxAudioRef.current.pause();
        sfxAudioRef.current.src = '';
        sfxAudioRef.current = null;
      }
    }
  }, [resolvedSfx, settings.volumenEfectos]);

  // SFX Manager (Line level)
  useEffect(() => {
    if (!currentLine || !currentLine.sfx) return;

    const sfx = currentLine.sfx;
    if (sfx.action === 'play') {
      const src = getAssetUrl(sfx.src);
      
      const audio = new Audio(src);
      audio.loop = sfx.loop || false;
      audio.volume = settings.volumenEfectos / 100;

      audio.addEventListener('error', (e) => {
        console.warn(`No se pudo cargar el archivo SFX de línea: ${src}`, e);
      });

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.warn(`Reproducción de SFX de línea bloqueada o interrumpida: ${src}`, err);
        });
      }
    }
  }, [currentLine, settings.volumenEfectos]);

  // Sync BGM volume changes
  useEffect(() => {
    if (bgmAudioRef.current) {
      bgmAudioRef.current.volume = settings.volumenMusica / 100;
    }
  }, [settings.volumenMusica]);

  // Sync SFX volume changes
  useEffect(() => {
    if (sfxAudioRef.current) {
      sfxAudioRef.current.volume = settings.volumenEfectos / 100;
    }
  }, [settings.volumenEfectos]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (bgmAudioRef.current) {
        if (bgmAudioRef.current.fadeInterval) {
          clearInterval(bgmAudioRef.current.fadeInterval);
        }
        bgmAudioRef.current.pause();
        bgmAudioRef.current.src = '';
      }
      if (sfxAudioRef.current) {
        sfxAudioRef.current.pause();
        sfxAudioRef.current.src = '';
      }
    };
  }, []);

  const stopBgmAndFade = useCallback((duration = 1500, callback) => {
    if (bgmAudioRef.current) {
      fadeAudio(bgmAudioRef.current, 0, duration, () => {
        if (bgmAudioRef.current) {
          bgmAudioRef.current.pause();
          bgmAudioRef.current.src = '';
        }
        if (callback) callback();
      });
    } else {
      if (callback) callback();
    }
  }, []);

  return { stopBgmAndFade };
};
