import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGameState } from '../context/GameStateContext';
import mapData from '../data/mapData.json';
import mapaFondo from '../assets/arte/mapa_novela.png';
import './StoryMap.css';

/**
 * Componente StoryMap (Mapa de Rutas)
 * Renderiza el árbol bioluminiscente del progreso del jugador utilizando
 * curvas Bezier SVG y miniaturas circulares interactivas.
 */
const StoryMap = ({ onBack, onNavigate }) => {
  const { t } = useTranslation();
  const { unlockedNodes, goToScene, settings } = useGameState();

  const handleNodeClick = (node) => {
    if (!unlockedNodes.includes(node.id)) return;
    goToScene(node.sceneId, node.chapterId, 0);
    onNavigate('visualNovel');
  };

  // Helper para renderizar los caminos (raíces) en el SVG
  const renderConnection = (sourceId, targetId, customCurve) => {
    const sourceNode = mapData.nodes[sourceId];
    const targetNode = mapData.nodes[targetId];
    if (!sourceNode || !targetNode) return null;

    const isPathUnlocked = unlockedNodes.includes(sourceId) && unlockedNodes.includes(targetId);

    // Si no tiene una curva Bezier explícita, trazamos una línea directa o una curva por defecto
    const pathD = customCurve || `M ${sourceNode.x} ${sourceNode.y} L ${targetNode.x} ${targetNode.y}`;
    const strokeColor = isPathUnlocked ? targetNode.glowColor : '#222222';
    const strokeWidth = isPathUnlocked ? '2.5' : '1.5';
    const filterGlow = isPathUnlocked ? 'url(#glow-filter)' : 'none';
    const strokeDasharray = isPathUnlocked ? 'none' : '4,4';
    const opacity = isPathUnlocked ? '1' : '0.2';

    return (
      <path
        key={`${sourceId}-${targetId}`}
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDasharray}
        filter={filterGlow}
        style={{
          transition: 'all 1s ease-out',
          opacity
        }}
      />
    );
  };

  return (
    <div className="story-map-screen w-full h-screen bg-black flex items-center justify-center overflow-hidden">
      
      <div 
        className="story-map-wrapper relative w-full max-w-[177.78vh] aspect-video max-h-screen overflow-hidden bg-neutral-950 shadow-2xl"
        style={{ '--ui-scale-multiplier': `${(settings?.tamanoLetra || 100) / 100}` }}
      >
        
        {/* Imagen de Fondo de Pintura Rupestre */}
        <img
          src={mapaFondo}
          alt="Fondo Pintura Rupestre"
          className="w-full h-full object-cover pointer-events-none select-none opacity-85"
        />

        {/* Encabezado Absoluto (Glassmorphic) */}
        <header className="story-map-header absolute top-0 left-0 right-0 py-3 px-4 flex justify-between items-center z-30 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
          <h2 className="story-map-title font-sans tracking-wide text-xs md:text-sm font-bold uppercase text-neutral-100 border-l-4 border-amber-500 pl-3">
            {t('menu.storyMapTitle', 'Mapa de Rutas de la Memoria')}
          </h2>
          <button
            onClick={onBack}
            className="story-map-back-btn px-3 py-1 border border-neutral-700 bg-neutral-900/60 hover:bg-neutral-800/80 hover:border-amber-400 text-neutral-300 text-[10px] font-mono font-bold uppercase tracking-widest rounded transition-all cursor-pointer pointer-events-auto"
          >
            {t('menu.back')}
          </button>
        </header>

        {/* Capa de Caminos SVG Absoluta */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Filtro de brillo bioluminiscente */}
            <filter id="glow-filter" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1" result="blur1" />
              <feGaussianBlur stdDeviation="3" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Dibujar raíces según las conexiones */}
          {Object.values(mapData.nodes).map((node) =>
            node.connections.map((targetId) => {
              // Si la conexión tiene una curva definida en el nodo destino, la usamos
              const targetNode = mapData.nodes[targetId];
              return renderConnection(node.id, targetId, targetNode?.curve);
            })
          )}
        </svg>

        {/* Capa de Nodos Absolutos */}
        <div className="absolute inset-0 w-full h-full z-20 pointer-events-none">
          {Object.values(mapData.nodes).map((node) => {
            const isUnlocked = unlockedNodes.includes(node.id);
            const nodeTitle = t(`menu.storyMapNodes.${node.id}`, node.title);
            const nodeAltText = isUnlocked ? nodeTitle : t('menu.nodeLocked', 'Bloqueado');
            
            return (
              <div
                key={node.id}
                className={`story-map-node-wrapper absolute ${isUnlocked ? 'node-unlocked pointer-events-auto' : 'node-locked pointer-events-none'}`}
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  transform: 'translate(-50%, -50%)',
                  transition: 'opacity 1s ease-out',
                  opacity: isUnlocked ? 1 : 0, // Bloqueado: 0% opacidad
                }}
              >
                <button
                  onClick={() => handleNodeClick(node)}
                  disabled={!isUnlocked}
                  className="story-map-node-btn relative flex items-center justify-center rounded-full overflow-hidden transition-all duration-300 shadow-lg pointer-events-auto"
                  style={{
                    borderColor: node.glowColor,
                    borderWidth: '2.5px',
                    borderStyle: 'solid',
                    boxShadow: isUnlocked ? `0 0 15px ${node.glowColor}` : 'none',
                  }}
                  title={nodeAltText}
                >
                  {/* Imagen de vista en miniatura recortada en círculo */}
                  <img
                    src={node.thumbnail}
                    alt={nodeAltText}
                    className="w-full h-full object-cover rounded-full select-none"
                  />

                  {/* Efecto de destello interior pulsante */}
                  <div
                    className="absolute inset-0 rounded-full animate-pulse opacity-25"
                    style={{ backgroundColor: node.glowColor }}
                  />
                </button>

                {/* Etiqueta flotante con el título del capítulo */}
                {isUnlocked && (
                  <div className="story-map-node-label absolute text-[9px] font-sans font-bold tracking-wider text-neutral-200 bg-black/75 border border-neutral-700/50 px-2 py-0.5 rounded whitespace-nowrap opacity-0 transition-opacity duration-200 pointer-events-none">
                    {nodeTitle}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Identificador del Sistema en la esquina inferior */}
        <div className="absolute bottom-2 right-4 text-[8px] font-mono tracking-widest text-neutral-500 z-30 pointer-events-none select-none">
          INAH-SAS // MEMORY_BIOCULTURAL_MAP_v0.3.6
        </div>

      </div>
    </div>
  );
};

export default StoryMap;
