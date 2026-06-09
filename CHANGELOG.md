# Historial de Cambios

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