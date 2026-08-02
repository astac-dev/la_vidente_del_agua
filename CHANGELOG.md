# Historial de Cambios

## [0.3.32] - 2026-08-02

### Corregido
- **Fallas de Traducción en Maya Yucateco e Inglés**:
  - Se corrigió un error estructural (bloque `historia` duplicado al final del archivo) en los archivos `es/translation.json`, `en/translation.json` y `my/translation.json` que provocaba que la carga del idioma Maya Yucateco o Inglés borrara todas las traducciones de los capítulos principales debido al comportamiento de parseo del JSON, provocando que la novela cayera forzosamente al idioma español.
  - El juego ya arranca de forma nativa e inmersiva en Maya Yucateco para el texto expositivo de la nueva partida y en las transiciones temporales.
- **Nodos de Decisión**:
  - En `GameEngine.jsx`, se flexibilizó la búsqueda de traducciones para nodos de decisión (choices) introduciendo llaves de respaldo (fallbacks) que buscan directamente desde el objeto de la escena (ej. `escenas.escena_1.pregunta`), en vez de requerir forzosamente el anidamiento estricto en `.elecciones.`, alineándolo con la estructura de la traducción maya.
- **Traducción de Nombres de Personajes**:
  - En `DialogueBox.jsx`, se aseguró que las claves identificadoras de los personajes se conviertan a minúsculas (`.toLowerCase()`) antes de buscarse en `i18next`. Esto previene que la capitalización variable del guion evite encontrar la traducción oficial del diccionario (ej. mostrando "J-tsikbal" en maya).
- **Inventario Localizado**:
  - En `InventoryModal.jsx`, se vinculó el nombre (`name`) y descripción (`desc`) de los ítems con el sistema de `i18next` usando llaves unificadas (`items.ID.name`), permitiendo internacionalizar completamente el sistema de inventario de recursos.

## [0.3.31] - 2026-07-11

### Corregido
- **Compatibilidad de Nombres de Archivos para Itch.io**:
  - Se corrigió el problema de URLs truncadas (`404 Not Found`) en los recursos web de la plataforma itch.io debido a espacios y caracteres con tilde en los nombres de archivo.
  - Renombrados de forma masiva los fondos (`public/backgrounds`), pistas musicales (`public/bgm`) y recursos de arte (`public/arte`) usando notación `snake_case` y sin tildes.
  - Actualización de todas las referencias de recursos a lo largo de los guiones JSON (`capitulo_1_1.json`, etc.) y componentes de React (`loader.js`, `galleryData.json`).
- **Lógica de Empaquetado**:
  - Restauración del flujo original del script `package-itch.cjs` para delegar correctamente a `tar` la compresión mediante un directorio contextual (`-C dist .`), garantizando la jerarquía plana que demanda itch.io para la raíz de la novela (`index.html`).

### Añadido
- **Sala de Música (Music Room)**:
  - Creación del nuevo componente interactivo `MusicRoomMenu.jsx` a pantalla completa, accesible desde el menú de Extras.
  - Implementación de un reproductor de audio con sincronización reactiva al volumen global del usuario.
  - Generación de `bgmData.json` para definir las pistas musicales y vincularlas a sus nodos narrativos (ej. `signal_trace.mp3` vinculada a `cap_1_intro`).
- **Sistema de Desbloqueo de Contenidos (Extras)**:
  - Implementada lógica de progresión que oculta o deshabilita elementos de la Galería de Arte y Sala de Música si el usuario no ha alcanzado los nodos de la historia requeridos (`gameState.unlockedNodes`).
  - Los elementos bloqueados muestran el candado "???" y no permiten la apertura del Lightbox o la reproducción musical.
- **Sincronización Precisa de SFX**:
  - En `capitulo_1_1.json`, se migró el efecto de sonido de la rama crujiendo desde el nivel global del nodo al arreglo interno de `dialogos`. Esto asegura que el `bone-breaking.wav` se reproduzca en el momento exacto en que la línea narrativa se dibuja en pantalla, logrando una sincronización audiovisual inmersiva.

## [0.3.30] - 2026-07-07

### Añadido / Cambiado
- **Traducción y Sincronización de Diálogos**:
  - Traducción e inyección completa del `capitulo_1_1` al Inglés (en) y Maya Yucateco (my) en `translation.json`.
  - Mapeo preciso de llaves dinámicas (`historia.capitulo_1_1.escenas...`) procesadas por el `GameEngine`.
  - Soporte de cambio de idioma automático en pantallas informativas (`custom_message`), diálogos y elecciones (`choice`).
  - Sincronización estructurada ante eliminación o modificación de nodos de guion.

## [0.3.29] - 2026-07-07

### Añadido / Cambiado
- **Refactorización del Menú Principal**:
  - Inversión de la visibilidad de opciones del menú principal. Por defecto solo se muestra "Nueva partida", "Opciones" y "Salir".
  - Al activar el modo "Juego completo" desde el menú Opciones, se habilitan las demás opciones (Continuar, Extras, Créditos).
  - El botón "Nueva partida" ahora inicia la partida rápida (`capitulo_1_1` en modo exposición). Se ha dejado un botón oculto de "Nueva partida (Completa)" disponible al habilitar "Juego completo".
  - Se agregó soporte para eliminar los slots de guardado con confirmación modal visual en el `ContinueMenu.jsx`.

