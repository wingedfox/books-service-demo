'use strict';
const path = require('path');
const fs = require('fs');
const faker = require('faker');

const migration_up = path.format({dir: path.join(__dirname, 'ddl/up'), name: path.basename(__filename, '.js'), ext: '.sql'});
const migration_down = path.format({dir: path.join(__dirname, 'ddl/down'), name: path.basename(__filename, '.js'), ext: '.sql'});

exports.up = async function(knex, Promise) {
  const migrations = fs.readFileSync(migration_up, 'utf-8').split(/;\s+/mg)
  for (let migration of migrations) {
    await knex.raw(migration);
  }
  const [authors, books] = await Promise.all([
      seed_authors(knex),
      seed_books(knex)
    ]);
  const links = seed_links(knex, authors, books);
  return links;
// seed_images(knex)
};

exports.down = async function(knex, Promise) {
  const migrations = fs.readFileSync(migration_down, 'utf-8').split(/;\s+/mg);
  const res = [];
  for (let migration of migrations) {
    res.push(await knex.raw(migration));
  }
  return Promise.all(res);
};

async function seed_authors (knex) {
  const authors = [];
  while (authors.length < 2e2) {
    authors.push({
      id: faker.random.uuid(),
      name: faker.name.findName()
    });
  }
  return await knex('authors').insert(authors).returning('id');
}

async function seed_books (knex) {
  const books = [];
  while (books.length < 2e3) {
    books.push({
      id: faker.random.uuid(),
      title: faker.lorem.sentence(),
      date: faker.date.past(Math.round(Math.random()*40)),
      description: faker.lorem.paragraph()
    });
  }
  return await knex('books').insert(books).returning('id');
}

async function seed_links (knex, authors, books) {
  authors = await knex.raw(`SELECT id FROM authors`);
  books = await knex.raw(`SELECT id FROM books`);

  const links = [];
  for (let book of books[0]) {
    links.push({
      book_id: book.id,
      author_id: faker.random.arrayElement(authors[0]).id
    })
  }

  return await knex('books_authors').insert(links).returning('id').then(() => books);
}

function seed_images () {
  return null;
}
