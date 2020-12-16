const express = require('express');
const router = express.Router();
const {
  apiKeyMiddleware, apiKeyPermissionsMiddleware,
} = require('../../../middlewares/api-key-middlewares');
const passport = require('../../../passport');
const pingRouter = require('./ping');
const logRouter = require('./log');
const deviceRouter = require('./devices');
const profileRouter = require('./profile');
const vectrumRouter = require('./vectrum');
const walletRouter = require('./wallet');



router.use('/ping', pingRouter);

// Далее обязателен API ключ и уровень разрешения
router.use(apiKeyMiddleware());
router.use(apiKeyPermissionsMiddleware('app'));

router.use('/log', logRouter);
router.use('/devices', deviceRouter);
router.use('/continents', pingRouter);
router.use('/countries', pingRouter);
router.use('/time-zones', pingRouter);
router.use('/languages', pingRouter);
router.use('/currencies', pingRouter);

router.use('/vectrum', vectrumRouter);
router.use('/profile', profileRouter);

router.use('/wallet',
  passport.authenticate('jwt', { session: false }),
  walletRouter
);

module.exports = router;
