/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import i18n from '../i18n'; // Importar la instancia de i18n
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { StorageService } from '../services/storageService';

const GameStateContext = createContext();

const defaultSettings = {
  idioma: 'es',
  volumenMusica: 80,
  volumenEfectos: 100,
  tamanoLetra: 100, // Representa el 100% del tamaño base
  textSpeed: 1, // 1: maquina, 2: 2 pal/seg, 3: 5 pal/seg, 4: instant
  unlockedNodes: ['cap_0'],
  juegoCompleto: false,
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
    estres: 0,
  },
  inventory: [],
  dialogueHistory: [],
  activeBackground: null,
  activeBgm: null,
  activeSfx: null,
};

/**
 * Proveedor de contexto para el estado global del juego.
 * Mantiene la reactividad del progreso, configuración del usuario y sincronización bidireccional
 * local/nube (Firestore) para garantizar la coherencia de partidas y rendimiento offline.
 */
export const GameStateProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => StorageService.getLocalSettings(defaultSettings));

  // Nuevo: Estado para el progreso de la partida
  const [gameState, setGameState] = useState(initialGameState);

  // Nuevo: Estado para las 3 ranuras de guardado (semi-automático)
  const [saves, setSaves] = useState(() => StorageService.getLocalSaves());

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
          // El usuario ha iniciado sesión, sincronizar con la nube
          const localSettings = StorageService.getLocalSettings(defaultSettings);
          const localSaves = StorageService.getLocalSaves();
          
          const syncedData = await StorageService.syncWithCloud(currentUser, localSettings, localSaves, defaultSettings);
          
          setSettings(syncedData.settings);
          setSaves(syncedData.saves);
        } else {
          // El usuario ha cerrado sesión, volver a localStorage
          setSettings(StorageService.getLocalSettings(defaultSettings));
          setSaves(StorageService.getLocalSaves());
        }
        setUser(currentUser);
      } catch (error) {
        console.error("Error durante onAuthStateChanged:", error);
        // En caso de error, volvemos a la configuración local por seguridad
        setSettings(StorageService.getLocalSettings(defaultSettings));
        setSaves(StorageService.getLocalSaves());
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

    StorageService.saveLocal(settings, saves);
    StorageService.saveToCloud(user, settings, saves);

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
        if (targetChapter === 'capitulo_1_1') {
          unlockNode('cap_1_intro');
        }
        if (sceneId === 'escena_1_7_ruta_a' || sceneId === 'escena_1_7_ruta_a_fin') {
          unlockNode('ruta_a_negligencia');
        } else if (sceneId === 'escena_1_7_ruta_b') {
          unlockNode('ruta_b_investigacion');
        }
        
        return {
          ...prev,
          previousSceneId: prev.currentSceneId,
          previousChapterId: prev.currentChapter,
          previousDialogueIndex: prev.dialogueIndex,
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

  const updateInventory = (operation, itemPayload) => {
    setGameState(prev => {
      const inventory = prev.inventory ? [...prev.inventory] : [];
      
      if (operation === 'add') {
        const existingItemIndex = inventory.findIndex(i => i.id === itemPayload.id);
        if (existingItemIndex >= 0) {
          const item = { ...inventory[existingItemIndex] };
          if (item.count !== -1) {
            item.count = (item.count || 0) + (itemPayload.count || 1);
          }
          inventory[existingItemIndex] = item;
        } else {
          inventory.push({
             ...itemPayload, 
             count: itemPayload.count !== undefined ? itemPayload.count : 1,
             maxDurability: itemPayload.maxDurability || itemPayload.count || 1
          });
        }
      } else if (operation === 'use' || operation === 'remove') {
        const existingItemIndex = inventory.findIndex(i => i.id === itemPayload.id);
        if (existingItemIndex >= 0) {
          const item = { ...inventory[existingItemIndex] };
          if (item.count !== -1) {
            item.count -= (itemPayload.count || 1);
            if (item.count <= 0) {
              item.count = 0;
              if (!item.keepAtZero) {
                inventory.splice(existingItemIndex, 1);
              } else {
                inventory[existingItemIndex] = item;
              }
            } else {
              inventory[existingItemIndex] = item;
            }
          }
        }
      }
      
      return {
        ...prev,
        inventory
      };
    });
  };

  const unlockBackground = (bgSrc) => {
    if (!bgSrc) return;
    setGameState(prev => {
      const bgs = prev.unlockedBackgrounds || [];
      if (bgs.includes(bgSrc)) return prev;
      return { ...prev, unlockedBackgrounds: [...bgs, bgSrc] };
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

  const deleteSaveSlot = (slotIndex) => {
    setSaves(prevSaves => {
      const newSaves = [...prevSaves];
      newSaves[slotIndex] = null;
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
      if (targetChapter === 'capitulo_1_1') {
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

  const setActiveVisuals = useCallback((background, bgm, sfx) => {
    setGameState(prev => {
      let updated = false;
      const next = { ...prev };
      
      if (background !== undefined) {
        if (background === null) {
          if (prev.activeBackground !== null) {
            next.activeBackground = null;
            updated = true;
          }
        } else if (!prev.activeBackground || prev.activeBackground.src !== background.src || prev.activeBackground.effect !== background.effect) {
          next.activeBackground = background;
          updated = true;
        }
      }

      if (bgm !== undefined) {
        if (bgm === null) {
          if (prev.activeBgm !== null) {
            next.activeBgm = null;
            updated = true;
          }
        } else if (!prev.activeBgm || prev.activeBgm.src !== bgm.src || prev.activeBgm.action !== bgm.action) {
          next.activeBgm = bgm;
          updated = true;
        }
      }

      if (sfx !== undefined) {
        if (sfx === null) {
          if (prev.activeSfx !== null) {
            next.activeSfx = null;
            updated = true;
          }
        } else if (!prev.activeSfx || prev.activeSfx.src !== sfx.src || prev.activeSfx.action !== sfx.action) {
          next.activeSfx = sfx;
          updated = true;
        }
      }

      return updated ? next : prev;
    });
  }, []);

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
    updateInventory,
    unlockBackground,
    uiVisibility,
    toggleUiVisibility,
    saves,
    saveGameToSlot,
    loadGameFromSlot,
    deleteSaveSlot,
    resetGameState,
    setActiveVisuals,
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