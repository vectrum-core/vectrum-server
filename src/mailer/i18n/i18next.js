const i18next = require('i18next');
const SyncBackend = require('i18next-sync-fs-backend');
const sprintf = require('i18next-sprintf-postprocessor');
const i18nextConfig = require('./i18next-config');
const i18nextLogger = require('./logger');



module.exports = () => {
  const i18n = i18next.createInstance();
  i18n
    .use(i18nextLogger)
    .use(SyncBackend)
    .use(sprintf)
    .init(JSON.parse(JSON.stringify(i18nextConfig)));
  return i18n;
};
