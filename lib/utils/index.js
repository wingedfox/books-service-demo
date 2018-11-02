const config = require('config');
const db = require('./db');
const logger = require('./logger');

module.exports.config = config;
module.exports.db = db;
module.exports.logger = logger;
