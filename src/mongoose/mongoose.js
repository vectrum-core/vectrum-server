const mongoose = require('mongoose');
const BigNumberSchema = require('mongoose-bignumber');
const models = require('./models');
const cfg = require('../config');
const log = require('../logger').getLogger('MONGOOSE');



const isProduction = cfg.get('env') === 'production';

// Configure mongoose's promise to global promise
mongoose.promise = global.Promise;


const getDbUri = () => {
  const credentials =
    (cfg.get('db.user') !== undefined && cfg.get('db.pass') !== undefined)
      ? `${cfg.get('db.user')}:${cfg.get('db.pass')}@`
      : '';
  const dbServer = `${cfg.get('db.host')}:${cfg.get('db.port')}`;
  const dbName = cfg.get('db.name');

  let uri = `mongodb://${credentials}${dbServer}/${dbName}`;
  if (credentials !== '')
    uri += '?authSource=admin';

  return uri;
}


const connectDb = (label = 'db') => {
  return new Promise((resolve, reject, onCancel) => {
    mongoose.set('debug', !isProduction);

    const uri = getDbUri();

    const options = {
      user: cfg.get('db.user') !== undefined ? cfg.get('db.user') : undefined,
      pass: cfg.get('db.pass') !== undefined ? cfg.get('db.pass') : undefined,
      dbName: cfg.get('db.name'),
      useNewUrlParser: cfg.get('db.options.useNewUrlParser'),
      bufferCommands: cfg.get('db.options.bufferCommands'),
      autoIndex: cfg.get('db.options.autoIndex'),
      autoReconnect: cfg.get('db.options.autoReconnect'),
      useFindAndModify: true,
      useUnifiedTopology: true,
    };

    mongoose.connect(uri, options)
      .then(
        (connection) => {
          log.debug(`'${label}'`, 'connected to MongoDB by mongoose.');
          return resolve({ connection });
        },
        (error) => {
          log.error(`'${label}'`, 'has connection error:', error);
          process.emit('mongoose_error', error);
          return reject(error);
        },
      )
      .catch((error) => {
        log.error(`'${label}'`, 'mongoose.createConnection() catched error:', error);
        process.emit('mongoose_error', error);
        return reject(error);
      });

    // Event handlers
    mongoose.connection.on('error', (error) => {
      log.error(`'${label}'`, "connection.on('error'). error:", error);
      process.emit('mongoose_error', error);
    });

    mongoose.connection.once('connecting', () => {
      log.debug(`'${label}'`, 'Connecting.');
      process.emit('mongoose_connecting');
    });

    mongoose.connection.on('connected', () => {
      log.info(`'${label}'`, 'Succesfully connected to MongoDB Database.');
      process.emit('mongoose_connected');
    });

    mongoose.connection.once('disconnecting', () => {
      log.warn(`'${label}'`, 'Disconnecting.');
      process.emit('mongoose_disconnecting');
    });

    mongoose.connection.once('disconnected', () => {
      log.warn(`'${label}'`, 'Disconnected.');
      process.emit('mongoose_disconnected');
    });

    mongoose.connection.once('reconnected', () => {
      log.info(`'${label}'`, 'Reconnected.');
      process.emit('mongoose_reconnected');
    });

    mongoose.connection.once('reconnectFailed', () => {
      log.error(`'${label}'`, 'Reconnect Failed.');
      process.emit('mongoose_reconnect_failed');
    });

  });
};


module.exports = connectDb;
module.exports.connectDb = connectDb;
module.exports.getDbUri = getDbUri;
