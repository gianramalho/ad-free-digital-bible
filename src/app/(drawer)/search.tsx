import { View, TextInput, ScrollView, Text, Keyboard } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from "react";
import { VerseItemSearch } from "@/components/verseItemSearch";
import { useLoading } from "@/contexts/loadingContext";
import { searchByWordResponse, versionsDataType } from "@/services/services.types";
import { VersionsServices } from "@/services/versionsServices";
import { Button } from "@/components/Button";
import { VersesServices } from "@/services/versesServices";
import { useTheme } from "@/providers/themeProvider";
import { useToast } from "react-native-toast-notifications";

export default function SearchScreen() {
    const versionsServices = VersionsServices();
    const versesServices = VersesServices();
    const [version, setVersion] = useState<string>('nvi');
    const [versions, setVersions] = useState<versionsDataType[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<searchByWordResponse | null>(null);
    const { setIsLoading } = useLoading();
    const { colorScheme } = useTheme();
    const toast = useToast();

    const handleSearch = async () => {
        if (searchTerm.trim() === '') {
            toast.show('Por favor, digite um termo para buscar.', {
                type: 'normal',
                placement: 'bottom',
                duration: 3000,
                animationType: 'slide-in',
            });
            return;
        }

        Keyboard.dismiss();

        try {
            setIsLoading(true);
            const versesData = await versesServices.searchByWord(version, searchTerm);
            setResults(versesData);
        } catch (error) {
            console.error("Erro ao buscar versículos:", error);
        } finally {
            setIsLoading(false);
        }
    };

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

    return (
        <View className="flex-1 bg-stone-100 dark:bg-slate-800">
            <View className="flex-1 px-1">
                <View className="gap-5 px-6">
                    <View className="dark:bg-slate-800 dark:border dark:border-blue-100 bg-white rounded-lg  border border-blue-300">
                        <Picker
                            selectedValue={version}
                            onValueChange={(itemValue) => setVersion(itemValue)}
                            style={{ color: colorScheme === 'dark' ? '#fff' : '#000' }}
                            dropdownIconColor={colorScheme === 'dark' ? '#fff' : '#000'}>
                            {versions.map((v) => (
                                <Picker.Item key={v.abbrev} label={v.name} value={v.abbrev} />
                            ))}
                        </Picker>
                    </View>

                    <TextInput className="rounded-lg p-4 bg-white dark:bg-slate-800 dark:text-white border border-blue-300"
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                        placeholder="Digite o termo que deseja buscar!"
                        placeholderTextColor={colorScheme === 'dark' ? '#fff' : '#000'}
                    />

                    <Button title="Buscar" classButton="p-4 bg-blue-500 dark:bg-blue-800 rounded-lg" classText="text-white text-center text-lg" onPress={handleSearch} />
                </View>

                {results && (
                    <View className="px-6 pt-2 pb-6">
                        <Text className={`dark:text-white text-green-600 text-xs`}>
                            {`Quantidade de ocorrências: ${results.occurrence}`}
                        </Text>
                    </View>
                )}

                {results && (
                    <View className="px-1">
                        <ScrollView showsVerticalScrollIndicator={true} >
                            {results.verses.map((item) => (
                                <VerseItemSearch
                                    key={`${item.book.abbrev}-${item.chapter}-${item.number}-${item.id}`}
                                    verse={item}
                                    version={version}
                                />
                            ))}
                        </ScrollView>
                    </View>
                )}
            </View>
        </View>
    );
}