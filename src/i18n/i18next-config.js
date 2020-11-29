const path = require('path');
const cfg = require('../config');
const detectorConfig = require('./detector-config');



const isProduction = cfg.get('env') === 'production';

const i18nextConfig = {
  fallbackLng: 'ru',
  whitelist: ['en', 'ru'],
  nonExplicitWhitelist: true, // if true: 'en-US' as 'en'
  preload: ['en', 'ru'],
  ns: [
    'srv-common', 'srv-error'
  ],
  defaultNS: 'srv-common',  // default namespace (needs no prefix on calling t)
  fallbackNS: 'srv-common', // fallback, can be a string or an array of namespaces
  nsSeparator: false,  // ':'
  keySeparator: false, // '.'

  debug: isProduction ? true : false,
  saveMissing: true,
  detection: detectorConfig,
  backend: {
    loadPath: path.join(__dirname, '../locales/{{lng}}/{{ns}}.json'),
    addPath: path.resolve(__dirname, cfg.get('data.dir'), 'locales-{{lng}}-{{ns}}.missing.json'),
  },
  initImmediate: false,
};

module.exports = i18nextConfig;
