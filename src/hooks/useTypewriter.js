// src/hooks/useTypewriter.js
import { useState, useEffect } from 'react';

export const useTypewriter = (text, speed = 40) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (text) {
      if (speed === 0) {
        setDisplayedText(text);
        setIsTyping(false);
        return;
      }

      let i = 0;
      setDisplayedText(''); // Limpiar al recibir nuevo texto
      setIsTyping(true);
      const intervalId = setInterval(() => {
        if (i < text.length) {
          setDisplayedText(text.slice(0, i + 1));
          i++;
        } else {
          setIsTyping(false);
          clearInterval(intervalId);
        }
      }, speed);

      return () => {
        setIsTyping(false);
        clearInterval(intervalId);
      };
    } else {
      setIsTyping(false);
    }
  }, [text, speed]);

  return { displayedText, isTyping };
};