## [0.3.28] - 2026-07-06

### Cambiado
- **Velocidad de Texto en lugar de Modo Automático**:
  - Se removió la función de avance automático (Auto-Play). Ahora, independientemente de la velocidad de aparición, se debe presionar el botón para continuar con la novela visual.
  - El botón de velocidad de la interfaz (`TXT.SPD`) ahora controla directamente la velocidad de aparición del texto con 4 ritmos: x1 (efecto máquina de escribir), x2 (2 palabras/segundo), x3 (5 palabras/segundo) y x4 (texto de golpe, instantáneo).

## [0.3.27] - 2026-07-04

### Añadido
- **Minijuego "Motion Tracker"**:
  - Se rediseñó el componente `RadarMinigame.jsx` para adoptar la estética y mecánica de un radar de movimiento. Incluye una visualización de cono de 90° desde el vértice inferior (vía `clip-path`), ondas expansivas animadas y un sistema de validación rítmica basado en el radio de la onda.
- **Soporte de SFX por Diálogo**:
  - Se mejoró `GameEngine.jsx` para soportar la ejecución nativa de efectos de sonido a nivel de línea específica (`currentLine.sfx`), en lugar de limitar el audio al inicio de la escena.
  - Implementación del SFX de rama rota (`bone-breaking.wav`) en la línea de descubrimiento de Amaranta en `capitulo_1_1.json`.

### Cambiado
- **HUD Retráctil**:
  - El componente de estadísticas en pantalla (`HUD.jsx`) ahora es una pestaña compacta y dinámica. Por defecto se colapsa mostrando los valores abreviados ("C" y "P"), con la capacidad de expandirse para mostrar nombres completos mediante un botón lateral, evitando obstruir la escena. Se agregó la clase `.hud-panel-collapsed` para manejar transiciones de CSS limpias en `VisualNovelContainer.css`.

### Corregido
- **Escala de Texto en Pantallas Negras**:
  - Se corrigió un error visual en el componente `custom_message` (en `GameEngine.jsx`) donde la tipografía y el llamado a la acción del código QR no respondían a la configuración global de tamaño de texto del jugador. Ahora emplean estilos dinámicos que heredan de `--ui-scale-multiplier`.

## [0.3.26] - 2026-07-02

### Añadido
- **Efecto de Flash Blanco (Seguro para epilepsia)**:
  - Se eliminó el efecto de vibración ("wiggle") problemático y se reemplazó por un suave destello blanco (`white_flash`) de baja intensidad, configurado por debajo de la interfaz de usuario pero sobre los personajes. Integrado en `GameEngine.jsx` y `capitulo_1_1.json`.
- **Integración del Arqueólogo en Capítulo 1.1**:
  - Inyección del sprite del Arqueólogo (`Arqueologo_1_INAH.png`) en toda la secuencia interactiva del campamento a partir de la línea de su descubrimiento, persistiendo a lo largo de las elecciones y diálogos subsecuentes en `capitulo_1_1.json`.

### Cambiado
- **Ajustes de Proporción y Posición de Sprites**:
  - Se modificó `CharacterLayer.jsx` para acercar a los personajes hacia el centro de la pantalla (ejes fijados en `25%` y `75%` del ancho).
  - Escalamiento biológico condicional por ID: Adolescentes (Amaranta/Naia, ~14 años) restringidos al `72%` de altura; Adultos (Arqueólogo, ~30 años) ajustados al `92%`, logrando una proporción realista manteniendo el anclaje base (`bottom-0`).

### Corregido
- **Crash de Estado en Motor de Juego**:
  - Se solucionó un `ReferenceError` crítico en `GameEngine.jsx` asociado a `dialogueIndex` no definido en el ámbito local, enrutándolo correctamente hacia el `gameState?.dialogueIndex`.

## [0.3.25] - 2026-07-01

### Añadido
- **Sistema de Foco de Personajes (Estilo Arknights)**:
  - Implementada una lógica visual dinámica en `CharacterLayer.jsx` y `GameEngine.jsx` que rastrea al hablante activo (`currentSpeaker`).
  - Los sprites de personajes que no están hablando (o cuando el narrador habla) ahora se atenúan suavemente (brillo al 50%, opacidad al 90% y escala reducida al 98%) para enfatizar visualmente al personaje que tiene la palabra (iluminado al 100%). Las transiciones de luces y sombras se animan de forma fluida (300ms).
- **Integración de Amaranta en Capítulo 1.1**:
  - Se configuró la aparición persistente del sprite de Amaranta (`Amaranta_frente_dudas_sf.png`) en el lado izquierdo de la pantalla a través de las 9 escenas que componen la sección del campamento INAH (`escena_1_1_campamento` hasta `campamento_detonante`), inyectando el array `sprites` a nivel de escena en `capitulo_1_1.json` para que persista durante los menús de elección y flujos de diálogo.

