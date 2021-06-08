const fs = require('fs');
const path = require('path');
const express = require('express');
const hbs = require('hbs');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const useragent = require('express-useragent');
const i18nextEM = require('i18next-express-middleware');
const log4js = require('log4js');
const cfg = require('../../config');
const logger = require('../../logger');
const i18n = require('../i18n')();
//const session = require('../session');
const passport = require('../passport');
const routes = require('../routes');



const app = express();

const log = logger.getLogger('SERVER:APP');
app.locals.logger = logger;
app.use(log4js.connectLogger(log));

// setup security
app.use(helmet());
app.disable('x-powered-by');
app.set('trust proxy', true);


// view engine setup
app.locals.layout = fs.existsSync(path.resolve(__dirname, '../../react-app'))
  ? 'layout-for-react-app'
  : 'layout';
log.debug('Views layout: "%s"', app.locals.layout);
hbs.registerPartials(path.resolve(__dirname, '../views/partials'));
hbs.registerHelper('t', function (i18n_key, context = {}) {
  context.interpolation = { escapeValue: false };
  const result = i18n.t(i18n_key, context);
  return new hbs.handlebars.SafeString(result);
});
app.set('views', path.resolve(__dirname, '../views'));
app.set('view engine', 'hbs');

app.use(bodyParser.json({ limit: '1mb', }));
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb', }));
app.use(cookieParser());
app.use(useragent.express());

app.use(express.static(path.resolve(__dirname, '../../react-app')));
app.use(express.static(path.resolve(__dirname, '../public')));
app.use(express.static(path.resolve(cfg.get('data.dir'), './public')));
app.post('/static/locales/add/:lng/:ns', i18nextEM.missingKeyHandler(i18n));
app.get('/static/locales/resources.json', i18nextEM.getResourcesHandler(i18n));

app.use(i18nextEM.handle(i18n, {
  ignoreRoutes: [
    '/robots.txt', '/static', '/api', '/fonts', '/pwa',
  ],
  removeLngFromUrl: true,
}));

//app.use(session());
app.use(passport.initialize());

app.use(routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  const message = err.message;
  const error = app.get('env') === 'development' ? err : {};

  // render the error page
  const status = err.status || 500;
  res.status(status);

  if (req.headers['content-type'] !== 'application/json') {
    res.render('error', {
      layout: 'layout',
      title: `${message}`,
      description: `${message}`,
      message: `${message}`,
      error: error,
    });
  } else {
    res.json({
      ok: false,
      id: req.body.id || null,
      error: { code: status, message: message, data: error, },
    });
  }

  log.error({
    error: err,
    status: status,
    message: message,
    url: `${req.protocol}://${req.headers.host}${req.originalUrl}`,
    body: req.body,
    query: req.query,
    params: req.params,
    useragent: req.useragent,
  });
});

module.exports = app;
