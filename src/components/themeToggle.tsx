import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { saveTheme } from "@/utils/themeUtils";
import { useLoading } from "@/contexts/loadingContext";
import { useTheme } from "@/providers/themeProvider";

const ThemeToggle = () => {
    const { colorScheme, setColorScheme } = useTheme();
    const [selectedScheme, setSelectedScheme] = useState<"light" | "dark" | undefined>(colorScheme);
    const iconColor = colorScheme === "dark" ? "#fff" : "#000";
    const { setIsLoading } = useLoading();

    const handleSelect = async (scheme: "light" | "dark") => {
        setIsLoading(true);
        setSelectedScheme(scheme);
        const newScheme = colorScheme === 'light' ? 'dark' : 'light';
        setColorScheme(newScheme);
        await saveTheme(newScheme);
        setIsLoading(false);
    };

    return (
        <View className="px-6 pb-6">
            <Text className="text-xl mb-3 dark:text-white">Selecionar Tema</Text>
            <View className="flex-col divide-y-2 divide-slate-800 dark:divide-white gap-5">
                <TouchableOpacity
                    onPress={() => handleSelect('light')}
                    className="flex flex-row items-center justify-between">
                    <View className="flex flex-row gap-3">
                        <Ionicons
                            name={"sunny"}
                            size={20}
                            color={iconColor}
                        />
                        <Text className="dark:text-white">Claro</Text>
                    </View>
                    <Ionicons
                        name={selectedScheme === 'light' ? "radio-button-on" : "radio-button-off"}
                        size={24}
                        color={iconColor}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handleSelect('dark')}
                    className="flex flex-row items-center justify-between">
                    <View className="flex flex-row gap-3">
                        <Ionicons
                            name={"moon"}
                            size={20}
                            color={iconColor}
                        />
                        <Text className="dark:text-white">Escuro</Text>
                    </View>
                    <Ionicons
                        name={selectedScheme === 'dark' ? "radio-button-on" : "radio-button-off"}
                        size={24}
                        color={iconColor}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ThemeToggle;
