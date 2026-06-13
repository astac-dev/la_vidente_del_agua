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
  currentChapter: 'capitulo_0',
  currentSceneId: 'guia_naia',
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

  // Nuevo: Estado para las 3 ranuras de guardado (semi-automático)
  const [saves, setSaves] = useState(() => {
    try {
      const storedSaves = localStorage.getItem('vidente_agua_saves');
      return storedSaves ? JSON.parse(storedSaves) : [null, null, null];
    } catch (error) {
      console.error("Error al leer las partidas de localStorage:", error);
      return [null, null, null];
    }
  });

  // Nuevo: Estado para la visibilidad de la UI
  const [uiVisibility, setUiVisibility] = useState(true);
  
  // Nuevo: Estado para transiciones suaves de escena (fade)
  const [isFading, setIsFading] = useState(false);

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
            const data = docSnap.data();
            const cloudSettings = data.settings || {
              idioma: data.idioma,
              volumenMusica: data.volumenMusica,
              volumenEfectos: data.volumenEfectos,
              tamanoLetra: data.tamanoLetra,
              autoPlaySpeed: data.autoPlaySpeed
            };
            setSettings({ ...defaultSettings, ...cloudSettings });
            if (data.saves) {
              setSaves(data.saves);
            }
          }
        } else {
          // El usuario ha cerrado sesión, volver a localStorage
          const storedSettings = localStorage.getItem('vidente_agua_settings');
          setSettings(storedSettings ? JSON.parse(storedSettings) : defaultSettings);
          const storedSaves = localStorage.getItem('vidente_agua_saves');
          setSaves(storedSaves ? JSON.parse(storedSaves) : [null, null, null]);
        }
        setUser(currentUser);
      } catch (error) {
        console.error("Error durante onAuthStateChanged:", error);
        // En caso de error, volvemos a la configuración local por seguridad
        const storedSettings = localStorage.getItem('vidente_agua_settings');
        setSettings(storedSettings ? JSON.parse(storedSettings) : defaultSettings);
        const storedSaves = localStorage.getItem('vidente_agua_saves');
        setSaves(storedSaves ? JSON.parse(storedSaves) : [null, null, null]);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe && unsubscribe(); // Limpiar el listener al desmontar
  }, []); // Se ejecuta solo una vez

  // Efecto para persistir las configuraciones y las partidas guardadas
  useEffect(() => {
    // No ejecutar la lógica de persistencia hasta que la comprobación de autenticación inicial esté completa
    if (isLoading) return;

    const persistData = async () => {
      // Solo guardar en Firestore si Firebase está configurado y el usuario está conectado
      if (auth && user) {
        // El usuario está conectado, guardar en Firestore
        try {
          await setDoc(doc(db, 'usuarios_progreso', user.uid), { settings, saves });
        } catch (error) {
          console.error("Error al guardar en Firestore:", error);
        }
      } else {
        // De lo contrario, guardar en localStorage
        try {
          localStorage.setItem('vidente_agua_settings', JSON.stringify(settings));
          localStorage.setItem('vidente_agua_saves', JSON.stringify(saves));
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
  }, [settings, saves, user, isLoading]);

  const updateSetting = (key, value) => {
    setSettings(prevSettings => ({ ...prevSettings, [key]: value }));
  };

  const toggleUiVisibility = () => {
    setUiVisibility(prev => !prev);
  };

  // --- Funciones para controlar el estado de la partida ---

  const goToScene = (sceneId, chapterId, dialogueIndex = 0) => {
    setIsFading(true);
    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        currentChapter: chapterId || prev.currentChapter,
        currentSceneId: sceneId,
        dialogueIndex: dialogueIndex,
      }));
      setTimeout(() => {
        setIsFading(false);
      }, 100);
    }, 400);
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

  const saveGameToSlot = (slotIndex) => {
    setSaves(prevSaves => {
      const newSaves = [...prevSaves];
      newSaves[slotIndex] = {
        gameState: { ...gameState },
        timestamp: Date.now(),
        chapterId: gameState.currentChapter,
        sceneId: gameState.currentSceneId,
        dialogueIndex: gameState.dialogueIndex,
      };
      return newSaves;
    });
  };

  const loadGameFromSlot = (slotIndex) => {
    const save = saves[slotIndex];
    if (save && save.gameState) {
      setGameState({ ...save.gameState });
      return true;
    }
    return false;
  };

  const resetGameState = () => {
    setGameState(initialGameState);
  };

  // --- Valor del contexto ---

  const value = {
    settings,
    updateSetting,
    user,
    isLoading,
    setUser,
    gameState,
    goToScene,
    advanceDialogue,
    updateStat,
    uiVisibility,
    toggleUiVisibility,
    saves,
    saveGameToSlot,
    loadGameFromSlot,
    resetGameState,
    isFading,
  };

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