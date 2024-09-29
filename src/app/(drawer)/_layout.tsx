import React, { useState } from 'react';
import { Drawer } from 'expo-router/drawer';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { saveTheme } from '@/utils/themeUtils';
import { useLoading } from '@/contexts/loadingContext';
import { useTheme } from '@/providers/themeProvider';

export default function DrawerLayout() {
    const [modalVisible, setModalVisible] = useState(false);
    const { colorScheme, setColorScheme } = useTheme();
    const color = colorScheme === "dark" ? "#fff" : "#000";
    const iconColor = colorScheme === "dark" ? "#fff" : "#000";
    const backgroundColor = colorScheme === "dark" ? "#1e293b" : "#f5f5f4";
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
            <Drawer
                screenOptions={{
                    headerShown: true,
                    headerTitle: () => null,
                    headerRight: () => (
                        <View className="flex flex-row px-8 gap-5">
                            {/* <Ionicons
                                name="text"
                                size={24}
                                onPress={() => setModalVisible(true)}
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
                    drawerActiveTintColor: '#000',
                    drawerInactiveTintColor: color,
                    drawerActiveBackgroundColor: '#dbeafe',
                    drawerStyle: { backgroundColor: backgroundColor, },
                    drawerItemStyle: {
                        borderTopRightRadius: 20,
                        borderBottomRightRadius: 20,
                        width: '90%',
                        marginLeft: 0,
                        marginRight: 0,
                        paddingLeft: 10,
                        paddingVertical: 6,
                    }
                }}>
                <Drawer.Screen name="index" options={{
                    title: 'Início', headerShown: false,
                    drawerIcon: ({ focused, size }) => (
                        <Ionicons name="home-outline" size={size} color={focused ? '#000' : color} />
                    ),
                }} />
                <Drawer.Screen name="books" options={{
                    title: 'Bíblia', headerShown: true,
                    drawerIcon: ({ focused, size }) => (
                        <Ionicons name="book-outline" size={size} color={focused ? '#000' : color} />
                    ),
                }} />
                <Drawer.Screen name="search" options={{
                    title: 'Buscar', headerShown: true,
                    drawerIcon: ({ focused, size }) => (
                        <Ionicons name="search-outline" size={size} color={focused ? '#000' : color} />
                    ),
                }} />
                <Drawer.Screen name="myWorkspace" options={{
                    title: 'Minha Área', headerShown: true,
                    drawerIcon: ({ focused, size }) => (
                        <Ionicons name="person-circle-outline" size={size} color={focused ? '#000' : color} />
                    ),
                }} />
                <Drawer.Screen name="settings" options={{
                    title: 'Configurações', headerShown: true,
                    drawerIcon: ({ focused, size }) => (
                        <Ionicons name="settings-outline" size={size} color={focused ? '#000' : color} />
                    ),
                }} />
            </Drawer>

            {/* <Modal
                transparent={true}
                animationType="fade"
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}>
                <View className='flex-1 justify-center items-center bg-black/50'>
                    <View className='flex items-center bg-white rounded-xl w-4/5 h-4/5'>
                        <View className='flex'>
                            <Text>Modal Title</Text>
                            <Button title="Close Modal" onPress={() => setModalVisible(false)} />
                        </View>
                        <View>
                            <Button title="Aumentar Fonte" onPress={increaseFontSize} />
                            <Button title="Diminuir Fonte" onPress={decreaseFontSize} />
                        </View>
                    </View>
                </View>
            </Modal> */}
        </View>
    );
}