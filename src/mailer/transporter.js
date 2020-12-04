const path = require('path');
const nodemailer = require('nodemailer');
const { htmlToText } = require('nodemailer-html-to-text');
const inlineBase64 = require('nodemailer-plugin-inline-base64');
const Handlebars = require('handlebars');
const hbs = require('./plugins/template-generator');
const minifyHtml = require('./plugins/minify-html');
const minifyText = require('./plugins/minify-text');
const saveMail = require('./plugins/save-mail');
const i18nPrepare = require('./plugins/i18n-prepare');
const fixBaseUrlInHtml = require('./plugins/fix-base-url-in-html');
const cfg = require('../config');
const log = require('../logger').getLogger('MAILER:transporter');
const i18n = require('./i18n')();



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
    return log.error('Mail Server (%s) is not ready to take our messages. Error:', cfg.get('mailer.host'), error);
  return log.info('Mail Server (%s) is ready to take our messages.', cfg.get('mailer.host'));
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
  layoutsDir: path.resolve(__dirname, './views/layouts'),
  partialsDir: path.resolve(__dirname, './views/partials'),
  helpers: hbsHelpers,
};
const hbsOptions = {
  viewEngine: hbsViewEngine,
  viewPath: path.resolve(__dirname, './views'),
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
