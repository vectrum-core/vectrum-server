const session = require('express-session');
const sessionStore = require('./session-store-redis')(session);
const { v4: uuidv4 } = require('uuid');
const cfg = require('../config');


module.exports = () => {
  return session({
    store: sessionStore, // The session store instance, defaults to a new MemoryStore instance.
    genid: (req) => {
      return uuidv4(); // use UUIDs for session IDs
    },
    name: cfg.get('session.name'),//'connect.sid',
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
