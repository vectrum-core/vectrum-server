const session = require('express-session');
const sessionStore = require('./session-store-redis')(session);
const { v4: uuidv4 } = require('uuid');
const cfg = require('../../config');



module.exports = () => {
  return session({
    // The session store instance, defaults to a new MemoryStore instance.
    store: sessionStore,
    genid: (req) => {
      return uuidv4();
    },
    //'connect.sid',
    name: cfg.get('session.name'),
    secret: cfg.get('session.secret'),
    resave: cfg.get('session.resave'),
    saveUninitialized: cfg.get('session.saveUninitialized'),
    cookie: {
      maxAge: cfg.get('session.cookie.maxAge'),
      secure: cfg.get('session.cookie.secure'),
    },
  });
}

// https://www.npmjs.com/package/express-session
// cookie
// Settings object for the session ID cookie. The default value is { path: '/', httpOnly: true, secure: false, maxAge: null }.
