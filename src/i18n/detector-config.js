const cfg = require('../config');



const inProduction = cfg.get('env') === 'production';

module.exports = {
  // order and from where user language should be detected
  // [ 'path', 'session', 'querystring', 'cookie', 'header' ],
  order: ['path'],

  // keys or params to lookup language from
  //lookupQuerystring: 'lng',
  lookupCookie: 'i18next',
  //lookupHeader: 'accept-language',
  //lookupSession: 'lng',
  //lookupPath: 'lng',
  lookupFromPathIndex: 0,

  // cache user language
  caches: ['cookie'],

  // optional expire and domain for set cookie
  //cookieExpirationDate: new Date(),
  //cookieDomain: 'myDomain',
  cookieSecure: inProduction ? true : false,
};