## [0.3.24] - 2026-07-01
### Añadido
- **Efecto de Glitch Cyberpunk para Fondos**:
  - Implementación de un efecto CSS avanzado (`.vn-bg-glitch`) con separación de colores RGB (aberración cromática) y cortes horizontales erráticos.
  - El efecto está optimizado para accesibilidad (anti-epilepsia), utilizando frecuencias lentas (3s y 4s), colores tenues (`rgba(255,0,150,0.15)`) y el modo de fusión `overlay` para evitar destellos severos.
  - Integración nativa en `BackgroundLayer.jsx` soportando la propiedad `"effect": "glitch"` configurada desde el guion JSON.
- **Narrativa del Salto Temporal (Capítulo 1)**:
  - Configurada la escena `transicion_glitch_al_pasado` para utilizar el fondo del campamento pero con el efecto visual de glitch activo, transmitiendo la disociación espacio-tiempo.
  - Agregada la escena intermedia `transicion_a_oscuridad` que crea un fundido a negro suave de 1 segundo para mejorar el salto cinematográfico hacia el pasado.
  - Actualizado el fondo del Pleistoceno a `/backgrounds/escena_1_5_pleistoceno.png`.

### Cambiado
- **Refactorización del Motor de Transición de Fondos (`BackgroundLayer.jsx`)**:
  - Se rediseñó el sistema de renderizado del fondo para utilizar dos capas superpuestas (anterior y actual) con transición CSS real de `opacity`. Esto reemplaza la antigua dependencia de la animación directa de `backgroundImage`, solucionando el problema del "parpadeo instantáneo" al transicionar entre escenas.
  - Uso de variables de CSS (`--bg-url`) para permitir que pseudo-elementos hereden dinámicamente imágenes en línea, posibilitando efectos avanzados sin corromper el diseño general por colisiones de clases utilitarias de Tailwind.

## [0.3.23] - 2026-06-20
### Añadido
- **Soporte de Resaltados Múltiples en la Interfaz**:
  - Implementación de la función `isHighlighted(target)` en `GameEngine.jsx` que permite evaluar si un elemento de UI debe estar activo en base al estado de la línea actual de diálogo.
  - Compatibilidad de resaltados especificados como arreglos de cadenas (ej. `["btn-fullscreen", "glifo-agua"]`), listas de cadenas separadas por comas (ej. `"btn-fullscreen, glifo-agua"`) o cadenas simples, asegurando compatibilidad total con configuraciones previas (como `"hud-buttons"`).
  - Configuración del primer diálogo del tutorial de Naia en `capitulo_0.json` para resaltar de forma simultánea el botón de pantalla completa (`btn-fullscreen`) y el glifo de agua (`glifo-agua`).

### Cambiado
- **Convención de Transiciones de Fondo**:
  - Establecido como regla del proyecto que todo cambio de fondo en la novela visual debe usar una transición suave con fundido de 1 segundo (`transition: "fade", duration: 1000`). Se registraron estos lineamientos en `reglas.log` y `gemenimem.log`.
- **Política de Verificación Visual (`reglas.log`)**:
  - Se modificó la regla global para deshabilitar las simulaciones automatizadas mediante el Browser Agent, delegando la comprobación visual al usuario de manera manual.

### Corregido
- **Z-Index y Posicionamiento de Glifo de Agua**:
  - Se corrigió un problema donde el glifo de agua (`glifo-agua`) cambiaba a `position: relative` al activarse el resaltado (debido al estilo genérico de `.vn-highlight-active`), lo que alteraba su flujo y lo hacía invisible.
  - Se forzó `position: absolute !important` y se incrementó el `z-index` a `100` (y `110` cuando está activo) en `VisualNovelContainer.css` y `GameEngine.jsx` para garantizar que permanezca visible y al frente de la caja de diálogo.

## [0.3.22] - 2026-06-18

### Cambiado
- **Ajustes de Velocidad de Reproducción Automática (Auto Mode)**:
  - Optimización de las 4 velocidades (`x1`, `x2`, `x3`, `x4`) basándose en estándares de velocidad de lectura de novelas visuales (WPM a CPS).
  - Configuración de la velocidad `x1` a 20 caracteres por segundo (CPS) con buffer base de 1500ms (lectura normal de ~240 WPM).
  - Escalado dinámico de CPS y reducción proporcional del tiempo de espera mínimo (base buffer) para niveles superiores (`x2`: 32 CPS/1100ms, `x3`: 48 CPS/800ms, `x4`: 64 CPS/500ms) para garantizar transiciones naturales y fluidas.

## [0.3.21] - 2026-06-18

### Añadido
- **Función "Saltar Diálogos" (SALT.DIAL)**:
  - Implementación de la función `skipToNextChoice` en `useVisualNovelEngine.js` que recorre en memoria el grafo de escenas del capítulo actual hasta encontrar una escena de elección interactiva (`type === 'choice'`).
  - Esto realiza una transición limpia directamente a la siguiente toma de decisiones, omitiendo visualizaciones redundantes y optimizando la interactividad del usuario.
  - Soporte de parada controlada en transiciones inter-capítulo para posibilitar cargas asíncronas seguras de nuevos recursos JSON.
  - Conexión del botón `SALT.DIAL` de la interfaz para activar esta navegación acelerada.

