const express = require('express');
const router = express.Router();
const passport = require('../../../passport');

const pingRouter = require('./ping');
const profileRouter = require('./profile');
const vectrumRouter = require('./vectrum');
const walletRouter = require('./wallet');

const ratesRouter = require('./rates');


router.use('/ping', pingRouter);

router.use('/vectrum', vectrumRouter);
router.use('/profile', profileRouter);

router.use('/wallet',
  passport.authenticate('jwt', { session: false }),
  walletRouter
);

router.use('/rates', ratesRouter);

module.exports = router;
