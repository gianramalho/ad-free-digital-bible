import { View, ScrollView, TouchableOpacity, Text, RefreshControl } from "react-native";
import { useState, useCallback } from "react";
import { VersesServices } from "@/services/versesServices";
import { useFocusEffect } from '@react-navigation/native';
import { useLoading } from "@/contexts/loadingContext";

export default function MyWorkspaceScreen() {
    const versesServices = VersesServices();
    const [verses, setVerses] = useState<Array<{ verse_id: number, is_favorite: boolean, highlight_color: string, note: string, version: string, book: string, chapter: string, verse: string, text: string }>>([]);
    const { setIsLoading } = useLoading();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [selectedTypeAction, setSelectedTypeAction] = useState<'F' | 'N'>('F');

    const fetchVerses = async () => {
        try {
            const versesData = await versesServices.getMyFavoriteVerses();
            setVerses(versesData);
        } catch (error) {
            console.error('Erro ao carregar livros:', error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            setIsLoading(true);
            fetchVerses();
        }, [])
    );

    const onRefresh = () => {
        setIsRefreshing(true);
        fetchVerses();
    };

    const favoriteVerses = verses.filter(verse => verse.is_favorite);
    const versesWithNotes = verses.filter(verse => verse.note);
    const filteredVerses = selectedTypeAction === 'F' ? favoriteVerses : versesWithNotes;

    return (
        <View className="flex-1 bg-stone-100 dark:bg-slate-800">
            <View className="flex-1 px-1">
                <View className="flex flex-row justify-between px-6 pb-6">
                    <TouchableOpacity className={`w-[49%] rounded-lg p-3 dark:bg-slate-800 dark:border dark:border-gray-500 ${selectedTypeAction === 'F' ? 'bg-blue-600 dark:bg-blue-100' : 'bg-gray-300'}`}
                        onPress={() => setSelectedTypeAction('F')}>
                        <Text className={`text-center text-base font-bold ${selectedTypeAction === 'F' ? 'text-white' : 'text-gray-500'}`}>Favoritos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className={`w-[49%] rounded-lg p-3 dark:bg-slate-800 dark:border dark:border-gray-500 ${selectedTypeAction === 'N' ? 'bg-blue-600 dark:bg-blue-100' : 'bg-gray-300'}`}
                        onPress={() => setSelectedTypeAction('N')}>
                        <Text className={`text-center text-base font-bold ${selectedTypeAction === 'N' ? 'text-white' : 'text-gray-500'}`}>Notas</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={true}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={onRefresh}
                        />
                    }>
                    <View className="px-6 pb-6">
                        <View className="flex flex-col gap-2">
                            {filteredVerses.map(verse => (
                                <View key={verse.verse_id} className='rounded-lg p-3 dark:bg-slate-800 bg-white dark:border dark:border-blue-100 dark:shadow-none shadow-lg'>
                                    <View className='bg-white dark:bg-gray-800 p-5 text-black dark:text-white rounded-md mb-4'>
                                        <Text className='text-xl font-bold text-black dark:text-white'>{verse?.book} {verse?.chapter}:{verse?.verse}<Text className='uppercase'> - {verse?.version}</Text></Text>
                                        <Text className={`p-2 mt-2 text-lg text-black dark:text-white rounded-lg ${verse.highlight_color}`}>{verse?.text}</Text>
                                    </View>
                                    {selectedTypeAction === 'N' && verse.note && (
                                        <View className='bg-white dark:bg-gray-800 dark:bg dark:border dark:border-gray-600 p-5 text-black dark:text-white rounded-md mb-4'>
                                            <Text className='text-lg dark:text-gray-300'>
                                                Nota: {verse.note}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            ))}
                        </View>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}