const path = require('path');
const nodemailer = require('nodemailer');
const Handlebars = require('handlebars');
const hbs = require('./template-generator');
const { htmlToText } = require('nodemailer-html-to-text');
const inlineBase64 = require('nodemailer-plugin-inline-base64');
const minifyHtml = require('./minify-html');
const minifyText = require('./minify-text');
const saveMail = require('./save-mail');
const i18nPrepare = require('./i18n-prepare');
const fixBaseUrlInHtml = require('./fix-base-url-in-html');
const i18n = require('../i18n')();
const cfg = require('../config');
const log = require('../logger').getLogger('MAILER:transporter');



const options = {
  host: cfg.get('mailer.host'),
  port: cfg.get('mailer.port'),
  secure: cfg.get('mailer.secure'),
  auth: {
    user: cfg.get('mailer.auth.user'),
    pass: cfg.get('mailer.auth.pass'),
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: cfg.get('mailer.tls.rejectUnauthorized'),
  },
  attachDataUrls: cfg.get('mailer.attachDataUrls'),
  //logger: log,
  //debug: cfg.get('env') === 'production' ? false : true,
};
const defaults = {};
const transporter = nodemailer.createTransport(options, defaults);


transporter.verify((error, success) => {
  if (error)
    return log.error('Server is not ready to take our messages. Error:', error);
  return log.info('Mail Server is ready to take our messages.', success);
});


transporter.use('compile', i18nPrepare({ i18n }));


const hbsHelpers = {
  t: (i18n_key, context = {}) => {
    context.interpolation = { escapeValue: false };
    const result = i18n.t(i18n_key, context);
    return new Handlebars.SafeString(result);
  },
};
const hbsViewEngine = {
  handlebars: Handlebars,
  extname: '.hbs',
  encoding: 'utf8',
  defaultLayout: 'layout',
  layoutsDir: path.resolve(__dirname, '../views/mails/layouts'),
  partialsDir: path.resolve(__dirname, '../views/mails/partials'),
  helpers: hbsHelpers,
};
const hbsOptions = {
  viewEngine: hbsViewEngine,
  viewPath: path.resolve(__dirname, '../views/mails'),
  extName: '.hbs',
};
transporter.use('compile', hbs(hbsOptions));


transporter.use('compile', fixBaseUrlInHtml({
  baseUrl: cfg.get('domains.root'),
}));


//transporter.use('compile', inlineBase64({ cidPrefix: 'cid_', }));


transporter.use('compile', minifyHtml());


transporter.use('compile', htmlToText({
  linkHrefBaseUrl: cfg.get('domains.root'),
  hideLinkHrefIfSameAsText: true,
  uppercaseHeadings: false,
  ignoreImage: true,
  ignoreHref: true,
  wordwrap: 80,
  firstLineCharCount: 2,
}));


transporter.use('compile', minifyText());


transporter.use('compile', saveMail());


module.exports = transporter;