### Corregido
- **Ocultamiento del Marcador de Confianza y Preservación**:
  - Se configuró el renderizado condicional del panel `<HUD />` en `GameEngine.jsx` para ocultarse durante los menús de elección (`isChoice === true`), evitando colisiones de visualización y mejorando la legibilidad.

## [0.3.20] - 2026-06-17

### Añadido
- **Desvanecimientos de Volumen en Audio (BGM Fade In/Out)**:
  - Implementación de la función utilitaria `fadeAudio` en `MainMenu.jsx` y `GameEngine.jsx` para realizar interpolaciones lineales suaves de volumen.
  - **Transición de Menús**: La música del menú principal se eleva con desvanecimiento de entrada (fade in) de 1.5 segundos al cargar, y disminuye progresivamente (fade out) en 0.5s al cambiar a submenús (extras, opciones, cargar partida) o en 1.5s al iniciar nueva partida o ver créditos, sincronizando perfectamente con las animaciones de la UI.
  - **Transición de Escenas y Capítulos**: En el motor de juego, la música anterior se desvanece de salida en 1.0s y la nueva música se desvanece de entrada en 1.0s al cambiar de escena o capítulo, creando un crossfade de audio continuo y fluido.
  - **Transición al Salir**: Al presionar HOME para retornar al Menú Principal, la música del juego se desvanece suavemente a 0 en 1.5s sincronizado con el fundido cinematográfico de salida.

## [0.3.19] - 2026-06-17

### Añadido
- **Soporte Nativo de BGM y SFX**:
  - Implementación de un controlador de audio nativo en `GameEngine.jsx` basado en referencias y efectos secundarios reactivos.
  - Soporte de transiciones suaves de música: mantiene la pista de fondo activa entre escenas si tienen la misma ruta BGM.
  - Sincronización en tiempo real del volumen de música y efectos con la configuración del perfil de usuario.
  - Gestión de errores de carga y bloqueos de autoreproducción del navegador al iniciar las pistas de audio para evitar cuelgues del motor.
  - Liberación y parada total de canales de audio al desmontar la vista de juego para prevenir fugas de memoria y audio.
- **Música de Fondo para Capítulo 0**:
  - Configurado el archivo de audio `pluck_loop_01.mp3` como el fondo musical oficial del Capítulo 0 (`capitulo_0.json`) y configurado para reproducirse en loop constante durante todo el tutorial con Naia.

## [0.3.18] - 2026-06-17

### Añadido
- **Destello Elástico de Antorcha de Naia**:
  - Implementación definitiva de la lógica elástica de posicionamiento en porcentaje (`left: 81.165%`, `top: 16.458%` con respecto a las dimensiones de la imagen `1545x1999` píxeles) de forma 100% responsiva y libre de cálculos por JS.
  - Añadido efecto de brillo variable simulando una flama real con variación de opacidad suave (entre `0.7` y `1.0`) y radio de desenfoque (`filter: blur()`) en `@keyframes naia-torch-flicker` en `VisualNovelContainer.css`.
  - La antorcha se mantiene encendida de forma permanente durante todo el Capítulo 0 (tutorial) para Naia.
  - Animación de entrada con desvanecimiento de 1 segundo (`naia-fade-in`) con 1 segundo de retraso para que el sprite de Naia aparezca después del brillo de la antorcha.
- **Ajustes de Estabilidad de Renderizado**:
  - Fijación estática de Naia durante la escritura del diálogo para evitar el jitter del texto, eliminando el wiggle.
  - Sincronización del ID del sprite de Naia en `GameEngine.jsx` para evitar desmontajes innecesarios cuando el narrador (`sistema`) describe la escena inicial.

## [0.3.17] - 2026-06-16

### Añadido
- **Correcciones de Texto e Idioma (Capítulo 0 y 1)**:
  - Sincronización y corrección de la frase inicial de Naia en los locales de español (`es`), inglés (`en`) y maya (`my`), eliminando la mención a la antorcha "apagada" de forma consistente.
- **Reversión de Efecto de Antorcha**:
  - Se deshicieron los cambios visuales y la lógica de renderizado del efecto de iluminación elástica en `CharacterLayer.jsx`, `GameEngine.jsx` y `VisualNovelContainer.css` para resolver el error de React que impedía renderizar el menú de inicio tras la pantalla de carga.

## [0.3.16] - 2026-06-15

