import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from '../i18n'; // Importar la instancia de i18n
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const GameStateContext = createContext();

const defaultSettings = {
  idioma: 'es',
  volumenMusica: 80,
  volumenEfectos: 100,
  tamanoLetra: 100, // Representa el 100% del tamaño base
  autoPlaySpeed: 0, // 0: off, 1-4: speeds
};

// Nuevo: Estado inicial de la partida
const initialGameState = {
  currentChapter: 'capitulo_1',
  currentSceneId: 'escena_intro',
  dialogueIndex: 0,
  stats: {
    preservacion: 0,
    confianza: 0,
  },
  inventory: [],
};

export const GameStateProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    try {
      const storedSettings = localStorage.getItem('vidente_agua_settings');
      return storedSettings ? JSON.parse(storedSettings) : defaultSettings;
    } catch (error) {
      console.error("Error al leer la configuración de localStorage:", error);
      return defaultSettings;
    }
  });

  // Nuevo: Estado para el progreso de la partida
  const [gameState, setGameState] = useState(initialGameState);

  // Nuevo: Estado para la visibilidad de la UI
  const [uiVisibility, setUiVisibility] = useState(true);

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Para gestionar la comprobación inicial de autenticación

  // Efecto para manejar los cambios de estado de autenticación
  useEffect(() => {
    // Si Firebase no está configurado, simplemente usamos localStorage y terminamos.
    if (!auth) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          // El usuario ha iniciado sesión, intentar cargar desde Firestore
          const docRef = doc(db, 'usuarios_progreso', currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            // Existe un guardado en la nube, lo usamos.
            setSettings({ ...defaultSettings, ...docSnap.data() });
          }
          // Si no hay guardado en la nube, el estado actual (de localStorage) se usará
          // y se guardará en Firestore mediante el otro useEffect.
        } else {
          // El usuario ha cerrado sesión, volver a localStorage
          const storedSettings = localStorage.getItem('vidente_agua_settings');
          setSettings(storedSettings ? JSON.parse(storedSettings) : defaultSettings);
        }
        setUser(currentUser);
      } catch (error) {
        console.error("Error durante onAuthStateChanged:", error);
        // En caso de error, volvemos a la configuración local por seguridad
        const storedSettings = localStorage.getItem('vidente_agua_settings');
        setSettings(storedSettings ? JSON.parse(storedSettings) : defaultSettings);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe && unsubscribe(); // Limpiar el listener al desmontar
  }, []); // Se ejecuta solo una vez

  // Efecto para persistir las configuraciones
  useEffect(() => {
    // No ejecutar la lógica de persistencia hasta que la comprobación de autenticación inicial esté completa
    if (isLoading) return;

    const persistData = async () => {
      // Solo guardar en Firestore si Firebase está configurado y el usuario está conectado
      if (auth && user) {
        // El usuario está conectado, guardar en Firestore
        try {
          await setDoc(doc(db, 'usuarios_progreso', user.uid), settings);
        } catch (error) {
          console.error("Error al guardar en Firestore:", error);
        }
      } else {
        // De lo contrario, guardar en localStorage
        try {
          localStorage.setItem('vidente_agua_settings', JSON.stringify(settings));
        } catch (error) {
          console.error("Error al guardar la configuración en localStorage:", error);
        }
      }
    };
    persistData();

    // Sincronizar el idioma con i18n
    if (i18n.language !== settings.idioma) {
      i18n.changeLanguage(settings.idioma);
    }
  }, [settings, user, isLoading]);

  const updateSetting = (key, value) => {
    setSettings(prevSettings => ({ ...prevSettings, [key]: value }));
  };

  const toggleUiVisibility = () => {
    setUiVisibility(prev => !prev);
  };

  // --- Funciones para controlar el estado de la partida ---

  const goToScene = (sceneId, chapterId, dialogueIndex = 0) => {
    setGameState(prev => ({
      ...prev,
      currentChapter: chapterId || prev.currentChapter,
      currentSceneId: sceneId,
      dialogueIndex: dialogueIndex,
    }));
  };

  const advanceDialogue = () => {
    setGameState(prev => ({
      ...prev,
      dialogueIndex: prev.dialogueIndex + 1,
    }));
  };

  const updateStat = (stat, operation, value) => {
    setGameState(prev => {
      const oldValue = prev.stats[stat] || 0;
      const newValue = operation === 'add' ? oldValue + value : value;
      return {
        ...prev,
        stats: { ...prev.stats, [stat]: newValue },
      };
    });
  };

  // --- Valor del contexto ---

  const value = { settings, updateSetting, user, isLoading, setUser, gameState, goToScene, advanceDialogue, updateStat, uiVisibility, toggleUiVisibility };

  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  );
};

export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (context === undefined) {
    throw new Error('useGameState debe ser usado dentro de un GameStateProvider');
  }
  return context;
};