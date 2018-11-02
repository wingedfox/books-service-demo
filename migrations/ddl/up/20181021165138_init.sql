#CREATE SCHEMA IF NOT EXISTS `books`;
CREATE TABLE IF NOT EXISTS `books` (
    `id` varchar(36), # uuid
    `title` varchar(250),
    `date` date NOT NULL,
    `description` text,
    `created` timestamp DEFAULT now() NOT NULL,
    PRIMARY KEY( `id` )
);
CREATE TABLE IF NOT EXISTS `authors` (
    `id` varchar(36), # uuid
    `name` varchar(250),
    `created` timestamp DEFAULT now() NOT NULL,
    PRIMARY KEY( `id` )
);
CREATE TABLE IF NOT EXISTS `books_authors` (
    `author_id` varchar(36),
    `book_id` varchar(36),
    FOREIGN KEY ( `author_id` ) REFERENCES authors( `id` ) ON DELETE CASCADE,
    FOREIGN KEY ( `book_id` ) REFERENCES books( `id` ) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS `images` (
    `id` varchar(36), # uuid
    `book_id` varchar(16),
    `url` varchar(250),
    `content` MEDIUMBLOB, # should not be used if other storges available
    `created` timestamp DEFAULT now() NOT NULL,
    PRIMARY KEY ( `id` ),
    FOREIGN KEY ( `book_id` ) REFERENCES books( `id` ) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS authors_name ON authors( `name` );
CREATE INDEX IF NOT EXISTS books_title ON books( `title` );
CREATE INDEX IF NOT EXISTS books_date ON books( `date` );