### Añadido
- **Sistema de Vibración Paramétrico "Wiggle Effect"**:
  - Implementación de un efecto de vibración dinámico elástico en los sprites de los personajes cuando están hablando (`character-sprite.is-talking`).
  - Animación controlada dinámicamente mediante el estado `isTyping` del hook `useTypewriter.js` de modo que la vibración se ejecute únicamente durante la escritura del texto en pantalla y se detenga suavemente al finalizar.
  - Soporte para configurar la intensidad de vibración a través del parámetro opcional `wiggle_effect` ("soft", "normal", "intense") en el guion JSON.
  - Creación de tres variantes de keyframes CSS (`talk-wiggle-soft`, `talk-wiggle-normal` y `talk-wiggle-intense`) y su desacoplamiento posicional en `CharacterLayer.jsx` para evitar colisiones con las clases de alineación responsivas.
- **Corrección de Cuelgue (Pantalla Azul)**: Se reubicaron las declaraciones de hooks de máquina de escribir y traducción en `GameEngine.jsx` arriba del retorno temprano condicional. Esto evita violaciones a las reglas de hooks de React y soluciona el cuelgue (pantalla azul) al iniciar una nueva partida.

## [0.3.15] - 2026-06-15

### Cambiado
- **Renderizado de Sprites en Motor (`GameEngine.jsx`)**: Se adaptó el motor de la novela visual para mapear dinámicamente las nuevas propiedades de personajes estructuradas en el JSON (`character_sprite`, `expression`, `position`, `entry_animation`) al formato esperado por el componente `CharacterLayer`. Esto corrige el problema por el cual el sprite de Naia no se mostraba en pantalla y asegura la jerarquía visual correcta (encima del fondo y detrás de la UI/diálogos).
- **Localización y Diálogos de Naia**: Limpieza completa de las claves de traducción de diálogos de la escena tutorial `guia_naia` para el Capítulo 0 y el Capítulo 1 en Español, Inglés y Maya Yucateco (`es/translation.json`, `en/translation.json`, y `my/translation.json`).
- Se eliminaron las etiquetas obsoletas de sprites y efectos visuales de los diálogos en texto plano (tales como `[ENTRA SPRITE: ...]`, `[EFECTO VISUAL: ...]`, y `(Enciende su antorcha...)`) y los sufijos de indicación de clicks en español para sincronizarlos con la estructura limpia del motor de juego y evitar problemas de renderizado en la interfaz de usuario.

## [0.3.14] - 2026-06-15

### Añadido
- **Pantalla de Carga Real (`loader.js`)**: Reemplazada la simulación por un sistema de precarga real que descarga secuencialmente los 10 recursos multimedia y tipográficos más pesados del juego, calculando el progreso acumulado según los bytes reales transferidos (vía stream reader de HTTP) y mostrando dinámicamente el nombre y tamaño de cada archivo en pantalla.

## [0.3.13] - 2026-06-15

### Cambiado
- **Submenú de Extras (`ExtrasMenu.jsx`)**: Removida la opción "Selector de escenas" (Scene Selector) según la solicitud de limpieza del menú de extras.

## [0.3.12] - 2026-06-15

### Corregido
- **Botón Cerrar de la Galería (`GalleryMenu.jsx` & `GalleryMenu.css`)**:
  - Se simplificó la navegación llamando a `onBack()` directamente al hacer clic en el botón de cierre, delegando de forma consistente la animación de salida en la clase cinematográfica del contenedor `App.jsx`. Esto elimina la condición de carrera por eventos de animación bubbled.
  - Se incrementó el `z-index: 10` del botón de cierre para garantizar que se posicione sobre el encabezado y sea completamente interactivo.

## [0.3.11] - 2026-06-15

### Añadido
- **Sistema Modular de Galería de Arte (`GalleryMenu.jsx`, `GalleryMenu.css`, `galleryData.json`)**: Creación de un menú e interfaz a pantalla completa para la galería de arte, configurada externamente mediante JSON y con soporte trilingüe dinámico.
- **Paginación Inteligente**: Limita la visualización de imágenes a un máximo de 6 por página, calculando y gestionando dinámicamente las páginas y controles de navegación anterior/siguiente.
- **Lightbox de Detalle**: Modal interactivo inmersivo que maximiza la obra al hacer clic e incluye un panel lateral/inferior de información (título y pie de foto) localizado, con soporte para scroll interno en textos de gran longitud.
- **Traducciones Multilingües del Sistema de Galería**: Integradas claves de traducción de interfaz de la galería (`gallery.title`, `gallery.page`, etc.) en español, inglés y maya yucateco.

## [0.3.10] - 2026-06-15

### Añadido
- **Matriz de Responsabilidades de Créditos (`creditsData.json`)**: Configurado el bloque de desarrollo principal (`block2`) con los 5 cargos profesionales del equipo y los nombres de los desarrolladores correspondientes.
- **Traducciones Multilingües de la Matriz (`translation.json`)**: Mapeadas e integradas las traducciones oficiales de los 5 roles profesionales en Español, Inglés y Maya Yucateco.

## [0.3.9] - 2026-06-15

### Cambiado
- **Localización Total de Créditos (`CreditsScreen.jsx`)**: Se reemplazaron los atributos de texto hardcodeados (`aria-label` y `title`) del botón de cierre por claves de traducción dinámicas utilizando el hook `useTranslation`.
- **Traducciones Multi-idioma del Botón (`translation.json`)**: Agregadas las claves `"closeCredits"` y `"backToMenu"` en español, inglés y maya yucateco bajo el namespace `"credits"`.

