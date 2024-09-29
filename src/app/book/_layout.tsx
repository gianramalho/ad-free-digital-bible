import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { saveTheme } from '@/utils/themeUtils';
import { useLoading } from '@/contexts/loadingContext';
import { Stack, useNavigation } from 'expo-router';
import { useTheme } from '@/providers/themeProvider';

export default function StackLayout() {
    const { colorScheme, setColorScheme } = useTheme();
    const color = colorScheme === "dark" ? "#fff" : "#000";
    const iconColor = colorScheme === "dark" ? "#fff" : "#000";
    const backgroundColor = colorScheme === "dark" ? "#1e293b" : "#dbeafe";
    const navigation = useNavigation();
    const { setIsLoading } = useLoading();

    const handleChangeTheme = async () => {
        setIsLoading(true);
        const newScheme = colorScheme === 'light' ? 'dark' : 'light';
        setColorScheme(newScheme);
        await saveTheme(newScheme);
        setIsLoading(false);
    }

    return (
        <View className="flex-1">
            <Stack
                screenOptions={{
                    headerShown: true,
                    headerTitle: () => null,
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            className="p-2 flex flex-row gap-5 justify-center text-center items-center">
                            <Ionicons
                                name={"arrow-back"}
                                size={30}
                                color={iconColor}
                            />
                        </TouchableOpacity>
                    ),

                    headerRight: () => (
                        <View className="flex flex-row px-8 gap-5">
                            {/* <Ionicons
                                name="text"
                                size={24}
                                onPress={() => alert('Modal Ajustar fonte')}
                                color={iconColor}
                            /> */}
                            <Ionicons
                                name={colorScheme === 'light' ? "moon" : "sunny"}
                                size={24}
                                onPress={handleChangeTheme}
                                color={iconColor}
                            />
                        </View>
                    ),
                    headerShadowVisible: false,
                    headerStyle: { backgroundColor: backgroundColor },
                    headerTintColor: color,
                }}>
            </Stack>
        </View>
    );
}