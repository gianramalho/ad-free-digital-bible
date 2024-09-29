import AsyncStorage from '@react-native-async-storage/async-storage';

export const changeTheme = async (scheme: "light" | "dark", setColorScheme: Function) => {
    setColorScheme(scheme);
};

export const saveTheme = async (scheme: "light" | "dark") => {
    await AsyncStorage.setItem('colorScheme', scheme);
};