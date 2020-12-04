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
const session = require('../session');
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
log.debug(`views layout: '${app.locals.layout}'`);
hbs.localsAsTemplateData(app);
hbs.registerPartials(path.resolve(__dirname, '../views/partials'));
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
    '/robots.txt',
    '/fonts', '/pwa', '/static', '/api',
  ],
  removeLngFromUrl: true,
}));

app.use(session());
app.use(passport.initialize());

app.use(routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  log.debug(req.body);

  const message = err.message;
  const error = app.get('env') === 'development' ? err : {};

  // render the error page
  const status = err.status || 500;
  res.status(status);

  if (req.headers['content-type'] !== 'application/json') {
    res.render('error', {
      layout: 'layout',
      lang: 'en',
      title: `${message}`,
      description: `${message}`,
      message: `${message}`,
      error: error,
    });
  } else {
    res.json({
      error: { code: status, message: message, data: error, },
      id: req.body.id || null,
    });
  }
  log.error('Error:', status, '-', message, '-', error);
});

module.exports = app;
