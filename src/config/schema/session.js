const store = require('./session-store');
const isProduction = process.env.NODE_ENV === 'production';



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
      default: isProduction ? undefined : 'keyboard^cat^vectrum',
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
        default: isProduction ? 1 * 60 * 60 * 1000 : 60 * 1000,
      },
      secure: {
        doc: 'session cookie.secure',
        format: Boolean,
        default: isProduction ? true : false,
      },
    }
  }
};

module.exports = schema;