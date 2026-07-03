// src/components/VisualNovel/BackgroundLayer.jsx
import React, { useState, useEffect } from 'react';

const BackgroundLayer = React.memo(({ background }) => {
  const [currentUrl, setCurrentUrl] = useState('');
  const [prevUrl, setPrevUrl] = useState('');
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (!background) return;
    const bgUrl = background.src.startsWith('/') 
      ? `${import.meta.env.BASE_URL}${background.src.slice(1)}` 
      : background.src;

    if (currentUrl === bgUrl) return;

    let isCancelled = false;

    if (currentUrl) {
      const img = new Image();
      img.onload = () => {
        if (isCancelled) return;
        setPrevUrl(currentUrl);
        setCurrentUrl(bgUrl);
        setFading(true);
        
        const duration = background.transition === 'none' ? 0 : (background.duration || 1000);
        
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (!isCancelled) setFading(false);
          });
        });

        setTimeout(() => {
          if (!isCancelled) setPrevUrl('');
        }, duration);
      };
      img.onerror = () => {
        if (!isCancelled) setCurrentUrl(bgUrl);
      };
      img.src = bgUrl;
    } else {
      setCurrentUrl(bgUrl);
    }

    return () => {
      isCancelled = true;
    };
  }, [background, currentUrl]);

  const duration = background?.transition === 'none' ? 0 : (background?.duration || 1000);
  const effectClass = background?.effect === 'glitch' ? 'vn-bg-glitch' : '';

  return (
    <>
      {currentUrl && (
        <div 
          className={`absolute inset-0 bg-cover bg-center z-0 ${effectClass}`} 
          style={{ 
            backgroundImage: `url(${currentUrl})`,
            '--bg-url': `url(${currentUrl})`
          }}
        />
      )}
      {prevUrl && (
        <div 
          className={`absolute inset-0 bg-cover bg-center z-[1] ${effectClass}`} 
          style={{ 
            backgroundImage: `url(${prevUrl})`,
            opacity: fading ? 1 : 0,
            transition: `opacity ${duration}ms ease-in-out`,
            '--bg-url': `url(${prevUrl})`
          }}
        />
      )}
    </>
  );
});

export default BackgroundLayer;