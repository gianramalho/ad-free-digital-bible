import { useColorScheme } from "nativewind";
import { ActivityIndicator, Text, View } from "react-native"

interface LoadingProps {
    message?: string;
}

export function Loading({ message }: LoadingProps) {
    const { colorScheme } = useColorScheme();

    return (
        <View className="absolute top-0 right-0 left-0 bottom-0 z-50 flex-1 justify-center bg-stone-100 dark:bg-slate-800">
            <ActivityIndicator
                size="large"
                color={colorScheme === 'dark' ? '#dbeafe' : '#1e293b'}
            />
            {message && (
                <Text className="mt-3 text-xl dark:text-white text-center">{message}</Text>
            )}
        </View>
    )
}