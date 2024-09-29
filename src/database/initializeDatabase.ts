import { type SQLiteDatabase } from "expo-sqlite";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { insertNvi } from "./insertNvi";
import { insertAcf } from "./insertAcf";
import { insertRa } from "./insertRa";

export async function initializeDatabase(database: SQLiteDatabase) {
    const isDatabaseInitialized = await AsyncStorage.getItem('isDatabaseInitialized');

    if (isDatabaseInitialized) {
        console.log("Database is already initialized.");
        return;
    }

    try {
        await database.execAsync(`
                CREATE TABLE IF NOT EXISTS "testaments" (
                    "id" INTEGER NOT NULL,
                    "name" VARCHAR(75) NOT NULL,
                    "abbrev" VARCHAR(20) NOT NULL,
                    PRIMARY KEY("id")
                );

                CREATE TABLE IF NOT EXISTS "versions" (
                    "id" INTEGER NOT NULL,
                    "name" VARCHAR(75) NOT NULL,
                    "abbrev" VARCHAR(20) NOT NULL,
                    PRIMARY KEY("id")
                );

                CREATE TABLE IF NOT EXISTS "verses" (
                    "id" INTEGER NOT NULL,
                    "version" INTEGER NOT NULL,
                    "testament" INTEGER NOT NULL,
                    "book" INTEGER NOT NULL,
                    "chapter" INTEGER NOT NULL,
                    "verse" INTEGER NOT NULL,
                    "text" TEXT NOT NULL,
                    PRIMARY KEY("id"),
                    FOREIGN KEY("book") REFERENCES "books"("id"),
                    FOREIGN KEY("version") REFERENCES "versions"("id"),
                    FOREIGN KEY("testament") REFERENCES "testaments"("id")
                );
                
                CREATE VIRTUAL TABLE verses_fts USING fts5(
                    id,
                    version,
                    testament,
                    book,
                    chapter,
                    verse,
                    text
                );

                CREATE TABLE IF NOT EXISTS "books" (
                    "id" INTEGER NOT NULL,
                    "name" VARCHAR(100) NOT NULL,
                    "abbrev" VARCHAR(20) NOT NULL,
                    "testament" INTEGER NOT NULL,
                    PRIMARY KEY("id"),
                    FOREIGN KEY("testament") REFERENCES "testaments"("id")
                );

                CREATE TABLE IF NOT EXISTS "actions" (
                    id INTEGER AUTO INCREMENT,
                    "verse_id" INTEGER NOT NULL,
                    "is_favorite" BOOLEAN DEFAULT FALSE,
                    "highlight_color" TEXT NULL,
                    "note" TEXT NULL,
                    PRIMARY KEY("id"),
                    FOREIGN KEY("verse_id") REFERENCES "verses"("id")
                );

                INSERT OR IGNORE INTO "versions" ("id", "name", "abbrev") VALUES (1, 'NVI - Nova Versão Internacional', 'nvi');
                INSERT OR IGNORE INTO "versions" ("id", "name", "abbrev") VALUES (2, 'ACF - Almeida Corrigida Fiel', 'acf');
                INSERT OR IGNORE INTO "versions" ("id", "name", "abbrev") VALUES (3, 'ARA - Almeida Revista e Atualizada', 'ra');

                INSERT OR IGNORE INTO "testaments" ("id","name","abbrev") VALUES (1,'Velho Testamento','VT');
                INSERT OR IGNORE INTO "testaments" ("id","name","abbrev") VALUES (2,'Novo Testamento','NT');

                INSERT OR IGNORE INTO "books" ("id","name","abbrev","testament") VALUES (1,'Gênesis','gn',1);
                INSERT OR IGNORE INTO "books" ("id","name","abbrev","testament") VALUES (2,'Êxodo','ex',1);
                INSERT OR IGNORE INTO "books" ("id","name","abbrev","testament") VALUES (3,'Levítico','lv',1);
                INSERT OR IGNORE INTO "books" ("id","name","abbrev","testament") VALUES (4,'Números','nm',1);
                INSERT OR IGNORE INTO "books" ("id","name","abbrev","testament") VALUES (5,'Deuteronômio','dt',1);
                INSERT OR IGNORE INTO "books" ("id","name","abbrev","testament") VALUES (6,'Josué','js',1);
                INSERT OR IGNORE INTO "books" ("id","name","abbrev","testament") VALUES (7,'Juízes','jz',1);
                INSERT OR IGNORE INTO "books" ("id","name","abbrev","testament") VALUES (8,'Rute','rt',1);
                INSERT OR IGNORE INTO "books" ("id","name","abbrev","testament") VALUES (9,'1º Samuel','1sm',1);
                INSERT OR IGNORE INTO "books" ("id","name","abbrev","testament") VALUES (10,'2º Samuel','2sm',1);
                INSERT OR IGNORE INTO "books" ("id","name","abbrev","testament") VALUES (11,'1º Reis','1rs',1);
                INSERT OR IGNORE INTO "books" ("id","name","abbrev","testament") VALUES (12,'2º Reis','2rs',1);
                INSERT OR IGNORE INTO "books" ("id","name","abbrev","testament") VALUES (13,'1º Crônicas','1cr',1);
                INSERT OR IGNORE INTO "books" ("id","name","abbrev","testament") VALUES (14,'2º Crônicas','2cr',1);
                INSERT OR IGNORE INTO "books" ("id","name","abbrev","testament") VALUES (15,'Esdras','ed',1);
                INSERT OR IGNORE INTO "books" ("id","name","abbrev","testament") VALUES (16,'Neemias','ne',1);
                INSERT OR IGNORE INTO "books" ("id","name","abbrev","testament") VALUES (17,'Ester','et',1);
                INSERT OR IGNORE INTO "books" ("id","name","abbrev","testament") VALUES (18,'Jó','jo',1);
                INSERT OR IGNORE INTO "books" ("id","name","abbrev","testament") VALUES (19,'Salmos','sl',1);
                INSERT OR IGNORE INTO "books" ("id","name","abbrev","testament") VALUES (20,'Provérbios','pv',1);
                INSERT OR IGNORE INTO "books" ("id","name","abbrev","testament") VALUES (21,'Eclesiastes','ec',1);
                INSERT OR IGNORE INTO "books" ("id","name","abbrev","testament") VALUES (22,'Cânticos','ct',1);
                INSERT OR IGNORE INTO "books" ("id","name","abbrev","testament") VALUES (23,'Isaías','is',1);
                INSERT OR IGNORE INTO "books" ("id","name","abbrev","testament") VALUES (24,'Jeremias','jr',1);
                INSERT OR IGNORE INTO "books" ("id","name","abbrev","testament") VALUES (25,'Lamentações de Jeremias','lm',1);
                INSERT OR IGNORE INTO "books" ("id","name","abbrev","testament") VALUES (26,'Ezequiel','ez',1);
                INSERT OR IGNORE INTO "books" ("id","name","abbrev","testament") VALUES (27,'Daniel','dn',1);
                INSERT OR IGNORE INTO "books" ("id","name","abbrev","testament") VALUES (28,'Oséias','os',1);
                INSERT OR IGNORE INTO "books" ("id","name","abbrev","testament") VALUES (29,'Joel','jl',1);
                INSERT OR IGNORE INTO "books" ("id","name","abbrev","testament") VALUES (30,'Amós','am',1);
                INSERT OR IGNORE INTO "books" ("id","name","abbrev","testament") VALUES (31,'Obadias','ob',1);
                INSERT OR IGNORE INTO "books" ("id","name","abbrev","testament") VALUES (32,'Jonas','jn',1);
                INSERT OR IGNORE INTO "books" ("id","name","abbrev","testament") VALUES (33,'Miquéias','mq',1);
                INSERT OR IGNORE INTO "books" ("id","name","abbrev","testament") VALUES (34,'Naum','na',1);
                INSERT OR IGNORE INTO "books" ("id","name","abbrev","testament") VALUES (35,'Habacuque','hc',1);
                INSERT OR IGNORE INTO "books" ("id","name","abbrev","testament") VALUES (36,'Sofonias','sf',1);
                INSERT OR IGNORE INTO "books" ("id","name","abbrev","testament") VALUES (37,'Ageu','ag',1);
                INSERT OR IGNORE INTO "books" ("id","name","abbrev","testament") VALUES (38,'Zacarias','zc',1);
                INSERT OR IGNORE INTO "books" ("id","name","abbrev","testament") VALUES (39,'Malaquias','ml',1);
                INSERT OR IGNORE INTO "books" ("id","name","abbrev","testament") VALUES (40,'Mateus','mt',2);
                INSERT OR IGNORE INTO "books" ("id","name","abbrev","testament") VALUES (41,'Marcos','mc',2);
                INSERT OR IGNORE INTO "books" ("id","name","abbrev","testament") VALUES (42,'Lucas','lc',2);
                INSERT OR IGNORE INTO "books" ("id","name","abbrev","testament") VALUES (43,'João','jo',2);
                INSERT OR IGNORE INTO "books" ("id","name","abbrev","testament") VALUES (44,'Atos','at',2);
                INSERT OR IGNORE INTO "books" ("id","name","abbrev","testament") VALUES (45,'Romanos','rm',2);
                INSERT OR IGNORE INTO "books" ("id","name","abbrev","testament") VALUES (46,'1ª Coríntios','1co',2);
                INSERT OR IGNORE INTO "books" ("id","name","abbrev","testament") VALUES (47,'2ª Coríntios','2co',2);
                INSERT OR IGNORE INTO "books" ("id","name","abbrev","testament") VALUES (48,'Gálatas','gl',2);
                INSERT OR IGNORE INTO "books" ("id","name","abbrev","testament") VALUES (49,'Efésios','ef',2);
                INSERT OR IGNORE INTO "books" ("id","name","abbrev","testament") VALUES (50,'Filipenses','fp',2);
                INSERT OR IGNORE INTO "books" ("id","name","abbrev","testament") VALUES (51,'Colossenses','cl',2);
                INSERT OR IGNORE INTO "books" ("id","name","abbrev","testament") VALUES (52,'1ª Tessalonicenses','1ts',2);
                INSERT OR IGNORE INTO "books" ("id","name","abbrev","testament") VALUES (53,'2ª Tessalonicenses','2ts',2);
                INSERT OR IGNORE INTO "books" ("id","name","abbrev","testament") VALUES (54,'1ª Timóteo','1tm',2);
                INSERT OR IGNORE INTO "books" ("id","name","abbrev","testament") VALUES (55,'2ª Timóteo','2tm',2);
                INSERT OR IGNORE INTO "books" ("id","name","abbrev","testament") VALUES (56,'Tito','tt',2);
                INSERT OR IGNORE INTO "books" ("id","name","abbrev","testament") VALUES (57,'Filemom','fm',2);
                INSERT OR IGNORE INTO "books" ("id","name","abbrev","testament") VALUES (58,'Hebreus','hb',2);
                INSERT OR IGNORE INTO "books" ("id","name","abbrev","testament") VALUES (59,'Tiago','tg',2);
                INSERT OR IGNORE INTO "books" ("id","name","abbrev","testament") VALUES (60,'1ª Pedro','1pe',2);
                INSERT OR IGNORE INTO "books" ("id","name","abbrev","testament") VALUES (61,'2ª Pedro','2pe',2);
                INSERT OR IGNORE INTO "books" ("id","name","abbrev","testament") VALUES (62,'1ª João','1jo',2);
                INSERT OR IGNORE INTO "books" ("id","name","abbrev","testament") VALUES (63,'2ª João','2jo',2);
                INSERT OR IGNORE INTO "books" ("id","name","abbrev","testament") VALUES (64,'3ª João','3jo',2);
                INSERT OR IGNORE INTO "books" ("id","name","abbrev","testament") VALUES (65,'Judas','jd',2);
                INSERT OR IGNORE INTO "books" ("id","name","abbrev","testament") VALUES (66,'Apocalipse','ap',2);

                CREATE INDEX idx_versions_abbrev ON versions(abbrev);
                CREATE INDEX idx_verses_text ON verses(text);
                CREATE INDEX idx_verses_book ON verses(book);
                CREATE INDEX idx_verses_testament ON verses(testament);
                CREATE INDEX idx_verses_version ON verses(version);
                CREATE INDEX idx_books_testament ON books(testament);
                CREATE INDEX idx_versions_id ON versions(id);
                CREATE INDEX idx_testaments_id ON testaments(id);
            `);

        await insertNvi(database);
        await insertAcf(database);
        await insertRa(database);

        await database.execAsync(`
            INSERT INTO verses_fts (id, version, testament, book, chapter, verse, text)
            SELECT id, version, testament, book, chapter, verse, text FROM verses;
        `);

        await AsyncStorage.setItem('isDatabaseInitialized', 'true');

        console.log("Database initialized successfully.");
    } catch (error) {
        console.error("Error initializing database:", error);
        throw error;
    }
}