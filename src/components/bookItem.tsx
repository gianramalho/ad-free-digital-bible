import { router } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';

export type BookProps = {
    book: {
        abbrev: {
            pt: string,
            en: string
        },
        author: string,
        chapters: string,
        group: string,
        name: string,
        testament: string
    }
}

export function BookItem({ book }: BookProps) {

    function navigateTo(abbrev: string) {
        router.push({ pathname: "/book/", params: { abbrev: abbrev } });
    }

    return (
        <TouchableOpacity className="flex-1 mb-2"
        onPress={() => navigateTo(book.abbrev.pt)}>
            <View className={`border border-gray-300 rounded-lg p-3 dark:bg-slate-800 ${book.testament === 'NT' ? 'bg-green-100' : 'bg-blue-100'}`}>
                <View className="flex flex-row justify-between">
                    <Text className="text-lg font-bold dark:text-white" numberOfLines={1} lineBreakMode="tail">
                        {book.name}
                    </Text>
                    <Text className="text-base dark:text-white" numberOfLines={1} lineBreakMode="tail">
                        {book.abbrev.pt}
                    </Text>
                </View>
                <Text className="text-base dark:text-white" numberOfLines={1} lineBreakMode="tail">
                    {book.chapters} Capítulos
                </Text>
            </View>
        </TouchableOpacity>
    );
}