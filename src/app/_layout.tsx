import "@/theme/global.css";
import { View } from "react-native"
import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { SQLiteProvider } from "expo-sqlite";
import { initializeDatabase } from "@/database/initializeDatabase"
import { LoadingProvider } from "@/contexts/loadingContext";
import { useKeepAwake } from "expo-keep-awake";
import { ToastProvider } from "react-native-toast-notifications";
import { ThemeProvider } from "@/providers/themeProvider";

export default function Layout() {
    useKeepAwake();

    return (
        <ThemeProvider>
            <LoadingProvider>
                <ToastProvider>
                    <SQLiteProvider databaseName="database" onInit={initializeDatabase}>
                        <View className="flex-1" >
                            <StatusBar style="auto" backgroundColor="transparent" translucent />
                            <Stack screenOptions={{
                                headerShown: false,
                            }}>
                                <Stack.Screen name="(drawer)" />
                            </Stack>
                        </View>
                    </SQLiteProvider>
                </ToastProvider>
            </LoadingProvider>
        </ThemeProvider>
    )
}
