import { View, ScrollView, TouchableOpacity, Text } from "react-native";
import { useEffect, useState } from "react";
import { services } from "@/services";
import { BookItem } from "@/components/bookItem";
import { Loading } from "@/components/loading";
import { useColorScheme } from "nativewind";
import { Ionicons } from "@expo/vector-icons";

export default function BooksScreen() {
    const { colorScheme } = useColorScheme();
    const [books, setBooks] = useState<booksResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
        'VT': true,
        'NT': true
    });
    const [sections, setSections] = useState<{ title: string, key: string, data: booksResponse[] }[]>([]);

    const toggleSection = (key: string) => {
        setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
    };

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                setIsLoading(true);
                const booksData = await services.books.getBooks();
                setBooks(booksData);
            } catch (error) {
                console.error('Erro ao carregar livros:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBooks();
    }, []);

    useEffect(() => {
        setSections([
            {
                title: "Velho Testamento",
                key: 'VT',
                data: books.filter(book => book.testament === "VT"),
            },
            {
                title: "Novo Testamento",
                key: 'NT',
                data: books.filter(book => book.testament === "NT"),
            },
        ]);
    }, [books]);

    if (isLoading) {
        return <Loading />;
    }

    return (
        <View className="flex-1 dark:bg-slate-800">
            <View className="mt-14 p-6">
                <ScrollView showsVerticalScrollIndicator={false}>
                    {sections.map(section => (
                        <View key={section.key} className="mb-3">
                            <TouchableOpacity onPress={() => toggleSection(section.key)}>
                                <View className="flex flex-row items-center p-3 gap-3">
                                    <Text className="text-xl font-bold dark:text-white">{section.title}</Text>
                                    <Ionicons
                                        name={expandedSections[section.key] ? 'chevron-down' : 'chevron-up'}
                                        size={25}
                                        color={colorScheme === 'dark' ? '#fff' : '#000'}
                                    />
                                </View>
                            </TouchableOpacity>
                            {expandedSections[section.key] && (
                                <View>
                                    {section.data.map(book => (
                                        <BookItem
                                            key={book.abbrev.pt}
                                            book={book}
                                        />
                                    ))}
                                </View>
                            )}
                        </View>
                    ))}
                </ScrollView>
            </View>
        </View>
    );
}