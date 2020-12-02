const db = require('./db');
const env = require('./env');
const data = require('./data');
const config = require('./config');
const logger = require('./logger');
const server = require('./server');
const session = require('./session');
const password = require('./password');
const mailer = require('./mailer');
const domains = require('./domains');
const jwt = require('./jwt');
const vectrum = require('./vectrum');
const bot = require('./bot');



const schema = Object.assign(
  { /* */ },
  env,
  data,
  config,
  logger,
  server,
  db,
  session,
  password,
  mailer,
  domains,
  jwt,
  vectrum,
  bot,
);

module.exports = schema;
