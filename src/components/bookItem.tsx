import { useLoading } from '@/contexts/loadingContext';
import { router } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';

export type BookProps = {
    book: {
        abbrev: string,
        chapters: string,
        name: string,
        testament: string,
    }
}

export function BookItem({ book }: BookProps) {
    const { setIsLoading } = useLoading();

    function navigateTo(abbrev: string) {
        setIsLoading(true);
        router.push({ pathname: "/book/", params: { abbrev: abbrev } });
    }

    return (
        <TouchableOpacity className="flex-1"
        onPress={() => navigateTo(book.abbrev)}>
            <View className={`rounded-lg p-3 dark:bg-slate-800 bg-white dark:border dark:border-blue-100 dark:shadow-none shadow-lg  ${book.testament === 'NT' ? 'shadow-green-200' : 'shadow-blue-200'}`}>
                <View className="flex flex-row justify-between">
                    <Text className="text-lg font-bold dark:text-white" numberOfLines={1} lineBreakMode="tail">
                        {book.name}
                    </Text>
                    <Text className={`text-base font-bold dark:text-white ${book.testament === 'NT' ? 'text-green-600' : 'text-blue-600'}`} numberOfLines={1} lineBreakMode="tail">
                        {book.abbrev}
                    </Text>
                </View>
                <Text className="text-base dark:text-white" numberOfLines={1} lineBreakMode="tail">
                    {book.chapters} Capítulos
                </Text>
            </View>
        </TouchableOpacity>
    );
}