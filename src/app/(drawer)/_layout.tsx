import { useNavigation } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { DrawerActions } from "@react-navigation/native"
import { useColorScheme } from 'nativewind';
import { Pressable, View } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import loadTheme from '@/components/loadTheme';

export default function DrawerLayout() {
    const navigation = useNavigation();
    const toggleMenu = () => navigation.dispatch(DrawerActions.toggleDrawer());
    const { colorScheme } = useColorScheme();
    const iconColor = colorScheme === "light" ? "#000" : "#fff";
    loadTheme();
    return (
        <View className="flex-1">
            <Drawer screenOptions={{
                headerShown: false,
                drawerActiveTintColor: '#000',
                drawerInactiveTintColor: colorScheme === 'dark' ? '#fff' : '#000',
                drawerActiveBackgroundColor: '#dbeafe',
                drawerStyle: { backgroundColor: colorScheme === 'dark' ? '#1e293b' : '#fff' },
            }}>
                <Drawer.Screen name="index" options={{ title: 'Livros' }} />
                <Drawer.Screen name="search" options={{ title: 'Buscar' }} />
                <Drawer.Screen name="settings" options={{ title: 'Configurações' }} />
            </Drawer>
            <Pressable onPress={toggleMenu} className='absolute right-8 top-8 z-10'>
                <Entypo name="menu" color={iconColor} size={32} />
            </Pressable>
        </View>
    );
}