import React from 'react';
import { useGameState } from '../context/GameStateContext';
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useTranslation } from 'react-i18next';
import './Auth.css';

const Auth = () => {
    // 1. El estado del usuario (`user`) se extrae correctamente de nuestro contexto global.
    const { user, isLoading, setUser } = useGameState();
    const { t } = useTranslation();

    // 2. La función para conectar con Google se define dentro del componente
    //    para poder acceder al contexto (setUser).
    const handleSignIn = async () => {
        // Verifica si la instancia de Firebase Auth está lista.
        if (!auth || !googleProvider) {
            console.error(
                "Error de configuración de Firebase: La instancia de 'auth' o 'googleProvider' no está disponible. " +
                "Asegúrate de que tu archivo .env esté correctamente configurado con las credenciales de Firebase."
            );
            return;
        }
        try {
            const resultado = await signInWithPopup(auth, googleProvider);
            console.log("Usuario conectado:", resultado.user.displayName);
            // Se actualiza el estado global del usuario inmediatamente después del éxito.
            setUser(resultado.user);
        } catch (error) {
            console.error("Error al intentar iniciar sesión con Google. Código de error:", error.code, "Mensaje:", error.message);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            console.log("Usuario desconectado.");
        } catch (error) {
            console.error("Error al desconectar:", error);
        }
    };

    if (isLoading) {
        return <div className="auth-container placeholder" />;
    }

    // 3. El renderizado condicional está encapsulado dentro del return
    //    y envuelto en un único <div> para evitar nodos huérfanos.
    return (
        <div className="auth-container">
            {user ? (
                <div className="logged-in-view">
                    <span className="user-display-name">{user.displayName}</span>
                    {user.photoURL ? (
                        <img 
                            src={user.photoURL} 
                            alt={t('userProfilePicture')} 
                            className="user-avatar" 
                            referrerPolicy="no-referrer"
                        />
                    ) : (
                        <div className="user-avatar-fallback">
                            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                        </div>
                    )}
                    <button onClick={handleSignOut} className="logout-button" title={t('signOut')}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0z" fill="none"/><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/></svg>
                    </button>
                </div>
            ) : (
                <button onClick={handleSignIn} className="login-button">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0z" fill="none"/><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/></svg>
                    <span>{t('signInWithGoogle')}</span>
                </button>
            )}
        </div>
    );
};

export default Auth;