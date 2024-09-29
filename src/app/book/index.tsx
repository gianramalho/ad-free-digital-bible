import { FlatList, Share, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useRef, useEffect, useState, useLayoutEffect } from "react";
import { Picker } from '@react-native-picker/picker';
import { useColorScheme } from "nativewind";
import { useLoading } from "@/contexts/loadingContext";
import { Book, ChapterData, Verse, booksResponse, versionsDataType } from "@/services/services.types";
import { VersionsServices } from "@/services/versionsServices";
import { BooksServices } from "@/services/booksServices";
import { VerseItem } from "@/components/verseItem";
import { VerseActionModal } from "@/components/verseActionModal";
import { Ionicons } from "@expo/vector-icons";
import { VersesServices } from "@/services/versesServices";

export default function BookDetail() {
    const booksServices = BooksServices()
    const versionsServices = VersionsServices()
    const versesServices = VersesServices()
    const params = useLocalSearchParams<{ version: any, abbrev: any, chapter: any, number: any }>();
    const version = params.version;
    const abbrev = params.abbrev;
    const chapter = params.chapter;
    const number = params.number;
    const { colorScheme } = useColorScheme();
    const [selectedVersion, setSelectedVersion] = useState<string>(version || 'nvi');
    const [selectedChapter, setSelectedChapter] = useState<number | undefined>(chapter ? parseInt(chapter) : undefined);
    const [selectedNumber, setSelectedNumber] = useState<number | undefined>(number ? parseInt(number) : undefined);
    const [selectedBook, setSelectedBook] = useState<string>(abbrev || '');
    const [books, setBooks] = useState<booksResponse[]>([]);
    const flatListRef = useRef<FlatList<Verse>>(null);
    const { setIsLoading } = useLoading();
    const [book, setBook] = useState<Book | null>();
    const [data, setData] = useState<ChapterData | null>(null);
    const [chapters, setChapters] = useState<number[]>([]);
    const [versions, setVersions] = useState<versionsDataType[]>([]);
    const [isFlatListReady, setIsFlatListReady] = useState(false);
    const isFromSearch = !!chapter && !!number;
    const iconColor = colorScheme === "dark" ? "#fff" : "#000";
    const [selectedVerses, setSelectedVerses] = useState<number[]>([]);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const colorsHighlight = ['bg-blue-400', 'bg-green-400', 'bg-red-400', 'bg-purple-400'];
    const [note, setNote] = useState<string>('');
    const [verse, setVerse] = useState<{ id: number, version: number, testament: number, book: number, chapter: number, verse: number, text: string } | null>(null);
    const colorMapping: Record<'bg-blue-400' | 'bg-green-400' | 'bg-red-400' | 'bg-purple-400', string> = {
        'bg-blue-400': 'azul',
        'bg-green-400': 'verde',
        'bg-red-400': 'vermelho',
        'bg-purple-400': 'roxo',
      };
      
      const colors: Array<keyof typeof colorMapping> = Object.keys(colorMapping) as Array<keyof typeof colorMapping>;
      
    const toggleSelection = (verseNumber: number) => {
        if (selectedVerses.includes(verseNumber)) {
            setSelectedVerses(selectedVerses.filter((num) => num !== verseNumber));
        } else {
            setSelectedVerses([...selectedVerses, verseNumber]);
        }
    };

    const handleSaveFavorites = async (color: string) => {
        setIsLoading(true);

        try {
            await versesServices.saveFavoritesVerses(selectedVerses, color);
            setSelectedVerses([]);

            if (selectedVersion && selectedBook && selectedChapter) {
                const updatedChapterData = await booksServices.showChapterDetails(selectedVersion, selectedBook, selectedChapter);
                setData(updatedChapterData);
            }
        } catch (error) {
            console.error('Erro ao salvar favoritos:', error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleShareVerses = async (selectedVerses: number[]) => {
        try {
            if (!data || !data.verses.length) return;

            const versesText = selectedVerses
                .map(verseId => {
                    const verse = data.verses.find(v => v.id === verseId);
                    if (verse) {
                        return `${verse.number} ${verse.text}`;
                    }
                    return '';
                })
                .filter(text => text.length > 0)
                .join('\n');

            const fullText = `${book?.name} ${data.chapter.number} - ${selectedVersion.toUpperCase()}\n\n${versesText}`;

            await Share.share({
                message: fullText
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const handleAddNote = async () => {
        const existingNotes = await versesServices.getNotesVerses(selectedVerses);
        const note = existingNotes?.note || '';
        const minSelectedVerse = await versesServices.getMinSelectedVerse(selectedVerses);

        setNote(note);
        setVerse(minSelectedVerse);
        setModalVisible(true);
    };

    const handleSaveNote = async (note: string) => {
        setIsLoading(true);
        try {
            await versesServices.saveNoteForVerse(selectedVerses, note);
            setSelectedVerses([]);
            setNote('');
            setModalVisible(false);
            if (selectedVersion && selectedBook && selectedChapter) {
                const updatedChapterData = await booksServices.showChapterDetails(selectedVersion, selectedBook, selectedChapter);
                setData(updatedChapterData);
            }
        } catch (error) {
            console.error('Erro ao salvar nota:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveNote = async () => {
        try {
            await versesServices.removeNoteForVerse(selectedVerses);
            setSelectedVerses([]);
            setNote('');
            setModalVisible(false);
            if (selectedVersion && selectedBook && selectedChapter) {
                const updatedChapterData = await booksServices.showChapterDetails(selectedVersion, selectedBook, selectedChapter);
                setData(updatedChapterData);
            }
        } catch (error) {
            console.error('Erro ao remover nota:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const booksResponse = await booksServices.list();
                setBooks(booksResponse);

                if (selectedBook) {
                    const bookResponse = await booksServices.showBookDetails(selectedBook);
                    if (bookResponse) {
                        const numberOfChapters = Number(bookResponse.chapters);
                        if (!isNaN(numberOfChapters)) {
                            setChapters(Array.from({ length: numberOfChapters }, (_, i) => i + 1));
                        }
                        setBook(bookResponse);
                    }
                    if (selectedChapter) {
                        const chapterData = await booksServices.showChapterDetails(selectedVersion, selectedBook, selectedChapter);
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

    useEffect(() => {
        const fetchVersions = async () => {
            try {
                setIsLoading(true);
                const versionsData = await versionsServices.list();
                setVersions(versionsData);
            } catch (error) {
                console.error('Erro ao carregar versões:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchVersions();
    }, []);

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
        try {
            setIsLoading(true);
            setSelectedChapter(itemValue);
            setSelectedNumber(undefined);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBookChange = (itemValue: string) => {
        setSelectedBook(itemValue);
        setSelectedChapter(undefined);
        setSelectedNumber(undefined);
    };

    const handleVersionChange = (itemValue: string) => {
        try {
            setIsLoading(true);
            setSelectedVersion(itemValue);

        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!isFromSearch) {
            if (!selectedChapter) {
                setSelectedChapter(1);
                setSelectedNumber(undefined);
            }
        }
    }, [selectedBook]);

    return (
        <View className="flex-1 bg-stone-100 dark:bg-slate-800">
            <View className="bg-blue-100 dark:bg-slate-800 dark:text-white w-full">
                <View className="w-full">
                    <Picker
                        selectedValue={selectedVersion}
                        onValueChange={(itemValue: string) => handleVersionChange(itemValue)}
                        style={{ color: iconColor, width: '100%' }}
                        dropdownIconColor={iconColor}>
                        {versions.map((v) => (
                            <Picker.Item key={v.abbrev} label={v.name} value={v.abbrev} />
                        ))}
                    </Picker>
                </View>
                <View className="flex flex-row justify-between w-full">
                    <View className="w-1/3">
                        <Picker
                            selectedValue={selectedBook}
                            onValueChange={handleBookChange}
                            style={{ color: iconColor, width: '100%' }}
                            dropdownIconColor={iconColor}>
                            {books.map((book) => (
                                <Picker.Item key={book.abbrev} label={book.name} value={book.abbrev} />
                            ))}
                        </Picker>
                    </View>
                    <View className="flex flex-row w-2/3">
                        <View className={`flex-1 ${selectedChapter || chapter ? 'w-1/2' : 'w-full'}`}>
                            <Picker
                                selectedValue={selectedChapter}
                                onValueChange={(itemValue: number) => handleChapterChange(itemValue)}
                                style={{ color: iconColor, width: '100%' }}
                                dropdownIconColor={iconColor}>
                                <Picker.Item label="Capítulo" value="" />
                                {chapters.map((chap) => (
                                    <Picker.Item key={chap} label={`${chap}`} value={chap} />
                                ))}
                            </Picker>
                        </View>
                        {data?.verses && (selectedChapter || chapter) && (
                            <View className="w-1/2">
                                <Picker
                                    selectedValue={selectedNumber}
                                    onValueChange={(itemValue: number) => setSelectedNumber(itemValue)}
                                    style={{ color: iconColor, width: '100%' }}
                                    dropdownIconColor={iconColor}>
                                    <Picker.Item label={selectedNumber || number ? "Versículo" : "Vers."} value="" />
                                    {data.verses.map((verse) => (
                                        <Picker.Item key={verse.number} label={`${verse.number}`} value={verse.number} />
                                    ))}
                                </Picker>
                            </View>
                        )}
                    </View>
                </View>
            </View>
            <View className="flex-1 px-6 gap-5">
                {data?.verses && selectedVersion && selectedChapter && selectedBook && (
                    <FlatList
                        ref={flatListRef}
                        data={data.verses}
                        keyExtractor={(item) => item.number.toString()}
                        renderItem={({ item }) => (
                            <VerseItem
                                verse={item}
                                isSelected={selectedVerses.includes(item.id)}
                                onSelect={() => toggleSelection(item.id)}
                            />
                        )}
                        onScrollToIndexFailed={onScrollToIndexFailed}
                        onLayout={() => setIsFlatListReady(true)}
                    />
                )}
            </View>

            {selectedVerses.length > 0 && (
                <View className="p-4 dark:bg-slate-900 bg-stone-100 border border-gray-300 rounded-t-lg gap-5">
                    <View className="flex-row justify-around px-10">
                        <TouchableOpacity
                            key={"remove"}
                            onPress={() => handleSaveFavorites("remove")}
                            className="flex-row items-center justify-center w-8 h-8 rounded-full bg-black">
                            <Ionicons name="trash" size={20} color="#fff" />
                        </TouchableOpacity>
                        {colors.map((color) => (
                            <TouchableOpacity
                                accessibilityLabel={`Botão de cor ${colorMapping[color]}`}
                                key={color}
                                onPress={() => handleSaveFavorites(color)}
                                className={`w-8 h-8 rounded-full ${color}`}
                            />
                        ))}
                    </View>
                    <View className="w-full border-t border-t-gray-200"></View>
                    <View className="flex-row justify-around">
                        <TouchableOpacity onPress={() => handleShareVerses(selectedVerses)}
                            className="flex-row items-center justify-center p-4 bg-blue-500 dark:bg-blue-800 rounded-lg">
                            <Ionicons name="share-social" size={20} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleAddNote()} className="flex-row items-center justify-center p-4 bg-blue-500 dark:bg-blue-800 rounded-lg">
                            <Ionicons name="pencil" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            <VerseActionModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSave={handleSaveNote}
                onRemove={handleRemoveNote}
                initialNote={note}
                verse={verse}
            />
        </View>
    );
}