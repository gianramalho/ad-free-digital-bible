import ThemeToggle from "@/components/themeToggle";
import { Text, View } from "react-native";

export default function Home() {
    return (
        <View className="flex-1 dark:bg-slate-800">
            <ThemeToggle />
        </View>
    );
}