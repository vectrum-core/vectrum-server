const path = require('path');
const I18n = require('../telegraf-i18n');



const i18n = new I18n({
  directory: path.resolve(__dirname, '../locales'),
  defaultLanguage: 'ru',
  allowMissing: true,
  defaultLanguageOnMissing: true,
  sessionName: 'session',
  useSession: true,
  templateData: {
    pluralize: I18n.pluralize,
    uppercase: (value) => value.toUpperCase(),
  },
});

module.exports = i18n;
