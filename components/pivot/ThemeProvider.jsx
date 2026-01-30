'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({
    theme: 'light',
    setTheme: () => {},
    effectiveTheme: 'light'
});

export function ThemeProvider({ children }) {
    // Opciones: 'light', 'dark', 'auto'
    const [theme, setTheme] = useState('light');
    const [effectiveTheme, setEffectiveTheme] = useState('light');

    // Cargar tema guardado del localStorage al montar
    useEffect(() => {
        const savedTheme = localStorage.getItem('pivot-theme') || 'auto';
        setTheme(savedTheme);
    }, []);

    // Actualizar tema efectivo cuando cambia la preferencia
    useEffect(() => {
        const updateEffectiveTheme = () => {
            if (theme === 'auto') {
                // Detectar preferencia del sistema
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                setEffectiveTheme(prefersDark ? 'dark' : 'light');
            } else {
                setEffectiveTheme(theme);
            }
        };

        updateEffectiveTheme();

        // Escuchar cambios en preferencia del sistema si está en auto
        if (theme === 'auto') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handler = (e) => setEffectiveTheme(e.matches ? 'dark' : 'light');
            
            mediaQuery.addEventListener('change', handler);
            return () => mediaQuery.removeEventListener('change', handler);
        }
    }, [theme]);

    // Aplicar clase al documento y guardar en localStorage
    useEffect(() => {
        const root = document.documentElement;
        
        if (effectiveTheme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }

        // Guardar preferencia
        localStorage.setItem('pivot-theme', theme);
    }, [effectiveTheme, theme]);

    const value = {
        theme,
        setTheme,
        effectiveTheme
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
}
