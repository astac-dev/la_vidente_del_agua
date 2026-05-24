import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Tu configuración de Firebase desde las variables de entorno de Vite
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Validar que todas las credenciales de Firebase estén presentes
const isConfigValid = Object.values(firebaseConfig).every(value => Boolean(value));

let auth = null;
let googleProvider = null;
let db = null;

if (isConfigValid) {
  try {
    // Inicializar Firebase solo si la configuración es válida
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    db = getFirestore(app);
  } catch (error) {
    console.error("Error al inicializar Firebase:", error);
  }
} else {
  console.warn(
    "Configuración de Firebase incompleta en el archivo .env. " +
    "Las funcionalidades de guardado en la nube estarán deshabilitadas."
  );
}

export { auth, googleProvider, db };