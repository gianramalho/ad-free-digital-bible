import { useToast } from "react-native-toast-notifications";
import { searchByWordResponse } from "./services.types";
import { useSQLiteContext } from "expo-sqlite";

type VerseSearchByWordResponse = {
    id: number;
    book_abbrev: string;
    book_name: string;
    book_version: string;
    chapter_number: number;
    verse_number: number;
    verse_text: string;
};

export function VersesServices() {
    const database = useSQLiteContext()
    const toast = useToast();

    async function searchByWord(version: string, searchTerm: string): Promise<searchByWordResponse | null> {
        try {
            const query = `
                WITH filtered_versions AS (
                    SELECT id 
                    FROM versions 
                    WHERE abbrev = ?
                )
                SELECT 
                    verses_fts.id AS id,
                    books.abbrev AS book_abbrev,
                    books.name AS book_name,
                    verses_fts.version AS book_version,
                    verses_fts.chapter AS chapter_number,
                    verses_fts.verse AS verse_number,
                    verses_fts.text AS verse_text
                FROM verses_fts
                JOIN books ON verses_fts.book = books.id
                JOIN filtered_versions fv ON verses_fts.version = fv.id
                WHERE verses_fts.text MATCH ?;
            `;

            const response = await database.getAllAsync<VerseSearchByWordResponse>(query, [version, searchTerm]);

            if (response.length === 0) {
                const result: searchByWordResponse = {
                    occurrence: response.length,
                    version: version,
                    verses: [],
                };

                return result;
            }

            const result: searchByWordResponse = {
                occurrence: response.length,
                version: version,
                verses: response.map((verse) => ({
                    id: verse.id,
                    book: {
                        abbrev: verse.book_abbrev,
                        name: verse.book_name,
                    },
                    chapter: verse.chapter_number,
                    number: verse.verse_number,
                    text: verse.verse_text,
                })),
            };

            return result;

        } catch (error) {
            console.error('Erro ao buscar versões:', error);
            return null;
        }
    }

    async function saveFavoritesVerses(versesIds: Array<number>, color: string) {
        if (color === "remove") {
            return removeFavoritesVerses(versesIds);
        }

        const checkStatement = 'SELECT verse_id FROM actions WHERE verse_id = $verseId'

        const insertStatement = await database.prepareAsync(
            'INSERT INTO actions (verse_id, is_favorite, highlight_color) VALUES ($verseId, $isFavorite, $color)'
        );

        const updateStatement = await database.prepareAsync(
            'UPDATE actions SET highlight_color = $color, is_favorite = 1 WHERE verse_id = $verseId'
        );

        try {
            for (const verseId of versesIds) {
                const result = await database.getFirstAsync<{ verse_id: number }>(checkStatement, [verseId]);

                if (result) {
                    await updateStatement.executeAsync({ $verseId: verseId, $color: color });
                } else {
                    await insertStatement.executeAsync({ $verseId: verseId, $isFavorite: true, $color: color });
                }
            }

            toast.show('Versículo(s) atualizado(s) com sucesso!', {
                type: 'success',
                placement: 'bottom',
                duration: 3000,
                animationType: 'slide-in',
            });

        } catch (error) {
            console.error('Erro ao atualizar favoritos:', error);
        } finally {
            await insertStatement.finalizeAsync();
            await updateStatement.finalizeAsync();
        }
    }

    async function removeFavoritesVerses(versesIds: Array<number>) {
        const statement = await database.prepareAsync(
            'UPDATE actions SET highlight_color = "", is_favorite = 0 WHERE verse_id = $verseId'
        );

        try {
            for (const verseId of versesIds) {
                await statement.executeAsync({ $verseId: verseId });
            }

            toast.show('Versículo(s) removido(s) com sucesso!', {
                type: 'success',
                placement: 'bottom',
                duration: 3000,
                animationType: 'slide-in',
            });
        } catch (error) {
            console.error('Erro ao remover favoritos:', error);
        } finally {
            await statement.finalizeAsync();
        }
    }

    async function getMinSelectedVerse(versesIds: Array<number>): Promise<{ id: number, version: number, testament: number, book: number, chapter: number, verse: number, text: string } | null> {
        if (versesIds.length === 0) {
            return null;
        }

        try {
            const verseId = Math.min(...versesIds);

            const query = `
                SELECT 
                verses.id AS id,
                versions.abbrev AS version,
                books.name AS book,
                verses.chapter AS chapter,
                verses.verse AS verse,
                verses.text AS text
                FROM verses
                JOIN versions ON verses.version = versions.id
                JOIN books ON verses.book = books.id
                WHERE verses.id = $verseId
            `;

            const response = await database.getFirstAsync<{ id: number, version: number, testament: number, book: number, chapter: number, verse: number, text: string }>(query, verseId);

            return response || null;

        } catch (error) {
            console.error('Erro ao buscar versículo:', error);
            return null;
        }
    }

    async function getNotesVerses(versesIds: Array<number>): Promise<{ verse_id: number, is_favorite: boolean, highlight_color: string, note: string } | null> {
        if (versesIds.length === 0) {
            return null;
        }

        try {
            const verseId = Math.min(...versesIds);

            const query = `
                SELECT id,
                    verse_id,
                    is_favorite,
                    highlight_color,
                    note
                FROM actions
                WHERE verse_id = $verseId;
            `;

            const response = await database.getFirstAsync<{ verse_id: number, is_favorite: boolean, highlight_color: string, note: string }>(query, verseId);

            return response || null;

        } catch (error) {
            console.error('Erro ao buscar notas dos versículos:', error);
            return null;
        }
    }

    async function saveNoteForVerse(versesIds: Array<number>, note: string) {
        const checkStatement = 'SELECT verse_id FROM actions WHERE verse_id = $verseId';

        const insertStatement = await database.prepareAsync(
            'INSERT INTO actions (verse_id, note) VALUES ($verseId, $note)'
        );

        const updateStatement = await database.prepareAsync(
            'UPDATE actions SET note = $note WHERE verse_id = $verseId'
        );

        try {
            const verseId = Math.min(...versesIds);

            const result = await database.getFirstAsync<{ verse_id: number }>(checkStatement, [verseId]);
            if (result) {
                await updateStatement.executeAsync({ $verseId: verseId, $note: note });
            } else {
                await insertStatement.executeAsync({ $verseId: verseId, $note: note });
            }

            toast.show('Nota adicionada com sucesso!', {
                type: 'success',
                placement: 'bottom',
                duration: 3000,
                animationType: 'slide-in',
            });

        } catch (error) {
            console.error('Erro ao atualizar nota:', error);
        } finally {
            await insertStatement.finalizeAsync();
            await updateStatement.finalizeAsync();
        }
    }

    async function removeNoteForVerse(versesIds: Array<number>) {
        const statement = await database.prepareAsync(
            'UPDATE actions SET note = "" WHERE verse_id = $verseId'
        );

        try {
            for (const verseId of versesIds) {
                await statement.executeAsync({ $verseId: verseId });
            }

            toast.show('Notas removidas com sucesso!', {
                type: 'success',
                placement: 'bottom',
                duration: 3000,
                animationType: 'slide-in',
            });
        } catch (error) {
            console.error('Erro ao remover notas:', error);
        } finally {
            await statement.finalizeAsync();
        }
    }

    async function getMyFavoriteVerses(): Promise<Array<{ verse_id: number, is_favorite: boolean, highlight_color: string, note: string, version: string, book: string, chapter: string, verse: string, text: string }>> {
        try {
            const query = `
                SELECT actions.verse_id,
                       actions.is_favorite,
                       actions.highlight_color,
                       actions.note,
                       versions.abbrev AS version,
                       books.name AS book,
                       verses.chapter AS chapter,
                       verses.verse AS verse,
                       verses.text AS text
                       FROM actions
                       JOIN verses ON verses.ID = actions.verse_id
                       JOIN versions ON verses.version = versions.id
                       JOIN books ON verses.book = books.id;
            `;

            const response = await database.getAllAsync<{ verse_id: number, is_favorite: boolean, highlight_color: string, note: string, version: string, book: string, chapter: string, verse: string, text: string }>(query);

            return response;

        } catch (error) {
            console.error('Erro ao buscar notas dos versículos:', error);
            return [];
        }
    }

    async function getQueryPlan(versionAbbrev: string, searchTerm: string) {
        try {
            const queryPlan = `
                EXPLAIN QUERY PLAN
                WITH filtered_versions AS (
                    SELECT id 
                    FROM versions 
                    WHERE abbrev = ?
                )
                SELECT 
                    verses_fts.id AS id,
                    books.abbrev AS book_abbrev,
                    books.name AS book_name,
                    verses_fts.version AS book_version,
                    verses_fts.chapter AS chapter_number,
                    verses_fts.verse AS verse_number,
                    verses_fts.text AS verse_text
                FROM verses_fts
                JOIN books ON verses_fts.book = books.id
                JOIN filtered_versions fv ON verses_fts.version = fv.id
                WHERE verses_fts.text MATCH ?;
            `;
    
            const planResponse = await database.getAllAsync(queryPlan, [versionAbbrev, searchTerm]);
    
            console.log('Query Plan:', planResponse);
            return planResponse;
    
        } catch (error) {
            console.error('Erro ao obter o plano de consulta:', error);
        }
    }

    return { searchByWord, saveFavoritesVerses, getMinSelectedVerse, getNotesVerses, saveNoteForVerse, removeNoteForVerse, getMyFavoriteVerses, getQueryPlan }
}
