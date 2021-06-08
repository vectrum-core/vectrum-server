const express = require('express');
const router = express.Router();
const cors = require('cors');
const homeRouter = require('./home');
const authRouter = require('./auth');
const apiRouter = require('./api');



// static pages
router.use('/', homeRouter);
router.use('/index.html', homeRouter);

router.use('/dashboard', (req, res, next) => {
  res.render('index', {
    header: `Dashboard`,
    subHeader: `${req.t('Project Title')}`,
    title: `Dashboard - ${req.t('Project Title')}`,
    description: `Dashboard - ${req.t('Project Title')}`,
  });
});

router.use('/buy', (req, res, next) => {
  res.render('index', {
    header: `Buy VTM`,
    subHeader: `${req.t('Project Title')}`,
    title: `Buy VTM - ${req.t('Project Title')}`,
    description: `Buy VTM - ${req.t('Project Title')}`,
  });
});

router.use('/about', (req, res, next) => {
  res.render('index', {
    header: `About`,
    subHeader: `${req.t('Project Title')}`,
    title: `About - ${req.t('Project Title')}`,
    description: `About - ${req.t('Project Title')}`,
  });
});

router.use('/terms', (req, res, next) => {
  res.render('index', {
    header: `Terms`,
    subHeader: `${req.t('Project Title')}`,
    title: `Terms - ${req.t('Project Title')}`,
    description: `Terms - ${req.t('Project Title')}`,
  });
});

router.use('/privacy', (req, res, next) => {
  res.render('index', {
    header: `Privacy`,
    subHeader: `${req.t('Project Title')}`,
    title: `Privacy - ${req.t('Project Title')}`,
    description: `Privacy - ${req.t('Project Title')}`,
  });
});


router.use('/auth', authRouter);

router.use('/api', cors(), apiRouter);

module.exports = router;
