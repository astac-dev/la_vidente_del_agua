// src/hooks/useVisualNovelEngine.js
import { useMemo, useEffect } from 'react';
import { useGameState } from '../context/GameStateContext';

/**
 * Helper para enrutar transiciones de capítulos y escenas de forma dinámica.
 * Se implementa para evitar acoplamiento estático de rutas y permitir
 * transiciones fluidas entre archivos JSON de capítulos independientes.
 * 
 * @param {string} nextTarget - Identificador de la siguiente escena (ej. "capitulo_1_intro").
 * @returns {object} Objeto con sceneId y chapterId resueltos.
 */
const routeTransition = (nextTarget) => {
  if (nextTarget && nextTarget.startsWith('capitulo_')) {
    const match = nextTarget.match(/^capitulo_(\d+)_(.+)$/);
    if (match) {
      const chapterNum = match[1];
      const sceneName = match[2] === 'intro' ? 'escena_intro' : match[2];
      return { sceneId: sceneName, chapterId: `capitulo_${chapterNum}` };
    }
  }
  return { sceneId: nextTarget, chapterId: null };
};

/**
 * Hook personalizado para manejar el flujo y la navegación dentro de la novela visual.
 * Se separa del componente visual principal para centralizar el cálculo del estado
 * actual de diálogos, elecciones y avance de la trama.
 * 
 * @param {object} scriptData - Los datos del capítulo actual cargados dinámicamente.
 */
export const useVisualNovelEngine = (scriptData) => {
  const { gameState, advanceDialogue, goToScene, updateStat } = useGameState();

  const currentScene = useMemo(() => {
    return scriptData?.escenas?.[gameState.currentSceneId];
  }, [scriptData, gameState.currentSceneId]);

  const currentLine = useMemo(() => {
    if (!currentScene || currentScene.type === 'choice') return null;
    return currentScene.dialogos?.[gameState.dialogueIndex];
  }, [currentScene, gameState.dialogueIndex]);

  const isChoice = currentScene?.type === 'choice';
  const isEndOfScene = !isChoice && gameState.dialogueIndex >= (currentScene?.dialogos?.length || 0);

  useEffect(() => {
    if (currentScene?.type === 'logic_check') {
      const propertyValue = gameState[currentScene.property];
      const nextTarget = propertyValue ? currentScene.ifTrue : currentScene.ifFalse;
      const { sceneId, chapterId } = routeTransition(nextTarget);
      goToScene(sceneId, chapterId);
    }
  }, [currentScene, gameState, goToScene]);

  const advance = () => {
    if (isChoice) return; // Las elecciones requieren interacción explícita del usuario

    const dialogueLength = currentScene?.dialogos?.length || 0;

    // Se realiza la transición si no quedan más líneas en la escena actual
    if (isEndOfScene || gameState.dialogueIndex >= dialogueLength - 1) {
      if (currentScene.next) {
        const { sceneId, chapterId } = routeTransition(currentScene.next);
        goToScene(sceneId, chapterId);
      } else {
        console.log("Fin de la rama de la historia.");
        if (!isEndOfScene) {
          advanceDialogue();
        }
      }
    } else {
      advanceDialogue();
    }
  };

  const makeChoice = (choice) => {
    if (!isChoice) return;
    if (choice.action) {
      updateStat(choice.action.stat, choice.action.op, choice.action.value);
    }
    const { sceneId, chapterId } = routeTransition(choice.next);
    goToScene(sceneId, chapterId);
  };

  /**
   * Navega de forma acelerada por el grafo de escenas en memoria para
   * encontrar el siguiente nodo de decisión ('choice').
   * Se diseña para evitar llamadas repetidas al despachador de transiciones,
   * reduciendo el coste de renderizado y eludiendo múltiples fundidos
   * visuales seguidos. Si detecta un cambio de capítulo, delega la carga
   * asíncrona deteniéndose al inicio del nuevo archivo de guion.
   */
  const skipToNextChoice = () => {
    if (!scriptData || isChoice) return;

    let sceneId = gameState.currentSceneId;
    const chapterId = gameState.currentChapter;

    while (sceneId) {
      const scene = scriptData.escenas?.[sceneId];
      if (!scene) {
        break;
      }

      // Detiene el salto si es una escena de elección interactiva
      if (scene.type === 'choice') {
        goToScene(sceneId, chapterId, 0);
        return;
      }

      const nextTarget = scene.next;
      if (!nextTarget) {
        break;
      }

      // Detiene el salto si la ruta retorna al menú de inicio del juego
      if (nextTarget === 'mainMenu') {
        const dialogos = scene.dialogos || [];
        goToScene(sceneId, chapterId, dialogos.length > 0 ? dialogos.length - 1 : 0);
        return;
      }

      // Detiene el salto en la frontera del capítulo para permitir importación dinámica
      if (nextTarget.startsWith('capitulo_')) {
        const { sceneId: targetSceneId, chapterId: targetChapterId } = routeTransition(nextTarget);
        goToScene(targetSceneId, targetChapterId, 0);
        return;
      } else {
        sceneId = nextTarget;
      }
    }

    // Si finalizó el recorrido sin encontrar elecciones, se sitúa al final de la escena actual
    if (sceneId) {
      const scene = scriptData.escenas?.[sceneId];
      const dialogos = scene?.dialogos || [];
      goToScene(sceneId, chapterId, dialogos.length > 0 ? dialogos.length - 1 : 0);
    }
  };

  const cancelChoice = () => {
    if (!isChoice) return;
    const history = gameState.dialogueHistory || [];
    if (history.length > 0) {
      const lastDialogue = history[history.length - 1];
      goToScene(lastDialogue.sceneId, lastDialogue.chapter, lastDialogue.dialogueIndex);
    }
  };

  return {
    currentScene,
    currentLine,
    isChoice,
    isEndOfScene,
    advance,
    makeChoice,
    skipToNextChoice,
    cancelChoice,
  };
};