## [0.3.8] - 2026-06-15

### Añadido
- **Pantalla de Créditos Cinematográficos (`CreditsScreen.jsx`)**: Creación de un componente premium para presentar los créditos del juego, integrado con transiciones de fundido cinematográficas automáticas controladas por tiempo.
- **Configuración mediante JSON (`creditsData.json`)**: Configuración descentralizada que permite establecer las personas, sus roles, imágenes de fondo, duración de exhibición y tipo de animación para cada diapositiva de créditos.
- **Efectos y Estilos de Animación Premium (`CreditsScreen.css`)**:
  - `fade`: Texto estático en el centro con transición suave de opacidad y desplazamiento.
  - `scroll`: Desplazamiento clásico vertical de abajo hacia arriba con velocidad de movimiento controlada por la duración.
  - `kinetic-parallax`: Zoom suave de fondo (efecto Ken Burns) combinado con desenfoque (`blur`) gradual y ligero zoom forward del texto para otorgar una profundidad cinematográfica.
- **Salida Interactiva Rápida**: Permitida la interrupción y regreso inmediato al menú principal en cualquier instante presionando cualquier tecla física del teclado o haciendo clic en el botón flotante de cierre (`X`).

### Cambiado
- **Integración en Menú Principal (`MainMenu.jsx`)**: Vinculación del botón "Créditos" para navegar a la vista de créditos.
- **Navegación Fluida (`App.jsx`)**: Registro de la nueva vista de créditos para heredar las transiciones de pantalla completa de fundido a negro y bloqueo de orientación.

## [0.3.7] - 2026-06-15

### Añadido
- **Sincronización Bidireccional de Guardados**: Implementada la lógica de sincronización al iniciar sesión en `GameStateContext.jsx`, la cual compara ranuras locales y de la nube y conserva las más recientes por marca de tiempo (`timestamp`). Además, realiza una fusión de nodos desbloqueados (`unlockedNodes`) para evitar la pérdida de progreso.
- **Soporte Offline Robusto**: La persistencia del juego se escribe siempre a `localStorage`, actuando como caché local e impidiendo la pérdida de datos si la conexión con la base de datos de Firebase falla o se interrumpe temporalmente.
- **Reglas de Seguridad en Firestore**: Creado el archivo de configuración `firestore.rules` que limita las lecturas y escrituras en la colección `usuarios_progreso/{userId}` de tal modo que sólo el usuario autenticado propietario del UID correspondiente pueda acceder a sus datos.

### Cambiado
- **Marcas de Tiempo en Configuración**: Añadido el campo `lastUpdated` a `settings` para posibilitar la comparación cronológica y resolución automática de conflictos en las opciones del usuario.
- **Documentación de Código**: Incorporación de comentarios JSDoc/TSDoc en funciones y hooks clave de `GameStateContext.jsx` aclarando el "por qué" de su diseño y flujo lógico interno.

## [0.3.6] - 2026-06-14

### Añadido
- **Mapa de Rutas de la Memoria (StoryMap)**: Implementación de un mapa interactivo con raíces bioluminiscentes en SVG utilizando la pintura rupestre `mapa_novela.png` como fondo. Los caminos crecen y brillan cian/verde/rojo dinámicamente según se desbloqueen los capítulos.
- **Acceso Directo en Extras**: Añadida la opción "Mapa de Rutas" directamente al menú de Extras junto a "Galería de Arte".
- **Miniaturas de Capítulos**: Creadas 4 miniaturas PNG circulares para los nodos de los capítulos 0, 1 y las dos bifurcaciones críticas.
- **Saltos de Navegación**: Permitido el salto directo a cualquier capítulo o ruta desbloqueada desde los nodos del mapa.

### Cambiado
- **Persistencia de Desbloqueo**: Guardado de los nodos desbloqueados globalmente en la configuración general del perfil y actualización retroactiva en la carga de partidas.
- **Restructuración a Pantalla Completa**: Se extrajo el Mapa de Rutas de la restricción del contenedor `menu-container` principal para renderizarlo de manera independiente y en pantalla completa a un ratio 16:9, evitando interferencias con los menús de fondo.
- **Transiciones Cinematográficas de Entrada/Salida**: Implementadas transiciones fluidas de fundido a negro (1.5 segundos) al navegar al mapa y al regresar a los menús.
- **Localización Completa e Interactiva**: Se corrigieron los atributos nativos de tooltips (`title`) y textos alternativos (`alt`) para que respondan dinámicamente al idioma activo (Español, Inglés y Maya).

## [0.3.5] - 2026-06-13

### Añadido
- **Fundidos de Transición de Escena (Fade Out/In)**: Implementada una capa de transición de opacidad animada de 500ms al cambiar de escena en `GameEngine.jsx` y `GameStateContext.jsx`, bloqueando clics accidentales del usuario durante el cambio.

