// src/hooks/useVisualNovelEngine.js
import { useMemo } from 'react';
import { useGameState } from '../context/GameStateContext';
import gameScript from '../game/script';

export const useVisualNovelEngine = () => {
  const { gameState, advanceDialogue, goToScene, updateStat } = useGameState();

  const currentScene = useMemo(() => {
    return gameScript[gameState.currentChapter]?.escenas?.[gameState.currentSceneId];
  }, [gameState.currentChapter, gameState.currentSceneId]);

  const currentLine = useMemo(() => {
    if (!currentScene || currentScene.type === 'choice') return null;
    return currentScene.dialogos?.[gameState.dialogueIndex];
  }, [currentScene, gameState.dialogueIndex]);

  const isChoice = currentScene?.type === 'choice';
  const isEndOfScene = !isChoice && gameState.dialogueIndex >= (currentScene?.dialogos?.length || 0);

  const advance = () => {
    if (isChoice) return; // No se puede avanzar en una elección

    const dialogueLength = currentScene?.dialogos?.length || 0;

    // Si estamos en el último diálogo o ya al final, transicionamos inmediatamente
    if (isEndOfScene || gameState.dialogueIndex >= dialogueLength - 1) {
      if (currentScene.next) {
        goToScene(currentScene.next);
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
    goToScene(choice.next);
  };

  return {
    currentScene,
    currentLine,
    isChoice,
    isEndOfScene,
    advance,
    makeChoice,
  };
};