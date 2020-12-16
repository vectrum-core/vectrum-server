const express = require('express');
const router = express.Router();
const cors = require('cors');
const homeRouter = require('./home');
const explorerRouter = require('./explorer');
const profileRouter = require('./profile');
const walletRouter = require('./wallet');
const authRouter = require('./auth');
const apiRouter = require('./api');



router.use('/', homeRouter);
router.use('/index.html', homeRouter);

router.use('/explorer', explorerRouter);
router.use('/profile', profileRouter);
router.use('/wallet', walletRouter);
router.use('/exchange', homeRouter);
router.use('/marketplace', homeRouter);


router.use('/auth', authRouter);

router.use('/api',
  cors(),
  apiRouter
);

module.exports = router;
