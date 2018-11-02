// Update with your config settings.
const config = require('./lib/utils').config;

module.exports = {
  client: 'mysql',
  connection: config.get('db.connection'),
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations'
  }
};
