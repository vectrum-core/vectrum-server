const express = require('express');
const router = express.Router();



router.get('/', (req, res, next) => {
  res.render('index', {
    header: `${req.t('Explorer')}`,
    subHeader: `${req.t('Project Title')}`,
    title: `${req.t('Explorer')} - ${req.t('Project Title')}`,
    description: `${req.t('Explorer')} - ${req.t('Project Title')}`,
  });
});


router.get('/account', (req, res, next) => {
  res.render('index', {
    header: `${req.t('Explorer')}`,
    subHeader: `${req.t('Project Title')}`,
    title: `${req.t('Account')} - ${req.t('Explorer')} - ${req.t('Project Title')}`,
    description: ` ${req.t('Account')} - ${req.t('Explorer')} - ${req.t('Project Title')}`,
  });
});


router.get('/account/:id', (req, res, next) => {
  const { id } = req.params;
  res.render('index', {
    header: `${req.t('Explorer')}`,
    subHeader: `${req.t('Project Title')}`,
    title: `${id} - ${req.t('Account')} - ${req.t('Explorer')} - ${req.t('Project Title')}`,
    description: `${id} - ${req.t('Account')} - ${req.t('Explorer')} - ${req.t('Project Title')}`,
  });
});


router.get('/block', (req, res, next) => {
  res.render('index', {
    header: `${req.t('Explorer')}`,
    subHeader: `${req.t('Project Title')}`,
    title: `${req.t('Block')} - ${req.t('Explorer')} - ${req.t('Project Title')}`,
    description: `${req.t('Block')} - ${req.t('Explorer')} - ${req.t('Project Title')}`,
  });
});


router.get('/block/:id', (req, res, next) => {
  const { id } = req.params;
  res.render('index', {
    header: `${req.t('Explorer')}`,
    subHeader: `${req.t('Project Title')}`,
    title: `${id} - ${req.t('Block')} - ${req.t('Explorer')} - ${req.t('Project Title')}`,
    description: `${id} - ${req.t('Block')} - ${req.t('Explorer')} - ${req.t('Project Title')}`,
  });
});


router.get('/transaction', (req, res, next) => {
  res.render('index', {
    header: `${req.t('Explorer')}`,
    subHeader: `${req.t('Project Title')}`,
    title: `${req.t('Transaction')} - ${req.t('Explorer')} - ${req.t('Project Title')}`,
    description: `${req.t('Transaction')} - ${req.t('Explorer')} - ${req.t('Project Title')}`,
  });
});


router.get('/transaction/:id', (req, res, next) => {
  const { id } = req.params;
  res.render('index', {
    header: `${req.t('Explorer')}`,
    subHeader: `${req.t('Project Title')}`,
    title: `${id} - ${req.t('Transaction')} - ${req.t('Explorer')} - ${req.t('Project Title')}`,
    description: `${id} - ${req.t('Transaction')} - ${req.t('Explorer')} - ${req.t('Project Title')}`,
  });
});


router.get('/key', (req, res, next) => {
  res.render('index', {
    header: `${req.t('Profile')}`,
    subHeader: `${req.t('Project Title')}`,
    title: `${req.t('Key')} - ${req.t('Explorer')} - ${req.t('Project Title')}`,
    description: `${req.t('Key')} - ${req.t('Explorer')} - ${req.t('Project Title')}`,
  });
});


router.get('/key/:id', (req, res, next) => {
  const { id } = req.params;
  res.render('index', {
    header: `${req.t('Profile')}`,
    subHeader: `${req.t('Project Title')}`,
    title: `${id} - ${req.t('Key')} - ${req.t('Explorer')} - ${req.t('Project Title')}`,
    description: `${id} - ${req.t('Key')} - ${req.t('Explorer')} - ${req.t('Project Title')}`,
  });
});


module.exports = router;
