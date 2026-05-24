document.addEventListener('DOMContentLoaded', () => {
    const progressBar = document.getElementById('progress-bar');
    const loadingPercentage = document.getElementById('loading-percentage');
    const loadingStatus = document.getElementById('loading-status');
    const loaderContainer = document.getElementById('loader-container');
    const gameContainer = document.getElementById('root'); // Apuntamos al div raíz de React

    // --- Simulación de Carga de Archivos ---
    // Puedes reemplazar esto con tus archivos reales.
    const assetsToLoad = [
        { name: 'config.json', time: 100 },
        { name: 'character_sprites.png', time: 500 },
        { name: 'background_forest.jpg', time: 600 },
        { name: 'main_theme.mp3', time: 800 },
        { name: 'script_chapter1.json', time: 200 },
        { name: 'font.woff2', time: 150 },
        { name: 'sfx_click.wav', time: 50 },
        { name: 'sfx_rain.ogg', time: 400 },
        { name: 'background_castle.jpg', time: 700 },
        { name: 'script_chapter2.json', time: 250 },
    ];

    const totalAssets = assetsToLoad.length;
    let assetsLoaded = 0;

    // Simula la carga de un solo archivo
    function loadAsset(asset) {
        return new Promise(resolve => {
            // Simulamos un tiempo de carga variable
            setTimeout(() => {
                assetsLoaded++;
                resolve();
            }, asset.time);
        });
    }

    // Inicia el proceso de carga
    async function startLoading() {
        for (const asset of assetsToLoad) {
            loadingStatus.textContent = `Cargando: ${asset.name}...`;
            await loadAsset(asset);
            
            // Calcula y actualiza el progreso
            const progress = Math.round((assetsLoaded / totalAssets) * 100);
            progressBar.style.width = `${progress}%`;
            loadingPercentage.textContent = `${progress}%`;
        }

        loadingStatus.textContent = 'Iniciando juego...';

        // Pequeña pausa antes de mostrar el juego
        setTimeout(() => {
            loaderContainer.classList.add('fade-out');

            // Después de la animación de desvanecimiento, oculta el loader y muestra el juego.
            loaderContainer.addEventListener('transitionend', () => {
                loaderContainer.classList.add('hidden');
                gameContainer.classList.remove('hidden'); // Mostramos el div #root
            }, { once: true }); // El listener se ejecuta solo una vez

        }, 500);
    }

    startLoading();
});