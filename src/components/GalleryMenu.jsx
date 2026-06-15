/* src/components/GalleryMenu.jsx */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import galleryData from '../data/galleryData.json';
import './GalleryMenu.css';

/**
 * Componente modular de Galería de Arte en Pantalla Completa.
 * Implementa paginación responsiva (máx 6 elementos por rejilla),
 * localización trilingüe integrada desde JSON y visor Lightbox inmersivo
 * con soporte para textos explicativos de gran longitud.
 */
const GalleryMenu = ({ onBack }) => {
  const { t, i18n } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [activeItem, setActiveItem] = useState(null);

  const itemsPerPage = 6;
  const totalPages = Math.ceil(galleryData.length / itemsPerPage);

  // Normalizar código de idioma a es, en, my
  const currentLang = (i18n.language || 'es').substring(0, 2);
  const langKey = currentLang === 'my' ? 'my' : (currentLang === 'en' ? 'en' : 'es');

  // Obtener elementos correspondientes a la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = galleryData.slice(indexOfFirstItem, indexOfLastItem);

  // Navegación de páginas
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  // Resolver la ruta completa del archivo de imagen utilizando la URL base de Vite
  const getFullImageUrl = (filename) => {
    if (!filename) return '';
    const base = import.meta.env.BASE_URL;
    // Evitar duplicar barras diagonales en la ruta final
    const cleanFilename = filename.startsWith('/') ? filename.slice(1) : filename;
    return `${base}${cleanFilename}`;
  };

  return (
    <div className="gallery-screen fade-in">
      {/* Botón flotante para cerrar la galería */}
      <button 
        className="gallery-close-btn" 
        onClick={onBack}
        aria-label={t('gallery.closeGallery') || 'Cerrar galería'}
        title={t('menu.back') || 'Volver'}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Encabezado */}
      <header className="gallery-header">
        <h1 className="gallery-title-main">
          {t('gallery.title') || 'Galería de Arte'}
        </h1>
        <p className="gallery-subtitle">
          {t('gallery.subtitle') || 'Hallazgos del Pleistoceno'}
        </p>
      </header>

      {/* Rejilla de Ilustraciones */}
      <main className="gallery-body">
        <div className="gallery-grid">
          {currentItems.map((item) => {
            const itemTitle = item.title[langKey] || item.title['es'] || '';
            return (
              <div 
                key={item.id} 
                className="gallery-card"
                onClick={() => setActiveItem(item)}
              >
                <div className="gallery-card-thumb-container">
                  <img 
                    src={getFullImageUrl(item.filename)} 
                    alt={itemTitle} 
                    className="gallery-card-thumb"
                    loading="lazy"
                  />
                </div>
                <div className="gallery-card-info">
                  <h2 className="gallery-card-title">{itemTitle}</h2>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Barra de Paginación */}
      <footer className="gallery-footer">
        <button 
          className="gallery-nav-btn" 
          onClick={handlePrevPage} 
          disabled={currentPage === 1}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
          {t('gallery.prev') || 'Anterior'}
        </button>

        <span className="gallery-page-indicator">
          {t('gallery.page') || 'Página'}{' '}
          <span className="gallery-page-current">{currentPage}</span>{' '}
          {t('gallery.of') || 'de'}{' '}
          {totalPages}
        </span>

        <button 
          className="gallery-nav-btn" 
          onClick={handleNextPage} 
          disabled={currentPage === totalPages}
        >
          {t('gallery.next') || 'Siguiente'}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </footer>

      {/* Lightbox / Visor de Detalle Ampliado */}
      {activeItem && (
        <div 
          className="gallery-lightbox-overlay"
          onClick={() => setActiveItem(null)}
        >
          <div 
            className="gallery-lightbox-container"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón de cierre del lightbox */}
            <button 
              className="gallery-lightbox-close"
              onClick={() => setActiveItem(null)}
              aria-label={t('gallery.closeLightbox') || 'Cerrar visor'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Imagen del Lightbox */}
            <div className="gallery-lightbox-media">
              <img 
                src={getFullImageUrl(activeItem.filename)} 
                alt={activeItem.title[langKey] || activeItem.title['es']} 
                className="gallery-lightbox-img"
              />
            </div>

            {/* Panel de Datos / Título y Pie de Foto */}
            <div className="gallery-lightbox-info">
              <h2 className="gallery-lightbox-title">
                {activeItem.title[langKey] || activeItem.title['es']}
              </h2>
              <div className="gallery-lightbox-scroll">
                <p className="gallery-lightbox-caption">
                  {activeItem.caption[langKey] || activeItem.caption['es']}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryMenu;
