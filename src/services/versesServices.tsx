import ApiService from "@/services/apiService"

const apiService = new ApiService();
const basePath = apiService.getBasePath();

async function searchByWord(version: string, searchTerm: string) {
    try {
        const headers = await apiService.getHeaderApi();
        const response = await fetch(`${basePath}/verses/search`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ version: version, search: searchTerm })
        });
        const responseData = await response.json();

        if (isSearchByWordResponse(responseData)) {
            const result: searchByWordResponse = {
                occurrence: responseData.occurrence,
                version: responseData.version,
                verses: responseData.verses.map((verse: any) => ({
                    book: {
                        abbrev: {
                            pt: verse.book.abbrev.pt,
                            en: verse.book.abbrev.en,
                        },
                        author: verse.book.author,
                        chapters: verse.book.chapters,
                        group: verse.book.group,
                        name: verse.book.name,
                        testament: verse.book.testament
                    },
                    chapter: verse.chapter,
                    number: verse.number,
                    text: verse.text,
                })),
            };

            return result;
        } else {
            console.error('Erro ao buscar por palavra: Dados inválidos');
            return {
                occurrence: 0,
                version: '',
                verses: [],
            };;
        }
    } catch (error) {
        console.error('Erro ao buscar por palavra:', error);
        return {
            occurrence: 0,
            version: '',
            verses: [],
        };;
    }
}

function isSearchByWordResponse(data: any): data is searchByWordResponse {
    return data && typeof data === 'object' && !Array.isArray(data) &&
        typeof data.occurrence === 'number' &&
        typeof data.version === 'string' &&
        Array.isArray(data.verses) &&
        data.verses.every(isVerseSearchByWord);
}

function isVerseSearchByWord(data: any): data is VerseSearchByWord {
    return data && typeof data === 'object' &&
        typeof data.book === 'object' &&
        typeof data.book.abbrev === 'object' &&
        typeof data.book.abbrev.pt === 'string' &&
        typeof data.book.abbrev.en === 'string' &&
        typeof data.book.author === 'string' &&
        typeof data.book.chapters === 'number' &&
        typeof data.book.group === 'string' &&
        typeof data.book.name === 'string' &&
        typeof data.book.testament === 'string' &&
        typeof data.chapter === 'number' &&
        typeof data.number === 'number' &&
        typeof data.text === 'string';
}

export { searchByWord }
