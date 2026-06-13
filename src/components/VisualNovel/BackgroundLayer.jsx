// src/components/VisualNovel/BackgroundLayer.jsx
import React from 'react';

const BackgroundLayer = React.memo(({ background }) => {
  if (!background) return null;

  const bgUrl = background.src.startsWith('/') 
    ? `${import.meta.env.BASE_URL}${background.src.slice(1)}` 
    : background.src;

  return (
    <div 
      className="absolute inset-0 bg-cover bg-center transition-all ease-in-out z-0" 
      style={{ 
        backgroundImage: `url(${bgUrl})`,
        transitionDuration: background.duration ? `${background.duration}ms` : '500ms'
      }}
    />
  );
});

export default BackgroundLayer;