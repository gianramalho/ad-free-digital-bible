import "@/theme/global.css";
import { View } from "react-native"
import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { LoadingProvider } from "@/contexts/loadingContext";
import { useKeepAwake } from "expo-keep-awake";
import { ThemeProvider } from "@/providers/themeProvider";
import { SQLiteProvider } from "expo-sqlite";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
export default function Layout() {
    useKeepAwake();

    return (
        <SafeAreaProvider>
            <ThemeProvider>
                <LoadingProvider>
                    <SQLiteProvider databaseName="database" assetSource={{ assetId: require('../assets/mydb.db') }}>
                        <View className="flex-1" >
                            <StatusBar style="auto" backgroundColor="transparent" translucent />
                            <Stack screenOptions={{
                                headerShown: false,
                            }}>
                                <Stack.Screen name="(drawer)" />
                            </Stack>
                            <Toast />
                        </View>
                    </SQLiteProvider>
                </LoadingProvider>
            </ThemeProvider>
        </SafeAreaProvider>
    )
}
