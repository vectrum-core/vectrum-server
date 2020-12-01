const crypto = require('crypto');
const store = require('./session-store');



const schema = {
  session: {
    password: {
      doc: 'session password',
      format: String,
      default: undefined,
    },
    name: {
      doc: 'session name',
      format: String,
      default: 'sid',
    },
    secret: {
      doc: 'session secret',
      format: String,
      default: crypto.randomBytes(64).toString('hex'),
    },
    resave: {
      doc: 'session resave',
      format: Boolean,
      default: false,
    },
    saveUninitialized: {
      doc: 'session saveUninitialized',
      format: Boolean,
      default: false,
    },
    store: store,
    cookie: {
      maxAge: {
        doc: 'session cookie.maxAge (number in milliseconds)',
        format: Number,
        default: 31536000000, // 365 * 24 * 60 * 60 * 1000,
      },
      secure: {
        doc: 'session cookie.secure',
        format: Boolean,
        default: false,
      },
    }
  }
};

module.exports = schema;
