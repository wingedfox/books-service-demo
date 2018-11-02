'use strict';
const path = require('path');
const fs = require('fs');

const migration_up = path.format({dir: path.join(__dirname, 'ddl/up'), name: path.basename(__filename, '.js'), ext: '.sql'});
const migration_down = path.format({dir: path.join(__dirname, 'ddl/down'), name: path.basename(__filename, '.js'), ext: '.sql'});

exports.up = async function(knex, Promise) {
  const migrations = fs.readFileSync(migration_up, 'utf-8').split(/;\s+/mg);
  const res = [];
  for (let migration of migrations) {
    res.push(await knex.raw(migration));
  }
  return Promise.all(res);
};

exports.down = async function(knex, Promise) {
  const migrations = fs.readFileSync(migration_down, 'utf-8').split(/;\s+/mg)
  const res = [];
  for (let migration of migrations) {
    res.push(await knex.raw(migration));
  }
  return Promise.all(res);
};
