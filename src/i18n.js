import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';

i18n
  .use(HttpApi) // Carga traducciones desde archivos
  .use(initReactI18next) // Pasa la instancia de i18n a react-i18next
  .init({
    // Idiomas soportados
    supportedLngs: ['es', 'en', 'my'],
    // Idioma por defecto
    fallbackLng: 'es',
    lng: 'es',
    // Namespace por defecto
    ns: 'translation',
    defaultNS: 'translation',
    backend: {
      // Ruta a los archivos de traducción en la carpeta `public`
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    // Activar logs de depuración en la consola del navegador
    debug: true,
    interpolation: {
      escapeValue: false, // React ya se encarga de la seguridad contra XSS
    },
  });

export default i18n;