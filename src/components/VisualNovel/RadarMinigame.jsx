import React, { useState, useEffect, useRef } from 'react';

const RadarMinigame = ({ onSuccess, onFailure }) => {
  const waveRadiusRef = useRef(0);
  const waveElRef = useRef(null);
  const ghostWaveElRef = useRef(null);
  const [currentTargetIndex, setCurrentTargetIndex] = useState(0);
  const [failures, setFailures] = useState(0);
  const [isFadingIn, setIsFadingIn] = useState(true);
  const [isEnding, setIsEnding] = useState(false);
  const [flashError, setFlashError] = useState(false);
  const [targets, setTargets] = useState([]);
  const requestRef = useRef();
  const containerRef = useRef();

  const MAX_FAILURES = 3;
  const WAVE_SPEED = 60; // Porcentaje de expansión por segundo
  const TOLERANCE = 15; // Tolerancia en porcentaje de distancia

  // Inicializar objetivos
  useEffect(() => {
    const newTargets = [];
    for (let i = 0; i < 3; i++) {
      // Ángulo entre -40 y 40 grados (0 es vertical hacia arriba)
      const angle = (Math.random() * 80) - 40;
      // Distancia entre 20% y 85% del radio máximo
      const distance = Math.random() * 65 + 20;
      newTargets.push({ angle, distance });
    }
    setTargets(newTargets);

    // Fade in
    const timer = setTimeout(() => setIsFadingIn(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Animación de la onda de eco
  useEffect(() => {
    let lastTime = performance.now();

    const animate = (time) => {
      if (isEnding) return;
      const deltaTime = (time - lastTime) / 1000;
      lastTime = time;

      let nextRadius = waveRadiusRef.current + WAVE_SPEED * deltaTime;
      if (nextRadius > 100) nextRadius = 0; // Reiniciar onda
      waveRadiusRef.current = nextRadius;

      if (waveElRef.current) {
        waveElRef.current.style.width = `${nextRadius}%`;
        waveElRef.current.style.height = `${nextRadius}%`;
        waveElRef.current.style.opacity = 1 - (nextRadius / 100);
      }

      if (ghostWaveElRef.current) {
        const ghostRadius = Math.max(0, nextRadius - 5);
        ghostWaveElRef.current.style.width = `${ghostRadius}%`;
        ghostWaveElRef.current.style.height = `${ghostRadius}%`;
        ghostWaveElRef.current.style.opacity = Math.max(0, 1 - (nextRadius / 100) - 0.2);
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isEnding]);

  const endMinigame = (isSuccess) => {
    setIsEnding(true);
    setTimeout(() => {
      if (isSuccess && onSuccess) onSuccess();
      else if (!isSuccess && onFailure) onFailure();
    }, 1000); // 1 segundo de fade out
  };

  const handleClick = (e) => {
    if (isEnding || isFadingIn || currentTargetIndex >= 3) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const clickX = e.clientX - rect.left - centerX;
    const clickY = e.clientY - rect.top - centerY;

    const target = targets[currentTargetIndex];
    if (!target) return;

    // Calcular posición real del objetivo en el canvas
    const maxRadius = rect.width / 2;
    const targetRadiusPx = (target.distance / 100) * maxRadius;
    const targetAngleRad = target.angle * (Math.PI / 180);
    const targetX = targetRadiusPx * Math.sin(targetAngleRad);
    const targetY = -targetRadiusPx * Math.cos(targetAngleRad);

    const distToTarget = Math.sqrt(Math.pow(clickX - targetX, 2) + Math.pow(clickY - targetY, 2));

    // Diferencia entre la onda actual y la distancia del objetivo
    const distanceDiff = Math.abs(waveRadiusRef.current - target.distance);

    // Hitbox responsiva (25% del radio del radar, min 40px)
    const hitboxSize = Math.max(40, maxRadius * 0.25);

    if (distToTarget < hitboxSize) {
      if (distanceDiff <= TOLERANCE) {
        // ÉXITO
        const nextIndex = currentTargetIndex + 1;
        setCurrentTargetIndex(nextIndex);
        if (nextIndex >= 3) {
          endMinigame(true);
        }
      } else {
        // FALLO por timing
        handleFailure();
      }
    } else {
      // FALLO por fallar al punto completamente
      handleFailure();
    }
  };

  const handleFailure = () => {
    setFlashError(true);
    setTimeout(() => setFlashError(false), 200);
    const newFailures = failures + 1;
    setFailures(newFailures);
    if (newFailures >= MAX_FAILURES) {
      endMinigame(false);
    }
  };

  const opacityFossil = currentTargetIndex * 0.33 + (isEnding && currentTargetIndex >= 3 ? 0.01 : 0);

  return (
    <div
      className={`absolute inset-0 z-[250] bg-black transition-opacity duration-1000 flex items-center justify-center font-mono overflow-hidden ${(isFadingIn || isEnding) ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
        }`}
    >
      <div
        className={`absolute inset-0 bg-red-600/30 transition-opacity duration-100 z-10 pointer-events-none ${flashError ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* Fondo Oculto del Fósil */}
      <img
        src={`${import.meta.env.BASE_URL}backgrounds/radar_fossil.png`}
        alt="Fossil Vector"
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out mix-blend-screen"
        style={{ opacity: opacityFossil }}
      />

      {/* UI Principal del Motion Tracker */}
      <div
        ref={containerRef}
        className="relative flex-shrink-0 h-[100%] aspect-square rounded-full cursor-crosshair translate-y-[25%]"
        style={{
          clipPath: 'polygon(50% 50%, 0 0, 100% 0)',
          background: 'rgba(10, 40, 10, 0.4)',
          borderTop: '2px solid rgba(34,197,94,0.5)'
        }}
        onClick={handleClick}
      >
        {/* Rayos del radar (Grid) */}
        <div className="absolute top-1/2 left-1/2 w-px h-1/2 bg-green-500/30 origin-top -translate-x-1/2 -rotate-45" />
        <div className="absolute top-1/2 left-1/2 w-px h-1/2 bg-green-500/30 origin-top -translate-x-1/2 -rotate-25" />
        <div className="absolute top-1/2 left-1/2 w-px h-1/2 bg-green-500/40 origin-top -translate-x-1/2 rotate-0" />
        <div className="absolute top-1/2 left-1/2 w-px h-1/2 bg-green-500/30 origin-top -translate-x-1/2 rotate-25" />
        <div className="absolute top-1/2 left-1/2 w-px h-1/2 bg-green-500/30 origin-top -translate-x-1/2 rotate-45" />

        {/* Arcos concéntricos (Grid) */}
        <div className="absolute top-1/2 left-1/2 w-3/4 h-3/4 border border-dashed border-green-500/30 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-1/2 left-1/2 w-1/2 h-1/2 border border-dashed border-green-500/30 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-1/2 left-1/2 w-1/4 h-1/4 border border-dashed border-green-500/30 rounded-full -translate-x-1/2 -translate-y-1/2" />

        {/* Onda de Eco Expansiva */}
        <div
          ref={waveElRef}
          className="absolute top-1/2 left-1/2 rounded-full border-[3px] border-green-400 -translate-x-1/2 -translate-y-1/2 pointer-events-none mix-blend-screen shadow-[0_0_20px_rgba(34,197,94,0.6)]"
          style={{ width: '0%', height: '0%', opacity: 1 }}
        />

        {/* Onda secundaria (fantasma) para efecto visual */}
        <div
          ref={ghostWaveElRef}
          className="absolute top-1/2 left-1/2 rounded-full border border-green-500/50 -translate-x-1/2 -translate-y-1/2 pointer-events-none mix-blend-screen"
          style={{ width: '0%', height: '0%', opacity: 0 }}
        />

        {/* Objetivos */}
        {targets.map((target, index) => {
          if (index > currentTargetIndex) return null;

          const isActive = index === currentTargetIndex;
          const isCalibrated = index < currentTargetIndex;

          // Posición relativa al centro (50%, 50%)
          // Distance está en % del maxRadius. maxRadius es el 50% del container.
          // Entonces 100 de distance = 50% de left/top.
          const angleRad = target.angle * (Math.PI / 180);
          const left = 50 + ((target.distance / 100) * 50 * Math.sin(angleRad));
          const top = 50 - ((target.distance / 100) * 50 * Math.cos(angleRad));

          return (
            <div
              key={index}
              className={`absolute w-12 h-12 -ml-6 -mt-6 rounded-full border-2 transition-all duration-300 flex items-center justify-center
                ${isActive ? 'border-green-400 shadow-[0_0_15px_rgba(74,222,128,0.8)] animate-pulse' : ''}
                ${isCalibrated ? 'border-green-700 bg-green-500/40 scale-75' : ''}
              `}
              style={{ left: `${left}%`, top: `${top}%` }}
            >
              {isActive && (
                <div className="w-2 h-2 bg-green-300 rounded-full animate-ping" />
              )}
              {isCalibrated && (
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              )}
            </div>
          );
        })}
      </div>

      {/* Vértice Inferior (Glow) */}
      <div className="absolute bottom-[25%] left-1/2 w-32 h-32 bg-green-500/20 rounded-full blur-xl -translate-x-1/2 translate-y-1/2 pointer-events-none" />

      {/* HUD Info (Estilo Motion Tracker) */}
      <div className="absolute bottom-8 right-8 text-green-500 pointer-events-none text-right font-bold text-xl tracking-widest leading-relaxed">
        <div className="text-shadow-glow-green mb-2 opacity-80">ATT</div>
        <div className="text-shadow-glow-green mb-2 opacity-80">SUS</div>
        <div className="text-shadow-glow-green opacity-80">DEC</div>
      </div>

      <div className="absolute bottom-8 left-8 text-green-500 pointer-events-none font-bold text-xl">
        <div className="flex items-center gap-4 mb-2">
          <div className="px-4 py-1 border-2 border-green-500 bg-green-900/30">
            {currentTargetIndex}
          </div>
          <span className="opacity-60 text-sm">TARGETS</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-4 py-1 border-2 border-green-500 bg-green-900/30">
            {failures}
          </div>
          <span className="opacity-60 text-sm">ERRORS</span>
        </div>
      </div>

      {/* HUD Instrucciones */}
      <div className="absolute top-12 w-full text-center pointer-events-none text-green-400/90 tracking-[0.2em] font-bold text-lg">
        MOTION TRACKER
        <div className="text-xs font-normal opacity-70 mt-2 tracking-normal">
          CLIC EN EL OBJETIVO CUANDO LA ONDA DE ECO LO ALCANCE
        </div>
      </div>
    </div>
  );
};

export default RadarMinigame;
