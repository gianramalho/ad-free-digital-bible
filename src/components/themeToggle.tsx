import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useColorScheme } from "nativewind";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const ThemeToggle = () => {
    const { colorScheme, setColorScheme } = useColorScheme();
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedScheme, setSelectedScheme] = useState<"light" | "dark" | "system" | undefined>(colorScheme);

    useEffect(() => {
        const loadTheme = async () => {
            const storedTheme = await AsyncStorage.getItem('colorScheme');
            if (storedTheme === "light" || storedTheme === "dark" || storedTheme === "system") {
                setColorScheme(storedTheme);
                setSelectedScheme(storedTheme);
            }
            setIsLoaded(true);
        };
        loadTheme();
    }, []);

    const handleSelect = async (scheme: "light" | "dark" | "system") => {
        setIsLoading(true);
        setSelectedScheme(scheme);
        await AsyncStorage.setItem('colorScheme', scheme);
        setColorScheme(scheme);
        setIsLoading(false);
    };

    if (!isLoaded) {
        return null;
    }

    return (
        <View className="p-6 mt-14">
            {isLoading ? (
                <View className="flex justify-center items-center">
                    <ActivityIndicator size="large" color={colorScheme === 'dark' ? '#dbeafe' : '#1e293b'} />
                    <Text className="mt-3 text-xl dark:text-white">Alterando tema...</Text>
                </View>
            ) : (
                <>
                    <Text className="text-xl mb-3 dark:text-white">Selecionar Tema</Text>
                    <View className="flex-col divide-y-2 divide-slate-800 dark:divide-white gap-5">
                        <TouchableOpacity
                            onPress={() => handleSelect('system')}
                            className="flex flex-row items-center justify-between">
                            <View className="flex flex-row gap-3">
                                <Ionicons
                                    name={"contrast"}
                                    size={20}
                                    color={colorScheme === 'dark' ? '#fff' : '#000'}
                                />
                                <Text className="dark:text-white">Automático</Text>
                            </View>
                            <Ionicons
                                name={selectedScheme === 'system' ? "radio-button-on" : "radio-button-off"}
                                size={24}
                                color={colorScheme === 'dark' ? '#fff' : '#000'}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => handleSelect('light')}
                            className="flex flex-row items-center justify-between">
                            <View className="flex flex-row gap-3">
                                <Ionicons
                                    name={"sunny"}
                                    size={20}
                                    color={colorScheme === 'dark' ? '#fff' : '#000'}
                                />
                                <Text className="dark:text-white">Claro</Text>
                            </View>


                            <Ionicons
                                name={selectedScheme === 'light' ? "radio-button-on" : "radio-button-off"}
                                size={24}
                                color={colorScheme === 'dark' ? '#fff' : '#000'}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => handleSelect('dark')}
                            className="flex flex-row items-center justify-between">
                            <View className="flex flex-row gap-3">
                                <Ionicons
                                    name={"moon"}
                                    size={20}
                                    color={colorScheme === 'dark' ? '#fff' : '#000'}
                                />
                                <Text className="dark:text-white">Escuro</Text>
                            </View>

                            <Ionicons
                                name={selectedScheme === 'dark' ? "radio-button-on" : "radio-button-off"}
                                size={24}
                                color={colorScheme === 'dark' ? '#fff' : '#000'}
                            />
                        </TouchableOpacity>
                    </View>
                    <Text className="mt-3 text-sm text-gray-500 dark:text-gray-300">
                        Automático é suportado apenas em sistemas operacionais que permitem controlar o tema em nível de sistema.
                    </Text>
                </>
            )}
        </View>
    );
};

export default ThemeToggle;