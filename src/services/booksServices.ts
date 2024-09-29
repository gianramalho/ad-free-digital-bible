import { useSQLiteContext } from "expo-sqlite";
import { ChapterData, booksResponse } from "./services.types";

interface QueryResult {
    book_abbrev: string;
    book_name: string;
    book_version: string;
    chapter_number: number;
    verse_id: number;
    verse_number: number;
    verse_text: string;
    is_favorite: boolean;
    note: string;
    highlight_color: string;
}

export function BooksServices() {
    const database = useSQLiteContext()

    async function list() {
        try {
            const query = `
            SELECT 
                books.abbrev, 
                books.name, 
                testaments.abbrev AS testament, 
                COUNT(DISTINCT verses.chapter) AS chapters 
            FROM books 
            JOIN testaments ON books.testament = testaments.id 
            JOIN verses ON verses.book = books.id                
            GROUP BY books.id, testaments.abbrev;
        `;
            const response = await database.getAllAsync<booksResponse>(query);

            return response;

        } catch (error) {
            console.error('Erro ao buscar Livros:', error);
            return [];
        }
    }

    async function showBookDetails(abbrev: string): Promise<booksResponse | null> {
        try {
            const query = `
                SELECT 
                    books.abbrev, 
                    books.name, 
                    testaments.abbrev AS testament, 
                    COUNT(DISTINCT verses.chapter) AS chapters 
                FROM books 
                JOIN testaments ON books.testament = testaments.id 
                JOIN verses ON verses.book = books.id       
                WHERE books.abbrev = ? 
                GROUP BY books.id, testaments.abbrev;
            `;

            const response = await database.getFirstAsync<booksResponse>(query, [abbrev]);

            return response || null;

        } catch (error) {
            console.error('Erro ao buscar Livros:', error);
            return null;
        }
    }

    async function showChapterDetails(version: string, abbrev: string, chapter: number): Promise<ChapterData | null> {
        try {
            const query = `
            SELECT 
                books.abbrev AS book_abbrev,
                books.name AS book_name,
                verses.version AS book_version,
                verses.chapter AS chapter_number,
                verses.id AS verse_id,
                verses.verse AS verse_number,
                verses.text AS verse_text,
                actions.is_favorite AS is_favorite,
                actions.highlight_color AS highlight_color,
                actions.note AS note
            FROM verses
            JOIN books ON verses.book = books.id
            JOIN versions ON verses.version = versions.id
            LEFT JOIN actions ON verses.id = actions.verse_id
            WHERE versions.abbrev = ? 
              AND books.abbrev = ? 
              AND verses.chapter = ?;
        `;

            const response = await database.getAllAsync<QueryResult>(query, [version, abbrev, chapter]);

            const verses = response.map(row => ({
                id: row.verse_id,
                number: row.verse_number,
                text: row.verse_text,
                isFavorite: row.is_favorite || false,
                note: row.note || '',
                highlightColor: row.highlight_color || ''
            }));

            return {
                book: {
                    abbrev: response[0].book_abbrev,
                    name: response[0].book_name,
                    version: response[0].book_version
                },
                chapter: {
                    number: chapter,
                    verses: verses.length
                },
                verses: verses
            };

        } catch (error) {
            console.error('Erro ao buscar Capítulo:', error);
            return null;
        }
    }

    return { list, showBookDetails, showChapterDetails }
}