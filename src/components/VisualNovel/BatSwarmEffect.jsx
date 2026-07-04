import React, { useState, useEffect } from 'react';

const BatSwarmEffect = () => {
  const [bats, setBats] = useState([]);

  useEffect(() => {
    // Función para generar un número aleatorio
    const random = (min, max) => Math.random() * (max - min) + min;

    // Generar murciélagos
    const generateBats = () => {
      const numBats = Math.floor(random(7, 11)); // 7 a 10 murciélagos
      const newBats = [];

      for (let i = 0; i < numBats; i++) {
        newBats.push({
          id: i,
          x: random(0, 100), // % de posición horizontal
          y: random(0, 100), // % de posición vertical
          scale: random(0.5, 1.5),
          rotation: random(-30, 30),
          flip: Math.random() > 0.5 ? 1 : -1,
          animationDuration: random(0.5, 1.5),
        });
      }
      setBats(newBats);
    };

    generateBats(); // Generar inicialmente

    // Re-generar cada 1 segundo (como solicitó el usuario)
    const interval = setInterval(() => {
      generateBats();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-[150] overflow-hidden">
      {bats.map((bat) => (
        <img
          key={bat.id}
          src={`${import.meta.env.BASE_URL}sprites/murcielago.png`}
          alt="murcielago"
          className="absolute w-32 h-auto opacity-0 bat-flutter-animation"
          style={{
            left: `${bat.x}%`,
            top: `${bat.y}%`,
            transform: `scale(${bat.scale}) rotate(${bat.rotation}deg) scaleX(${bat.flip})`,
            animation: `bat-fade-move ${bat.animationDuration}s ease-in-out infinite alternate`,
          }}
        />
      ))}
    </div>
  );
};

export default BatSwarmEffect;
