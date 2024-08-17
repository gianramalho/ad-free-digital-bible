import { View, TextInput, Button, ScrollView, Text } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from "react";
import { services } from "@/services";
import { VerseItemSearch } from "@/components/verseItemSearch";
import { Loading } from "@/components/loading";
import { useColorScheme } from "nativewind";

export default function SearchScreen() {
    const [version, setVersion] = useState<string>('nvi');
    const [versions] = useState<versionsResponse[]>([
        { label: 'ACF - Almeida Corrigida Fiel', version: 'acf' },
        { label: 'NVI - Nova Versão Internacional', version: 'nvi' },
        { label: 'ARA - Almeida Revista e Atualizada', version: 'ra' }
    ]);
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<searchByWordResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { colorScheme } = useColorScheme();

    const handleSearch = () => {
        setIsLoading(true);
        services.verses.searchByWord(version, searchTerm)
            .then(setResults)
            .catch(error => {
                console.error("Erro ao buscar versículos:", error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <View className="flex-1 bg-stone-50 dark:bg-slate-800">
            <View className="flex-1 mt-14 px-1">
                <View className="gap-5 p-6">
                    <View className="dark:bg-slate-800 dark:border dark:border-blue-100 bg-blue-100 rounded-lg">
                        <Picker
                            selectedValue={version}
                            onValueChange={(itemValue) => setVersion(itemValue)}
                            style={{ color: colorScheme === 'dark' ? '#fff' : '#000' }}
                            dropdownIconColor={colorScheme === 'dark' ? '#fff' : '#000'}>
                            {versions.map((v) => (
                                <Picker.Item key={v.version} label={v.label} value={v.version} />
                            ))}
                        </Picker>
                    </View>

                    <TextInput className="border border-gray-300 rounded-lg p-3 bg-blue-100 dark:bg-slate-800 dark:text-white"
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                        placeholder="Digite o termo que deseja buscar!"
                        placeholderTextColor={colorScheme === 'dark' ? '#fff' : '#000'}
                    />
                    <Button title="Buscar" onPress={handleSearch} />
                </View>

                {results && (
                    <Text className="mt-4 text-xs dark:text-white">
                        {`Quantidade de ocorrências: ${results.occurrence}`}
                    </Text>
                )}

                {results && (
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                    >
                        {results.verses.map((item) => (
                            <VerseItemSearch
                                key={`${item.book.abbrev.pt}-${item.chapter}-${item.number}`}
                                verse={item}
                                version={version}
                            />
                        ))}
                    </ScrollView>
                )}
            </View>
        </View>
    );
}