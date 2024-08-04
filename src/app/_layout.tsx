import "@/theme/global.css";
import { Pressable, View } from "react-native"
import { Slot, Stack, useNavigation } from "expo-router"
import { DrawerActions } from "@react-navigation/native"
import { StatusBar } from "expo-status-bar"
import { Entypo } from "@expo/vector-icons"
import { useColorScheme } from "nativewind";

export default function Layout() {
    const navigation = useNavigation()
    const toggleMenu = () => navigation.dispatch(DrawerActions.toggleDrawer())
    const { colorScheme } = useColorScheme();
    const iconColor = colorScheme === "light" ? "#000" : "#fff";

    return (
        <View className="flex-1">
            <StatusBar style="auto" backgroundColor="transparent" translucent />
            <Stack>
                <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
            </Stack>
        </View>
    )
}
