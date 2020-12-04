const path = require('path');
const cfg = require('../../config');



const isProduction = cfg.get('env') === 'production';

const i18nextConfig = {
  fallbackLng: cfg.get('language'),
  whitelist: ['en', 'ru'],
  nonExplicitWhitelist: true, // if true: 'en-US' as 'en'
  preload: ['en', 'ru'],
  ns: [
    'mailer-common'
  ],
  defaultNS: 'mailer-common',  // default namespace (needs no prefix on calling t)
  fallbackNS: 'mailer-common', // fallback, can be a string or an array of namespaces
  nsSeparator: false,  // ':'
  keySeparator: false, // '.'

  debug: isProduction ? true : false,
  saveMissing: true,
  backend: {
    loadPath: path.join(__dirname, '../locales/{{lng}}/{{ns}}.json'),
    addPath: path.resolve(__dirname, cfg.get('data.dir'), 'locales-mailer-{{lng}}-{{ns}}.missing.json'),
  },
  initImmediate: false,
};

module.exports = i18nextConfig;
