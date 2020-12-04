const express = require('express');
const router = express.Router();
const cors = require('cors');
const homeRouter = require('./home');
const authRouter = require('./auth');
const apiRouter = require('./api');



router.use('/', homeRouter);
router.use('/index.html', homeRouter);
router.use('/wallet', homeRouter);
router.use('/exchange', homeRouter);
router.use('/marketplace', homeRouter);


router.use('/auth', authRouter);


router.use('/api',
  cors(),
  apiRouter
);


module.exports = router;