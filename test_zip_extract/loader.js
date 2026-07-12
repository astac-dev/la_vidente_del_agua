document.addEventListener('DOMContentLoaded', () => {
    const progressBar = document.getElementById('progress-bar');
    const loadingPercentage = document.getElementById('loading-percentage');
    const loadingStatus = document.getElementById('loading-status');
    const loaderContainer = document.getElementById('loader-container');
    const gameContainer = document.getElementById('root'); // Apuntamos al div raíz de React

    // --- Lista de Recursos Reales a Precargar ---
    const assetsToLoad = [
        { name: 'Logotipo principal', url: './logo.jpg' },
        { name: 'Tipografía Kaushan Script', url: './fonts/KaushanScript-Regular.woff2' },
        { name: 'Música del menú principal', url: './bgm/theme_main_menu.mp3' },
        { name: 'Ilustración del menú', url: './assets/ui/fondo_menu_principal.jpg' },
        { name: 'Ilustración de créditos', url: './arte/Ame_2016_arnauld_fig3.jpg' },
        { name: 'Obra Máscara de la Tierra', url: './arte/mascara_de_la_tierra.jpg' },
        { name: 'Miniatura Capítulo 0', url: './assets/thumbnails/node_cap0.png' },
        { name: 'Miniatura Capítulo 1', url: './assets/thumbnails/node_cap1.png' },
        { name: 'Miniatura Ruta Alterna', url: './assets/thumbnails/node_ruta_a.png' },
        { name: 'Miniatura Ruta Principal', url: './assets/thumbnails/node_ruta_b.png' }
    ];

    const totalAssets = assetsToLoad.length;
    let assetsLoaded = 0;

    // Función para descargar un recurso y reportar progreso real de bytes
    async function loadAssetWithProgress(asset, index) {
        try {
            const response = await fetch(asset.url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const contentLength = response.headers.get('Content-Length');
            let sizeText = '';
            if (contentLength) {
                const sizeInKb = (+contentLength / 1024).toFixed(0);
                if (sizeInKb > 1024) {
                    sizeText = ` (${(sizeInKb / 1024).toFixed(1)} MB)`;
                } else {
                    sizeText = ` (${sizeInKb} KB)`;
                }
            }

            loadingStatus.textContent = `Cargando: ${asset.name}${sizeText}...`;

            // Usar Reader para procesar bytes descargados progresivamente
            const reader = response.body.getReader();
            const totalBytes = contentLength ? parseInt(contentLength, 10) : 0;
            let loadedBytes = 0;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                loadedBytes += value.length;

                // Si conocemos el tamaño total del archivo, reportamos progreso intermedio
                if (totalBytes > 0) {
                    const fileProgress = loadedBytes / totalBytes;
                    // Progreso total ponderado: (recursos_completados + progreso_del_actual) / total
                    const overallProgress = Math.min(
                        Math.round(((index + fileProgress) / totalAssets) * 100),
                        99 // Dejar 100% para cuando termine completamente
                    );
                    progressBar.style.width = `${overallProgress}%`;
                    loadingPercentage.textContent = `${overallProgress}%`;
                }
            }

            assetsLoaded++;
            const completedProgress = Math.round((assetsLoaded / totalAssets) * 100);
            progressBar.style.width = `${completedProgress}%`;
            loadingPercentage.textContent = `${completedProgress}%`;

        } catch (error) {
            console.warn(`Error al precargar recurso: ${asset.name} (${asset.url})`, error);
            // Si falla, incrementamos de todos modos para no colgar la pantalla de carga
            assetsLoaded++;
            const completedProgress = Math.round((assetsLoaded / totalAssets) * 100);
            progressBar.style.width = `${completedProgress}%`;
            loadingPercentage.textContent = `${completedProgress}%`;
        }
    }

    // Inicia el proceso de carga real de forma secuencial
    async function startLoading() {
        for (let i = 0; i < totalAssets; i++) {
            await loadAssetWithProgress(assetsToLoad[i], i);
        }

        loadingStatus.textContent = 'Recursos listos. Iniciando juego...';

        // Pequeña pausa de confort antes de mostrar el juego
        setTimeout(() => {
            loaderContainer.classList.add('loader-fade-out');

            // Después de la animación de desvanecimiento, oculta el loader y muestra el juego.
            loaderContainer.addEventListener('transitionend', () => {
                loaderContainer.classList.add('hidden');
                gameContainer.classList.remove('hidden'); // Mostramos el div #root
            }, { once: true });

        }, 400);
    }

    startLoading();
});