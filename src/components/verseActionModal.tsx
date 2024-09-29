import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity } from 'react-native';
import { Button } from './Button';

interface VerseActionModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (note: string) => void;
    onRemove: () => void;
    initialNote?: string;
    verse: { id: number, version: number, testament: number, book: number, chapter: number, verse: number, text: string } | null;
}

export function VerseActionModal({
    visible,
    onClose,
    onSave,
    onRemove,
    initialNote = '',
    verse = null,
}: VerseActionModalProps) {
    const [note, setNote] = useState<string>(initialNote);

    useEffect(() => {
        setNote(initialNote);
    }, [initialNote]);

    const handleSave = () => {
        onSave(note);
        setNote('');
        onClose();
    };

    const handleRemove = () => {
        onRemove();
        setNote('');
        onClose();
    };

    const { colorScheme } = useColorScheme();
    const textColor = colorScheme === "dark" ? "#fff" : "#000";

    return (
        <Modal visible={visible} transparent={true} animationType="slide">
            <View className="flex-1 justify-center items-center bg-black/90">
                <View className="bg-stone-100 dark:bg-gray-800 p-6 rounded-lg w-4/5">
                    <View className="flex flex-row justify-between">
                        <Text className="text-lg font-bold text-black dark:text-white mb-4">
                            {initialNote ? 'Editar Nota' : 'Adicionar Nota'}
                        </Text>
                        {initialNote &&
                            <TouchableOpacity
                                onPress={handleRemove}
                                className="flex-row items-center justify-center w-8 h-8 rounded-full bg-black">
                                <Ionicons name="trash" size={20} color="#fff" />
                            </TouchableOpacity>}
                    </View>
                    <View className='bg-white dark:bg-gray-800 dark:bg dark:border dark:border-gray-600 p-5 text-black dark:text-white rounded-md mb-4'>
                        <Text className='text-xl font-bold text-black dark:text-white'>{verse?.book} {verse?.chapter}:{verse?.verse}<Text className='uppercase'> - {verse?.version}</Text></Text>
                        <Text className='text-lg text-black dark:text-white'>{verse?.text}</Text>
                    </View>
                    <View>
                        <TextInput
                            value={note}
                            onChangeText={setNote}
                            placeholder="Escreva sua nota"
                            placeholderTextColor={textColor}
                            className="border border-gray-300 dark:border-gray-600 p-2 h-16 text-black dark:text-white rounded-md mb-4"
                            multiline
                        />
                    </View>
                    <View className="flex-row justify-between gap-4">
                        <Button title="Cancelar" classButton="p-4 bg-red-500 dark:bg-red-800 rounded-lg" classText="text-white text-center text-lg" onPress={onClose} />
                        <Button title="Salvar" classButton="p-4 bg-blue-500 dark:bg-blue-800 rounded-lg" classText="text-white text-center text-lg" onPress={handleSave} />
                    </View>
                </View>
            </View>
        </Modal>
    );
}