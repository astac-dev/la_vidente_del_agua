/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  textSpeed: 1, // 1: maquina, 2: 2 pal/seg, 3: 5 pal/seg, 4: instant
  unlockedNodes: ['cap_0'],
  soloJuegoRapido: false,
  lastUpdated: 0,
};

// Nuevo: Estado inicial de la partida
const initialGameState = {
  currentChapter: 'capitulo_0',
  currentSceneId: 'guia_naia',
  dialogueIndex: 0,
  isModoExposicion: false,
  stats: {
    preservacion: 0,
    confianza: 0,
  },
  inventory: [],
  dialogueHistory: [],
};

/**
 * Proveedor de contexto para el estado global del juego.
 * Mantiene la reactividad del progreso, configuración del usuario y sincronización bidireccional
 * local/nube (Firestore) para garantizar la coherencia de partidas y rendimiento offline.
 */
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
      Promise.resolve().then(() => {
        setIsLoading(false);
      });
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          // El usuario ha iniciado sesión, intentar cargar desde Firestore
          const docRef = doc(db, 'usuarios_progreso', currentUser.uid);
          const docSnap = await getDoc(docRef);

          // Obtener configuración y partidas locales actuales para realizar la sincronización
          let localSettings = defaultSettings;
          try {
            const storedSettings = localStorage.getItem('vidente_agua_settings');
            if (storedSettings) {
              localSettings = JSON.parse(storedSettings);
            }
          } catch (e) {
            console.error("Error al analizar vidente_agua_settings de localStorage:", e);
          }

          let localSaves = [null, null, null];
          try {
            const storedSaves = localStorage.getItem('vidente_agua_saves');
            if (storedSaves) {
              localSaves = JSON.parse(storedSaves);
            }
          } catch (e) {
            console.error("Error al analizar vidente_agua_saves de localStorage:", e);
          }

          if (docSnap.exists()) {
            // Existe un guardado en la nube, sincronizamos bidireccionalmente
            const data = docSnap.data();
            const cloudSettings = data.settings || {
              idioma: data.idioma,
              volumenMusica: data.volumenMusica,
              volumenEfectos: data.volumenEfectos,
              tamanoLetra: data.tamanoLetra,
              textSpeed: data.textSpeed || 1,
              soloJuegoRapido: data.soloJuegoRapido || false,
              unlockedNodes: data.unlockedNodes || ['cap_0'],
              lastUpdated: data.lastUpdated || 0,
            };
            const cloudSaves = data.saves || [null, null, null];

            // Sincronizar ranuras de guardado por timestamp más reciente
            const syncedSaves = [null, null, null];
            for (let i = 0; i < 3; i++) {
              const localSave = localSaves[i];
              const cloudSave = cloudSaves[i];

              if (localSave && cloudSave) {
                if (localSave.timestamp >= cloudSave.timestamp) {
                  syncedSaves[i] = localSave;
                } else {
                  syncedSaves[i] = cloudSave;
                }
              } else if (localSave) {
                syncedSaves[i] = localSave;
              } else if (cloudSave) {
                syncedSaves[i] = cloudSave;
              } else {
                syncedSaves[i] = null;
              }
            }

            // Sincronizar configuraciones tomando la más reciente y combinando unlockedNodes
            const localTime = localSettings.lastUpdated || 0;
            const cloudTime = cloudSettings.lastUpdated || 0;

            const baseSettings = localTime >= cloudTime ? localSettings : cloudSettings;
            const syncedUnlocked = Array.from(new Set([
              ...(localSettings.unlockedNodes || ['cap_0']),
              ...(cloudSettings.unlockedNodes || ['cap_0'])
            ]));

            const syncedSettings = {
              ...defaultSettings,
              ...baseSettings,
              unlockedNodes: syncedUnlocked,
              lastUpdated: Math.max(localTime, cloudTime, Date.now())
            };

            setSettings(syncedSettings);
            setSaves(syncedSaves);

            // Guardar el estado sincronizado de inmediato en ambos lados
            localStorage.setItem('vidente_agua_settings', JSON.stringify(syncedSettings));
            localStorage.setItem('vidente_agua_saves', JSON.stringify(syncedSaves));
            await setDoc(docRef, { settings: syncedSettings, saves: syncedSaves });
          } else {
            // No existe un documento en la nube para este usuario, inicializamos la nube con sus datos locales
            const initialSettingsForCloud = {
              ...localSettings,
              lastUpdated: localSettings.lastUpdated || Date.now()
            };
            setSettings(initialSettingsForCloud);
            setSaves(localSaves);

            localStorage.setItem('vidente_agua_settings', JSON.stringify(initialSettingsForCloud));
            localStorage.setItem('vidente_agua_saves', JSON.stringify(localSaves));
            await setDoc(docRef, { settings: initialSettingsForCloud, saves: localSaves });
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
      // Guardar siempre en localStorage como caché local / soporte offline
      try {
        localStorage.setItem('vidente_agua_settings', JSON.stringify(settings));
        localStorage.setItem('vidente_agua_saves', JSON.stringify(saves));
      } catch (error) {
        console.error("Error al guardar la configuración en localStorage:", error);
      }

      // Si Firebase está configurado y el usuario está conectado, guardar también en Firestore (nube)
      if (auth && user) {
        try {
          await setDoc(doc(db, 'usuarios_progreso', user.uid), { settings, saves });
        } catch (error) {
          console.error("Error al guardar en Firestore:", error);
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
    setSettings(prevSettings => ({
      ...prevSettings,
      [key]: value,
      lastUpdated: Date.now()
    }));
  };

  const unlockNode = (nodeId) => {
    setSettings(prev => {
      const currentUnlocked = prev.unlockedNodes || ['cap_0'];
      if (currentUnlocked.includes(nodeId)) return prev;
      return {
        ...prev,
        unlockedNodes: [...currentUnlocked, nodeId],
        lastUpdated: Date.now()
      };
    });
  };

  const toggleUiVisibility = () => {
    setUiVisibility(prev => !prev);
  };

  // --- Funciones para controlar el estado de la partida ---

  const goToScene = (sceneId, chapterId, dialogueIndex = 0) => {
    setIsFading(true);
    setTimeout(() => {
      setGameState(prev => {
        const targetChapter = chapterId || prev.currentChapter;
        
        // Auto-unlock logic
        unlockNode('cap_0');
        if (targetChapter === 'capitulo_1') {
          unlockNode('cap_1_intro');
        }
        if (sceneId === 'escena_1_7_ruta_a' || sceneId === 'escena_1_7_ruta_a_fin') {
          unlockNode('ruta_a_negligencia');
        } else if (sceneId === 'escena_1_7_ruta_b') {
          unlockNode('ruta_b_investigacion');
        }
        
        return {
          ...prev,
          currentChapter: targetChapter,
          currentSceneId: sceneId,
          dialogueIndex: dialogueIndex,
        };
      });
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

  const addToHistory = useCallback((entry) => {
    setGameState(prev => {
      const history = prev.dialogueHistory || [];
      const lastItem = history[history.length - 1];

      const isDuplicate = lastItem && 
        lastItem.chapter === entry.chapter &&
        lastItem.sceneId === entry.sceneId &&
        lastItem.dialogueIndex === entry.dialogueIndex;

      if (isDuplicate) return prev;

      return {
        ...prev,
        dialogueHistory: [...history, entry],
      };
    });
  }, []);

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
      
      // Auto-unlock nodes based on the loaded save's state
      const targetChapter = save.gameState.currentChapter;
      const sceneId = save.gameState.currentSceneId;
      unlockNode('cap_0');
      if (targetChapter === 'capitulo_1') {
        unlockNode('cap_1_intro');
      }
      if (sceneId === 'escena_1_7_ruta_a' || sceneId === 'escena_1_7_ruta_a_fin') {
        unlockNode('ruta_a_negligencia');
      } else if (sceneId === 'escena_1_7_ruta_b') {
        unlockNode('ruta_b_investigacion');
      }
      
      return true;
    }
    return false;
  };

  const resetGameState = (overrides = {}) => {
    setGameState({ ...initialGameState, ...overrides });
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
    addToHistory,
    updateStat,
    uiVisibility,
    toggleUiVisibility,
    saves,
    saveGameToSlot,
    loadGameFromSlot,
    resetGameState,
    isFading,
    unlockedNodes: settings.unlockedNodes || ['cap_0'],
    unlockNode,
  };

  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  );
};

/**
 * Hook personalizado para acceder al contexto global de la partida.
 * Se expone para abstraer la dependencia directa de useContext y centralizar
 * el manejo de errores ante un uso fuera del proveedor correspondiente.
 */
export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (context === undefined) {
    throw new Error('useGameState debe ser usado dentro de un GameStateProvider');
  }
  return context;
};