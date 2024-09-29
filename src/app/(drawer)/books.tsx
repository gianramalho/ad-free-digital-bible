import { View, ScrollView, TouchableOpacity, Text } from "react-native";
import { useEffect, useState } from "react";
import { BookItem } from "@/components/bookItem";
import { booksResponse } from "@/services/services.types";
import { BooksServices } from "@/services/booksServices";
import { useLoading } from "@/contexts/loadingContext";

export default function BooksScreen() {
    const booksServices = BooksServices()
    const [books, setBooks] = useState<booksResponse[]>([]);
    const { setIsLoading } = useLoading();
    const [selectedTestament, setSelectedTestament] = useState<'VT' | 'NT'>('VT');

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                setIsLoading(true);
                const booksData = await booksServices.list();
                setBooks(booksData);
            } catch (error) {
                console.error('Erro ao carregar livros:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBooks();
    }, []);

    const filteredBooks = books.filter(book => book.testament === selectedTestament);

    return (
        <View className="flex-1 bg-stone-100 dark:bg-slate-800">
            <View className="flex-1 px-1">
                <View className="flex flex-row justify-between px-6 pb-6">
                    <TouchableOpacity className={`w-[49%] rounded-lg p-4 dark:bg-slate-800 dark:border dark:border-gray-500 ${selectedTestament === 'VT' ? 'bg-blue-600 border border-blue-600 dark:bg-blue-100' : 'bg-gray-300 border border-gray-300'}`}
                        onPress={() => setSelectedTestament('VT')}>
                        <Text className={`text-center text-base font-bold ${selectedTestament === 'VT' ? 'text-white' : 'text-gray-500'}`}>Velho Testamento</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className={`w-[49%] rounded-lg p-4 dark:bg-slate-800 dark:border dark:border-gray-500 ${selectedTestament === 'NT' ? 'bg-blue-600 border border-blue-600 dark:bg-blue-100' : 'bg-gray-300 border border-gray-300'}`}
                        onPress={() => setSelectedTestament('NT')}>
                        <Text className={`text-center text-base font-bold ${selectedTestament === 'NT' ? 'text-white' : 'text-gray-500'}`}>Novo Testamento</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={true}>
                    <View className="px-6 pb-6">
                        <View className="flex flex-col gap-2">
                            {filteredBooks.map(book => (
                                <BookItem
                                    key={book.abbrev}
                                    book={book}
                                />
                            ))}
                        </View>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}