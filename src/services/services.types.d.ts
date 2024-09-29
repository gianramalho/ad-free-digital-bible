export type booksResponse = {
    abbrev: string,
    chapters: string,
    name: string,
    testament: string,
}

export type searchByWordResponse = {
    occurrence: number,
    version: string,
    verses: VerseSearchByWord[],
}

export type searchByWordResponseNotFound = {
    occurrence: number,
    version: string,
    verses: [],
}

export type VerseSearchByWord = {
    id: number,
    book: {
        abbrev: string,
        name: string,
    },
    chapter: number,
    number: number,
    text: string,
}

export type versionsDataType = {
    id: number
    name: string
    abbrev: string,
}

interface Book {
    abbrev: string;
    name: string;
}

interface Verse {
    id: number;
    number: number;
    text: string;
    isFavorite: boolean,
    note: string,
    highlightColor: string
}

interface ChapterData {
    book: {
        abbrev: string;
        name: string;
        version: string;
    };
    chapter: {
        number: number;
        verses: number;
    };
    verses: Verse[];
}