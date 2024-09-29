CREATE TABLE IF NOT EXISTS "testaments" (
    "id"	INTEGER NOT NULL,
    "name"	TEXT NOT NULL,
    "abbrev"	TEXT NOT NULL,
    PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "versions" (
    "id"	INTEGER NOT NULL,
    "name"	TEXT NOT NULL,
    PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "verses" (
    "id"	INTEGER NOT NULL,
    "version"	TEXT NOT NULL,
    "testament"	INTEGER NOT NULL,
    "book"	INTEGER NOT NULL,
    "chapter"	INTEGER NOT NULL,
    "verse"	INTEGER NOT NULL,
    "text"	VARCHAR(75) NOT NULL,
    PRIMARY KEY("id"),
    FOREIGN KEY("book") REFERENCES "books"("id"),
    FOREIGN KEY("version") REFERENCES "versions"("id"),
    FOREIGN KEY("testament") REFERENCES "testaments"("id")
);
CREATE TABLE IF NOT EXISTS "books" (
    "id"	INTEGER NOT NULL,
    "name"	TEXT NOT NULL,
    "abbrev"	TEXT NOT NULL,
    "testament"	INTEGER NOT NULL,
    PRIMARY KEY("id"),
    FOREIGN KEY("testament") REFERENCES "testaments"("id")
);