import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export type VerseProps = {
    verse: {
        number: number;
        text: string;
        isFavorite: boolean;
        highlightColor: string;
        note: string;
    };
    isSelected: boolean;
    onSelect: () => void;
};



export function VerseItem({ verse, isSelected, onSelect }: VerseProps) {
    const { colorScheme } = useColorScheme();
    const iconColor = colorScheme === "dark" ? "#fff" : "#000";
    return (
        <TouchableOpacity
            onPress={onSelect}
            className={`border-gray-200 border-t border-b ${isSelected ? 'bg-yellow-200 dark:bg-blue-900' : ''} ${verse.isFavorite ? verse.highlightColor : ''}`}>
            <View className="py-4 px-6 flex flex-row gap-2">
                <Text className="text-base font-bold text-black dark:text-gray-300">{verse.number}</Text>
                <Text className="text-xl dark:text-white">{verse.text}</Text>
                <View className="flex flex-row absolute gap-2 right-1 bottom-1">
                    {verse.isFavorite && (
                        <View className="">
                            <Ionicons name="heart" size={15} color="#fff" />
                        </View>
                    )}
                    {verse.note && (
                        <View className="">
                            <Ionicons name="pencil" size={15} color={iconColor} />
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
}