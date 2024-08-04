import { useNavigation } from "expo-router";
import { useColorScheme } from "nativewind";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native"

export function Loading() {
    const { colorScheme } = useColorScheme();
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);

    return (
        <View className="flex-1 justify-center dark:bg-slate-800">
            <ActivityIndicator
                size="large"
                color={colorScheme === 'dark' ? '#dbeafe' : '#1e293b'}
            />
        </View>
    )
}
