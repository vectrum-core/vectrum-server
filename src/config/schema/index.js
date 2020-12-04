const env = require('./env');
const data = require('./data');
const config = require('./config');
const logger = require('./logger');
const domains = require('./domains');
const language = require('./language');
const db = require('./db');
const server = require('./server');
const session = require('./session');
const password = require('./password');
const jwt = require('./jwt');
const vectrum = require('./vectrum');
const mailer = require('./mailer');
const bot = require('./bot');



const schema = Object.assign(
  { /* */ },
  env,
  data,
  config,
  logger,
  domains,
  language,
  db,
  server,
  session,
  password,
  jwt,
  vectrum,
  bot,
  mailer,
);

module.exports = schema;
