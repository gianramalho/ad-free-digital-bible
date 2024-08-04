import ApiService from "@/services/apiService"

const apiService = new ApiService();
const basePath = apiService.getBasePath();

interface Filters {
    [key: string]: string | number | string[] | undefined;
}

async function getBooks() {
    try {
        const headers = await apiService.getHeaderApi();
        const response = await fetch(`${basePath}/books`, {
            headers: headers,
        });
        const responseData = await response.json();

        if (responseData) {
            const books: booksResponse[] = responseData.map((book: any) => ({
                abbrev: book.abbrev,
                author: book.author,
                chapters: book.chapters,
                group: book.group,
                name: book.name,
                testament: book.testament,
                version: book.version
            }));

            return books;
        } else {
            console.error('Erro ao buscar Livros: Dados inválidos');
            return [];
        }
    } catch (error) {
        console.error('Erro ao buscar Livros:', error);
        return [];
    }
}

async function getBookDetails(abbrev: string) {
    try {
        const headers = await apiService.getHeaderApi();
        const response = await fetch(`${basePath}/books/${abbrev}`, {
            headers: headers,
        });
        const responseData = await response.json();

        if (responseData) {
            const book = responseData

            return book;
        } else {
            console.error('Erro ao buscar Livros: Dados inválidos');
            return [];
        }
    } catch (error) {
        console.error('Erro ao buscar Livros:', error);
        return [];
    }
}

async function getChapterData(version: string, abbrev: string, chapter: number) {
    try {
        const headers = await apiService.getHeaderApi();
        const response = await fetch(`${basePath}/verses/${version}/${abbrev}/${chapter}`, {
            headers: headers,
        });
        const responseData = await response.json();

        if (responseData) {
            const book = responseData

            return book;
        } else {
            console.error('Erro ao buscar Capítulo: Dados inválidos');
            return [];
        }
    } catch (error) {
        console.error('Erro ao buscar Capítulo:', error);
        return [];
    }
}

export { getBooks, getBookDetails, getChapterData }
  