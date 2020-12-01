const schema = {
  db: {
    host: {
      doc: 'The IP address to bind.',
      format: '*',
      default: '127.0.0.1',
      env: 'DB_HOST',
      arg: 'db-host',
    },
    port: {
      doc: 'The port to bind.',
      format: 'port',
      default: 27017,
      env: 'DB_PORT',
      arg: 'db-port',
    },
    name: {
      doc: 'db name',
      format: String,
      default: 'DB',
      env: 'DB_NAME',
      arg: 'db-name',
    },
    user: {
      doc: 'db username',
      format: String,
      default: undefined,
      env: 'DB_USER',
      arg: 'db-user',
    },
    pass: {
      doc: 'db password for username',
      format: String,
      default: undefined,
      env: 'DB_PASS',
      arg: 'db-pass',
    },
    options: {
      bufferCommands: {
        doc: 'options bufferCommands',
        format: Boolean,
        default: true,
      },
      useNewUrlParser: {
        doc: 'options useNewUrlParser',
        format: Boolean,
        default: true,
      },
      autoIndex: {
        doc: 'options autoIndex',
        format: Boolean,
        default: true,
      },
      autoReconnect: {
        doc: 'options autoReconnect',
        format: Boolean,
        default: true,
      },
    }
  }
};

module.exports = schema;
