import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'nativewind';

interface ThemeContextType {
    colorScheme: 'light' | 'dark';
    setColorScheme: (scheme: 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const { colorScheme: nativeColorScheme, setColorScheme: setNativeColorScheme } = useColorScheme();
    const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        const loadTheme = async () => {
            const storedTheme = await AsyncStorage.getItem('colorScheme');
            if (storedTheme === 'light' || storedTheme === 'dark') {
                setColorScheme(storedTheme as 'light' | 'dark');
                setNativeColorScheme(storedTheme as 'light' | 'dark'); // Atualiza também o esquema nativo
            } else {
                setColorScheme(nativeColorScheme || 'light');
            }
        };
        loadTheme();
    }, [nativeColorScheme]); // Carregar tema ao iniciar

    useEffect(() => {
        AsyncStorage.setItem('colorScheme', colorScheme);
        setNativeColorScheme(colorScheme); // Atualiza o esquema nativo quando mudar
    }, [colorScheme, setNativeColorScheme]);

    return (
        <ThemeContext.Provider value={{ colorScheme, setColorScheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
