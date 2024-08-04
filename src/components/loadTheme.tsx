import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from "nativewind";

const loadTheme = () => {
    const { setColorScheme } = useColorScheme();

    useEffect(() => {
        const loadTheme = async () => {
            const storedTheme = await AsyncStorage.getItem('colorScheme');
            if (storedTheme === "light" || storedTheme === "dark" || storedTheme === "system") {
                setColorScheme(storedTheme);
            }
        };
        loadTheme();
    }, [setColorScheme]);
};

export default loadTheme;