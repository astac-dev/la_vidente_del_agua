// src/components/VisualNovel/BackgroundLayer.jsx
import React from 'react';

const BackgroundLayer = React.memo(({ background }) => {
  if (!background) return null;

  return (
    <div 
      className="absolute inset-0 bg-cover bg-center transition-all duration-500 ease-in-out z-0" 
      style={{ backgroundImage: `url(${background.src})` }}
    />
  );
});

export default BackgroundLayer;