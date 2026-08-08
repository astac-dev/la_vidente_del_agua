document.addEventListener('DOMContentLoaded', () => {
    const progressBar = document.getElementById('progress-bar');
    const loadingPercentage = document.getElementById('loading-percentage');
    const loadingStatus = document.getElementById('loading-status');
    const loaderContainer = document.getElementById('loader-container');
    const gameContainer = document.getElementById('root'); // Apuntamos al div raíz de React

    // --- Lista de Recursos Reales a Precargar ---
    let assetsToLoad = [];
    let totalAssets = 0;
    let assetsLoaded = 0;
    const CONCURRENCY_LIMIT = 6;

    function updateProgressUI(fileProgress = 0) {
        if (totalAssets === 0) return;
        const overallProgress = Math.min(
            Math.round(((assetsLoaded + fileProgress) / totalAssets) * 100),
            100 
        );
        progressBar.style.width = `${overallProgress}%`;
        loadingPercentage.textContent = `${overallProgress}%`;
    }

    // Función para descargar un recurso y reportar progreso real de bytes
    async function loadAssetWithProgress(asset) {
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
                    updateProgressUI(fileProgress);
                }
            }

            assetsLoaded++;
            updateProgressUI(0);

        } catch (error) {
            console.warn(`Error al precargar recurso: ${asset.name} (${asset.url})`, error);
            // Si falla, incrementamos de todos modos para no colgar la pantalla de carga
            assetsLoaded++;
            updateProgressUI(0);
        }
    }

    // Inicia el proceso de carga real con concurrencia controlada
    async function startLoading() {
        try {
            loadingStatus.textContent = 'Analizando recursos...';
            // Cargar el manifest generado dinámicamente
            const response = await fetch('./manifest.json');
            if (response.ok) {
                const manifest = await response.json();
                assetsToLoad = manifest.assets || [];
                totalAssets = assetsToLoad.length;
            } else {
                console.warn('No se encontró manifest.json, procediendo con la carga básica.');
            }
        } catch (e) {
            console.error('Error al cargar manifest.json', e);
        }

        if (totalAssets > 0) {
            let currentIndex = 0;
            const workers = Array(CONCURRENCY_LIMIT).fill(0).map(async () => {
                while (currentIndex < totalAssets) {
                    const asset = assetsToLoad[currentIndex++];
                    if (asset) {
                        await loadAssetWithProgress(asset);
                    }
                }
            });
            await Promise.all(workers);
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