import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useRef, useEffect, useState, useLayoutEffect } from "react";
import { Loading } from "@/components/loading";
import { services } from "@/services";
import { Picker } from '@react-native-picker/picker';
import { useColorScheme } from "nativewind";
import { Ionicons } from "@expo/vector-icons";

interface Verse {
    number: number;
    text: string;
}

interface ChapterData {
    book: {
        abbrev: { pt: string; en: string };
        name: string;
        author: string;
        group: string;
        version: string;
    };
    chapter: {
        number: number;
        verses: number;
    };
    verses: Verse[];
}

interface Book {
    abbrev: string;
    name: string;
}

export default function BookDetail() {
    const params = useLocalSearchParams<{ version: any, abbrev: any, chapter: any, number: any }>();
    const version = params.version;
    const abbrev = params.abbrev;
    const chapter = params.chapter;
    const number = params.number;
    const { colorScheme } = useColorScheme();
    const navigation = useNavigation();

    const [selectedVersion, setSelectedVersion] = useState<string>(version || 'nvi');
    const [selectedChapter, setSelectedChapter] = useState<number | undefined>(chapter ? parseInt(chapter) : undefined);
    const [selectedNumber, setSelectedNumber] = useState<number | undefined>(number ? parseInt(number) : undefined);
    const [selectedBook, setSelectedBook] = useState<string>(abbrev || '');
    const [books, setBooks] = useState<booksResponse[]>([]);
    const flatListRef = useRef<FlatList<Verse>>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [book, setBook] = useState<Book>();
    const [data, setData] = useState<ChapterData | null>(null);
    const [chapters, setChapters] = useState<number[]>([]);
    const [versions] = useState<versionsResponse[]>([
        { label: 'ACF - Almeida Corrigida Fiel', version: 'acf' },
        { label: 'NVI - Nova Versão Internacional', version: 'nvi' },
        { label: 'ARA - Almeida Revista e Atualizada', version: 'ra' }
    ]);
    const [collapsed, setCollapsed] = useState(false || !((selectedVersion || version) && (selectedChapter || chapter) && (selectedNumber || number)));
    const [isFlatListReady, setIsFlatListReady] = useState(false);
    const isFromSearch = !!chapter && !!number;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const booksResponse = await services.books.getBooks();
                setBooks(booksResponse);

                if (selectedBook) {
                    const bookResponse = await services.books.getBookDetails(selectedBook);
                    setChapters(Array.from({ length: bookResponse.chapters }, (_, i) => i + 1));
                    setBook(bookResponse);

                    if (selectedChapter) {
                        const chapterData = await services.books.getChapterData(selectedVersion, selectedBook, selectedChapter);
                        setData(chapterData);
                    }
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [selectedBook, selectedChapter, selectedVersion]);

    useLayoutEffect(() => {
        if (selectedNumber !== undefined && data) {
            const index = data.verses.findIndex(verse => verse.number === selectedNumber);

            if (index >= 0 && flatListRef.current && isFlatListReady) {
                flatListRef.current.scrollToIndex({
                    index,
                    animated: true,
                });
            }
        }
    }, [selectedNumber, data, isFlatListReady]);

    const onScrollToIndexFailed = (info: { index: number; highestMeasuredFrameIndex: number; averageItemLength: number }) => {
        const wait = new Promise(resolve => setTimeout(resolve, 500));
        wait.then(() => {
            if (flatListRef.current) {
                flatListRef.current.scrollToIndex({
                    index: info.index,
                    animated: true,
                });
            }
        });
    };

    const handleChapterChange = (itemValue: number) => {
        setSelectedChapter(itemValue);
        setSelectedNumber(undefined);
    };

    const handleBookChange = (itemValue: string) => {
        setSelectedBook(itemValue);
        setSelectedChapter(undefined);
        setSelectedNumber(undefined);
        setCollapsed(true);
    };

    useEffect(() => {
        if (!isFromSearch) {
            setSelectedChapter(undefined);
            setSelectedNumber(undefined);
        }
    }, [selectedBook]);

    if (isLoading) {
        return (<Loading />);
    }

    return (
        <View className="flex-1 bg-stone-50 dark:bg-slate-800">
            <View className="dark:bg-slate-800 dark:text-white bg-blue-100 mt-8">
                <View className="flex flex-row justify-between px-3 w-full">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="p-2 flex flex-row gap-5 justify-center text-center items-center">
                        <Ionicons
                            name={"arrow-back"}
                            size={25}
                            color={colorScheme === 'dark' ? '#fff' : '#000'}
                        />
                    </TouchableOpacity>
                    <Picker
                        selectedValue={selectedBook}
                        onValueChange={handleBookChange}
                        style={{ color: colorScheme === 'dark' ? '#fff' : '#000', width: '90%' }}
                        dropdownIconColor={colorScheme === 'dark' ? '#fff' : '#000'}>
                        {books.map((book) => (
                            <Picker.Item key={book.abbrev.pt} label={book.name} value={book.abbrev.pt} />
                        ))}
                    </Picker>
                </View>
            </View>
            <View className="flex-1 p-6 gap-5">
                <View className="dark:bg-slate-800 dark:border dark:border-blue-100 bg-blue-100 rounded-lg">
                    <TouchableOpacity
                        onPress={() => setCollapsed(!collapsed)}
                        className="p-2 flex flex-row gap-5 justify-center text-center items-center">
                        <Text className="text-lg font-bold dark:text-white">Filtros</Text>
                        <Ionicons
                            name={collapsed ? 'chevron-down' : 'chevron-up'}
                            size={25}
                            color={colorScheme === 'dark' ? '#fff' : '#000'}
                        />
                    </TouchableOpacity>

                    {collapsed && (
                        <View>
                            <View className="dark:bg-slate-800 bg-blue-100 rounded-lg">
                                <Picker
                                    selectedValue={selectedVersion}
                                    onValueChange={(itemValue: string) => setSelectedVersion(itemValue)}
                                    style={{ color: colorScheme === 'dark' ? '#fff' : '#000' }}
                                    dropdownIconColor={colorScheme === 'dark' ? '#fff' : '#000'}>
                                    {versions.map((v) => (
                                        <Picker.Item key={v.version} label={v.label} value={v.version} />
                                    ))}
                                </Picker>
                            </View>

                            <View className="dark:bg-slate-800 bg-blue-100 rounded-lg">
                                <Picker
                                    selectedValue={selectedChapter}
                                    onValueChange={(itemValue: number) => handleChapterChange(itemValue)}
                                    style={{ color: colorScheme === 'dark' ? '#fff' : '#000' }}
                                    dropdownIconColor={colorScheme === 'dark' ? '#fff' : '#000'}>
                                    <Picker.Item label="Selecione o Capítulo" value="" />
                                    {chapters.map((chap) => (
                                        <Picker.Item key={chap} label={`Capítulo ${chap}`} value={chap} />
                                    ))}
                                </Picker>
                            </View>

                            {data?.verses && (selectedChapter || chapter) && (
                                <View className="dark:bg-slate-800 bg-blue-100 rounded-lg">
                                    <Picker
                                        selectedValue={selectedNumber}
                                        onValueChange={(itemValue: number) => setSelectedNumber(itemValue)}
                                        style={{ color: colorScheme === 'dark' ? '#fff' : '#000' }}
                                        dropdownIconColor={colorScheme === 'dark' ? '#fff' : '#000'}>
                                        <Picker.Item label="Selecione o Versículo" value="" />
                                        {data.verses.map((verse) => (
                                            <Picker.Item key={verse.number} label={`Versículo ${verse.number}`} value={verse.number} />
                                        ))}
                                    </Picker>
                                </View>
                            )}
                        </View>
                    )}
                </View>

                {data?.verses && selectedVersion && selectedChapter && selectedBook && (
                    <FlatList
                        ref={flatListRef}
                        data={data.verses}
                        keyExtractor={(item) => item.number.toString()}
                        renderItem={({ item }) => (
                            <View className="p-1">
                                <Text className="text-xl dark:text-white">{item.number} - {item.text}</Text>
                            </View>
                        )}
                        onScrollToIndexFailed={onScrollToIndexFailed}
                        onLayout={() => setIsFlatListReady(true)}
                    />
                )}
            </View>
        </View>
    );
}
