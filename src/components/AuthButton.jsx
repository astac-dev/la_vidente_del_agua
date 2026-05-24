import React from 'react';
import { useGameState } from '../context/GameStateContext';
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useTranslation } from 'react-i18next';

const AuthButton = () => {
    const { user, isLoading } = useGameState();
    const { t } = useTranslation();

    const handleSignIn = async () => {
        try {
            const resultado = await signInWithPopup(auth, googleProvider);
            console.log("Usuario conectado:", resultado.user.displayName);
        } catch (error) {
            console.error("Error al conectar con Google:", error);
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
        return <div className="auth-container placeholder"></div>; // Placeholder para evitar saltos de diseño
    }

    return (
        <div className="auth-container">
            {user ? (
                <>
                    <span className="user-greeting">{t('greeting', { name: user.displayName.split(' ')[0] })}</span>
                    <button onClick={handleSignOut} className="auth-button">{t('signOut')}</button>
                </>
            ) : (
                <button onClick={handleSignIn} className="auth-button">{t('signInWithGoogle')}</button>
            )}
        </div>
    );
};

export default AuthButton;