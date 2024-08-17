type booksResponse = {
    abbrev: {
        pt: string,
        en: string
    },
    author: string,
    chapters: string,
    comment: string,
    group: string,
    name: string,
    testament: string,
    version: string
}

// {
// 	"abbrev": {
// 		"pt": "gn",
// 		"en": "gn"
// 	},
// 	"author": "Moisés",
// 	"chapters": 50,
// 	"comment": "",
// 	"group": "Pentateuco",
// 	"name": "Gênesis",
// 	"testament": "VT"
// }

type searchByWordResponse = {
    occurrence: number,
    version: string,
    verses: VerseSearchByWord[],
}

type VerseSearchByWord = {
    book: {
        abbrev: {
            pt: string,
            en: string,
        },
        author: string,
        chapters: number,
        group: string,
        name: string,
        testament: string
    },
    chapter: number,
    number: number,
    text: string,
}

type versionsResponse = {
    label: string,
    version: string,
}