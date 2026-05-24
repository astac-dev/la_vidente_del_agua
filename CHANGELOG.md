# Historial de Cambios

## [0.2.0] - 2026-05-24

### Añadido
- **Submenú de Extras**: Se creó un nuevo componente de React (`ExtrasMenu.jsx`) para la sección "Extras".
- **Componentes de Menú**: Se crearon componentes reutilizables (`MenuButton.jsx`) y un controlador de vistas (`App.jsx`) para gestionar la navegación entre menús.
- **Navegación de Menú**: Se implementó una lógica de estado simple en `App.jsx` para cambiar entre el menú principal y el submenú de extras.
- **Animación de Menú**: Se añadieron animaciones de fundido (fade) para una transición suave entre el menú principal y el submenú de extras.
- **Animación de Antorcha**: Se añadió un efecto de parpadeo a la antorcha en la imagen de fondo para dar vida al menú.

### Cambiado
- **Estructura del Menú Principal**: Se reorganizó el `MainMenu.jsx` según las nuevas especificaciones: "Continuar", "Nueva Partida", "Cargar Partida", "Extras", "Opciones", "Créditos" y "Salir".
- **Traducciones del Menú**: Se actualizaron los archivos de traducción (`es`, `en`, `my`) con las claves para los nuevos elementos del menú y el submenú de extras.
- **Estilos**: Se añadieron estilos básicos para los botones y la disposición de los menús en `MainMenu.css`.
- **Fuente del Menú**: Se cambió la fuente principal a "Kaushan Script" y se incluyó localmente para su uso sin conexión.

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