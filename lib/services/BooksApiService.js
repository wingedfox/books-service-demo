'use strict';

const db = require('../utils').db;
const logger = require('../utils').logger;
const uuid = require('uuid/v4');

function sanitizeSort (str, fields) {
  let sort;
  try {
    sort = JSON.parse(str);
  } catch (ex) {
    sort = []
  }
  return sort.map(s=>{
    if (s.field && s.dir) {
      const f = fields.find(f=>f.toLowerCase()===s.field.toLowerCase());
      const d = ['asc','desc'].find(d=>d===s.dir.toLowerCase());
      if (f && d) {
        return `\`${f}\` ${d}`;
      }
    }
  }).filter(s=>!!s);
}

/**
 * Retrieve Books
 *
 * returns object
 **/
exports.BookListRetrieve = async function({limit=10, offset=0, sort='[{"field":"title","dir":"asc"}]'}) {
  logger.info('[BooksApiService::BookListRetrieve] Retrieve books', {params: {limit, offset, sort}});
  sort = sanitizeSort(sort, ['title', 'date', 'name']);
  const data = await db.raw(`SELECT b.id,
                                b.title,
                                b.date,
                                a.name,
                                a.id authorid
                           FROM books b
                      LEFT JOIN books_authors ba
                             ON b.id = ba.book_id
                           JOIN authors a
                             ON ba.author_id = a.id` + (sort.length ? `
                       ORDER BY ` + sort.join(',') : ``) + `
                          LIMIT :limit OFFSET :offset`, {limit: parseInt(limit), offset: parseInt(offset)});

  const count = (await db.raw(`SELECT count(b.id) as count FROM books b`))[0][0].count;

  const result = Object.values(data[0].reduce((p, c) => {
      if (!p[c.id]) {
        p[c.id] = {
          id: c.id,
          name: c.title,
          date: c.date,
          authors: []
        }
      }
      if (c.name) {
        p[c.id].authors.push({
          name: c.name,
          id: c.authorid
        });
      }

      return p;
    }, {}));

  logger.debug('[BooksApiService::BookListRetrieve] Retrieved books', {count: result.length});

  return {
    list: result,
    limit,
    offset,
    count
  };
}


/**
 * Retrieve Book
 *
 * returns object
 **/
exports.BookRetrieve = async function({id}) {
  logger.info('[BooksApiService::BookRetrieve] Retrieve book', {params: {id}});

  const data = await db.raw(`SELECT b.id,
                                b.title,
                                b.date,
                                a.name,
                                a.id authorid
                           FROM books b
                      LEFT JOIN books_authors ba
                             ON b.id = ba.book_id
                           JOIN authors a
                             ON ba.author_id = a.id
                          WHERE b.id = :book_id`, { book_id: id });

  const result = Object.values(data[0].reduce((p, c) => {
      if (!p[c.id]) {
        p[c.id] = {
          id: c.id,
          name: c.title,
          date: c.date,
          authors: []
        }
      }

      if (c.name) {
        p[c.id].authors.push({
          name: c.name,
          id: c.authorid
        });
      }

      return p;
    }, {}));

  if (result.length) {
    logger.debug('[BooksApiService::BookRetrieve] Retrieved book');

    return result[0];
  } else {
    logger.warn('[BooksApiService::BookRetrieve] book not found', {id});

    // TODO: proper errors required
    throw new Error('NOT_FOUND');
  }
}


/**
 * Creates Book
 *
 * returns object
 **/
exports.BookCreate = async function({body}) {
  logger.info('[BooksApiService::BookCreate] Create book', {params: {body}});

  body.id = uuid();
  await db.raw(`INSERT INTO books (id, title, date) values (:id, :title, :date)`, body);

  for (let author of body.authors) {
    await db.raw(`INSERT INTO books_authors (book_id, author_id) values (:book_id, :author_id)`, {book_id: body.id, author_id: author});
  }

  return exports.BookRetrieve(body);
}

/**
 * Updates Book
 *
 * returns object
 **/
exports.BookUpdate = async function({id, body}) {
  logger.info('[BooksApiService::BookUpdate] Update book', {params: {body}});
  body.id = id;

  await db.raw(`UPDATE books SET title=:title, date=:date`, body);

  await db.raw(`DELETE FROM books_authors WHERE book_id = :id`, {id});
  for (let author of body.authors) {
    await db.raw(`INSERT INTO books_authors (book_id, author_id) values (:book_id, :author_id)`, {book_id: body.id, author_id: author});
  }

  return exports.BookRetrieve(body);
}

