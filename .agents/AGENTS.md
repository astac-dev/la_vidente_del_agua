# Reglas de Empaquetado y Despliegue para Itch.io

## Configuración de Vite (`vite.config.js`)
- **Obligatorio para Itch.io:** La propiedad `base` debe estar configurada en `'./'` (ruta relativa). Itch.io empaqueta los juegos en un iFrame con rutas dinámicas. Usar rutas absolutas como `'/la_vidente_del_agua/'` provocará errores 404 en Itch.io.

## Compresión del Proyecto (`dist`)
- **NUNCA usar `Compress-Archive` (PowerShell):** Este comando utiliza barras invertidas (`\`) en los `.zip`. Los servidores de Itch.io (Linux) fallarán al extraer las subcarpetas (`assets/`, `bgm/`, etc.) porque no reconocen `\`, generando errores 404 al cargar recursos.
- **Forma correcta:** Utilizar `tar` para asegurar la compatibilidad:
  ```powershell
  cd dist
  tar -a -c -f ../la_vidente_del_agua_itch.zip *
  ```
  Esto crea un `.zip` con formato POSIX usando `/`, permitiendo que Itch.io desempaquete correctamente la estructura.
