import { router } from "expo-router";
import { View, Text, TouchableOpacity } from 'react-native';

export type VerseItemProps = {
    verse: {
        book: {
            abbrev: {
                pt: string,
                en: string,
            },
            author: string,
            chapters: number,
            group: string,
            name: string,
            testament: string
        },
        chapter: number,
        number: number,
        text: string,
    }
}

export function VerseItemSearch({ verse, version }: VerseItemProps & any) {

    function navigateTo(version: string, abbrev: string, chapter: number, number: number | null) {
        router.push({ pathname: "/book/", params: { version: version, abbrev: abbrev, chapter: chapter, number: number} });
    }

    return (
        <TouchableOpacity className="flex-1 mb-2 border-b border-b-gray-500"
            onPress={() => navigateTo(version, verse.book.abbrev.pt, verse.chapter, verse.number)}>
            <View className="p-10">
                <Text className="text-xl font-bold mb-1 dark:text-white">{verse.book.name} {verse.chapter}:{verse.number}</Text>
                <Text className="text-lg dark:text-white">{verse.text}</Text>
            </View>
        </TouchableOpacity>
    );
};
