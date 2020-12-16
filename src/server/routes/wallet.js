const express = require('express');
const router = express.Router();



router.get('/', (req, res, next) => {
  res.render('index', {
    header: `${req.t('Wallet')}`,
    subHeader: `${req.t('Project Title')}`,
    title: `${req.t('Wallet')} - ${req.t('Project Title')}`,
    description: `${req.t('Wallet')} - ${req.t('Project Title')}`,
  });
});


router.get('/create', (req, res, next) => {
  res.render('index', {
    header: `${req.t('Wallet')}`,
    subHeader: `${req.t('Project Title')}`,
    title: `${req.t('Create')} - ${req.t('Wallet')} - ${req.t('Project Title')}`,
    description: `${req.t('Create')} - ${req.t('Wallet')} - ${req.t('Project Title')}`,
  });
});


router.get('/send', (req, res, next) => {
  res.render('index', {
    header: `${req.t('Wallet')}`,
    subHeader: `${req.t('Project Title')}`,
    title: `${req.t('Send')} - ${req.t('Wallet')} - ${req.t('Project Title')}`,
    description: `${req.t('Send')} - ${req.t('Wallet')} - ${req.t('Project Title')}`,
  });
});


router.get('/stake', (req, res, next) => {
  res.render('index', {
    header: `${req.t('Wallet')}`,
    subHeader: `${req.t('Project Title')}`,
    title: `${req.t('Stake')} - ${req.t('Wallet')} - ${req.t('Project Title')}`,
    description: `${req.t('Stake')} - ${req.t('Wallet')} - ${req.t('Project Title')}`,
  });
});


module.exports = router;