### Cambiado
- **Correcciones de Texto e i18n**:
  - Corregido el diálogo del hospital psiquiátrico de Amaranta a `"Sí, claro. Directito al hospital psiquiátrico."` en español.
  - Actualizado el diálogo de las camionetas en la ruta de negligencia (`escena_1_7_ruta_a`) para mencionar uniformes extraños e instrumentos raros en español, inglés y maya.
  - Removido el indicador de fin de ruta `(FIN DE LA RUTA DE LA NEGLIGENCIA)` en los diálogos del narrador.
  - Creada una nueva escena de tipo mensaje centrado (`escena_1_7_ruta_a_fin`) que muestra de manera premium el mensaje de fin de ruta de negligencia y redirige al menú principal.

## [0.3.4] - 2026-06-13

### Añadido
- **Bifurcaciones de Decisión Crítica en Capítulo 1**: Añadidas las nuevas escenas `escena_1_7_eleccion`, `escena_1_7_ruta_a` y `escena_1_7_ruta_b` que corresponden a la segunda decisión crítica del juego.
- **Traducciones Multilingües**: Añadidas localizaciones en español, inglés y maya yucateco para las nuevas escenas en sus respectivos archivos `translation.json`.
- **Nuevos Personajes Localizados**: Se agregaron los personajes `abuela` y `papa` a los archivos de traducción para una correcta localización en todos los idiomas soportados.

### Cambiado
- **Flujo de Escena 1.7**: Modificado el atributo `next` de la escena `escena_1_7` en `capitulo_1.json` para conectar con el selector de decisiones `escena_1_7_eleccion`.

## [0.3.3] - 2026-06-10

### Añadido
- **Validación de Capítulos**: Creación del script de validación `validate-script.cjs`.

### Cambiado
- **Migración a JSON**: Migración del guion narrativo de `script.js` a archivos JSON por capítulo.
- **Carga Dinámica**: Implementación del cargador dinámico asíncrono `GameEngine.jsx` con Dynamic Imports.
- **Internacionalización**: Actualización de traducciones multiidioma para el Capítulo 0.

## [0.3.2] - 2026-06-09

### Cambiado
- **Escena Guía de Naia**: Integración de Naia al juego como personaje de guía para presentar las herramientas de la interfaz.
- **Escena Introductoria**: Adición de la escena inicial `escena_intro` con Amaranta para comenzar el relato.
- **Corrección de Errores**: Solución a errores de carga de Sprites y BGM en el `script.js`.
- **Recursos Multimedia**: Actualización del archivo `index.html` para incluir los enlaces a nuevas fuentes (PNG) y archivos de audio (BGM y SFX).

## [0.3.1] - 2026-06-09

### Cambiado
- **Resolución Mínima**: Eliminada la restricción de resolución mínima de 1024x576 en el contenedor de la novela visual (`VisualNovelContainer.css`).

## [0.3.0] - 2026-06-08

### Añadido
- **Sistema de Guardado Semi-automático**: Implementación de un sistema de 3 ranuras para registrar el progreso del juego en LocalStorage (y Firestore si el usuario está autenticado).
- **Submenú de Continuar partida**: Creación del componente `ContinueMenu.jsx` y su hoja de estilos `ContinueMenu.css` para permitir al usuario reanudar partidas guardadas, mostrando de forma dinámica el capítulo, la escena y la fecha/hora de guardado en cada ranura.
- **Modal de Guardado al Salir**: Integración de un modal interactivo en `VisualNovelEngine.jsx` que se muestra al intentar salir al menú principal (botón "HOME"), facilitando la selección de ranura para registrar el progreso antes de salir, o bien permitiendo salir sin guardar.
- **Traducciones**: Soporte multi-idioma (español, inglés y maya) para toda la interfaz del sistema de guardado y carga de ranuras en `translation.json`.
- **Traducción de Escenas y Capítulos**: Agregadas las traducciones faltantes de todos los capítulos y escenas en los archivos `en/translation.json` y `my/translation.json` para garantizar un correcto funcionamiento multilenguaje al mostrar el punto de guardado.
- **Internacionalización Dinámica de Fechas**: Soporte en `ContinueMenu.jsx` y `VisualNovelEngine.jsx` para formatear los timestamps de guardado usando la locale del idioma seleccionado en el juego.

### Cambiado
- **Tipografía y Estilos Consistentes**: Ajuste en `ContinueMenu.css` para heredar las tipografías globales del proyecto (`var(--font-family)`, `var(--sans)` y `var(--mono)`) y soportar de forma nativa el factor de escala de tamaño de letra de las opciones (`tamanoLetra` a través de `var(--ui-scale-multiplier)`).
- **Reiniciar Estado en Nueva Partida**: Ajuste en `MainMenu.jsx` para invocar la función `resetGameState` al presionar "Nueva partida", asegurando que el estado del juego empiece de cero.
- **Gestión de Estado Global**: Modificación en `GameStateContext.jsx` para soportar las ranuras de guardado en sincronía con base de datos e incorporar funciones utilitarias de guardado (`saveGameToSlot`), carga (`loadGameFromSlot`) y reinicio (`resetGameState`).

---

