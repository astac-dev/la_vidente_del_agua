// src/components/VisualNovel/OrientationBlocker.jsx
import React, { useState, useEffect } from 'react';

const OrientationBlocker = () => {
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);

  useEffect(() => {
    const checkOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };

    window.addEventListener('resize', checkOrientation);
    // Comprobación inicial
    checkOrientation();

    return () => window.removeEventListener('resize', checkOrientation);
  }, []);

  if (!isPortrait) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black text-white px-8 text-center backdrop-blur-sm">
      <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        className="w-20 h-20 mb-6 text-amber-500 animate-[spin_3s_ease-in-out_infinite]"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
      </svg>
      <h2 className="text-2xl font-sans tracking-widest text-neutral-200 mb-4">MODO VERTICAL NO SOPORTADO</h2>
      <p className="text-neutral-400 font-sans max-w-md mx-auto leading-relaxed">
        Para disfrutar de la experiencia completa de <strong>La Vidente del Agua</strong>, por favor rota tu dispositivo a posición horizontal.
      </p>
    </div>
  );
};

export default OrientationBlocker;