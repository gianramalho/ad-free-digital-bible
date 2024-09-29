import ThemeToggle from "@/components/themeToggle";
import { View } from "react-native";

export default function Home() {
    return (
        <View className="flex-1 bg-stone-100 dark:bg-slate-800">
            <ThemeToggle />
        </View>
    );
}