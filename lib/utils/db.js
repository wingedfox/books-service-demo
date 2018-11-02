const config = require('config');

const knex = require('knex')({
  client: config.get('db.client'),
  connection: config.get('db.connection'),
  pool: { min: 0, max: 5 }
});

module.exports = knex;