## [0.2.0] - 2026-05-24

### Añadido
- **Submenú de Extras**: Se creó un nuevo componente de React (`ExtrasMenu.jsx`) para la sección "Extras".
- **Componentes de Menú**: Se crearon componentes reutilizables (`MenuButton.jsx`) y un controlador de vistas (`App.jsx`) para gestionar la navegación entre menús.
- **Gestor de Estado Global**: Se implementó un contexto de React (`GameStateContext`) para gestionar y persistir las opciones del juego (idioma, volumen, etc.) en `localStorage`.
- **Navegación de Menú**: Se implementó una lógica de estado simple en `App.jsx` para cambiar entre el menú principal y el submenú de extras.
- **Animación de Menú**: Se añadieron animaciones de fundido (fade) para una transición suave entre el menú principal y el submenú de extras.
- **Fondo de Menú Dinámico**: Se integró una imagen de fondo en el menú principal.
- **Animación de Antorcha**: Se añadió un efecto de parpadeo a la antorcha en la imagen de fondo para dar vida al menú.
- **Selector de Idioma**: Se reincorporó el selector de idioma, ubicándolo sobre el menú principal.
- **Integración de Firebase**: Se añadió el archivo de configuración inicial de Firebase (Auth y Firestore) utilizando variables de entorno para las credenciales.
- **Botón de Guardado en la Nube**: Se añadió un componente de autenticación para iniciar y cerrar sesión con Google.
- **Fallback de Avatar**: Se implementó una vista alternativa con un ícono para usuarios que no tienen foto de perfil en Google.
- **Música de Fondo**: Se añadió música de fondo al menú principal, controlada por el estado global de volumen.
- **Pantalla de Interacción**: Se añadió una pantalla "Haz clic para continuar" para cumplir con las políticas de auto-reproducción de audio de los navegadores.

### Cambiado
- **Estructura del Menú Principal**: Se reorganizó el `MainMenu.jsx` según las nuevas especificaciones.
- **Traducciones del Menú**: Se actualizaron los archivos de traducción (`es`, `en`, `my`) con las nuevas claves.
- **Selector de Idioma**: El componente ahora utiliza el contexto global para cambiar y reflejar el idioma actual.
- **Gestor de Estado Global**: Ahora se sincroniza con Firebase (Auth y Firestore) cuando un usuario inicia sesión, usando `localStorage` como respaldo cuando está desconectado.
- **Flujo de Autenticación**: Se mejoró el componente `Auth.jsx` para actualizar la interfaz de manera instantánea tras un inicio de sesión exitoso.
- **Visualización de Avatar**: Se corrigió el problema que impedía mostrar las fotos de perfil de Google añadiendo la `referrerPolicy` correcta.
- **Funcionalidad del Botón Salir**: Se refactorizó la función de salida para usar la API global de Tauri (`window.__TAURI__`), eliminando las importaciones dinámicas y solucionando errores de compilación en Vite.
- **Diseño Responsivo del Menú**: El menú ahora se alinea a la derecha en pantallas grandes y se centra en dispositivos móviles.
- **Fuente del Menú**: Se cambió la fuente principal a "Kaushan Script" y se incluyó localmente para su uso sin conexión.
- **Animación de Antorcha Responsiva**: La posición y el tamaño del efecto de la antorcha ahora se calculan dinámicamente para mantenerse fijos y proporcionados en la imagen sin importar el tamaño de la pantalla.

---

## [0.1.0] - 2026-05-24

### Añadido
- **Pantalla de Carga**: Se implementó la pantalla de carga inicial con una barra de progreso simulada para mejorar la experiencia del usuario durante la carga de recursos.
- **Menú Principal**: Se creó la estructura del menú principal usando React, con opciones para "Nueva Partida", "Partida Guardada", "Continuar", "Galería", "Escenas", "Opciones", "Créditos" y "Salir".
- **Internacionalización (i18n)**: Se integró `i18next` para soportar múltiples idiomas.
- **Traducciones**: Se añadieron los archivos de traducción iniciales para español (es), inglés (en) y maya (my).
- **Selector de Idioma**: Se añadió un componente de interfaz para permitir a los usuarios cambiar dinámicamente el idioma del juego.

### Corregido
- **Configuración de i18next**: Se corrigieron problemas con las rutas de los archivos en la configuración de `i18next`, asegurando que los archivos de traducción se carguen correctamente desde el directorio `/public/locales`.
- **Análisis de JSON**: Se resolvieron errores de análisis en los archivos de traducción asegurando una sintaxis JSON estricta y una codificación UTF-8 adecuada.
- **Condición de Carrera**: Se estabilizó el proceso de carga de idiomas usando `React.Suspense` para evitar que la interfaz se renderice antes de que las traducciones estén listas.

### Cambiado
- **Diseño Responsivo**: El menú principal y la pantalla de carga ahora son responsivos y se adaptan a pantallas de móviles en formato horizontal.
- **Punto de Entrada de la Aplicación**: Se actualizó `main.jsx` para inicializar y envolver correctamente la aplicación con los proveedores de i18n y Suspense.