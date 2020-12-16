const express = require('express');
const router = express.Router();



router.get('/', (req, res, next) => {
  res.render('index', {
    header: `${req.t('Legal')}`,
    subHeader: `${req.t('Project Title')}`,
    title: `${req.t('Legal')} - ${req.t('Project Title')}`,
    description: `${req.t('Legal')} - ${req.t('Project Title')}`,
  });
});


router.get('/privacy', (req, res, next) => {
  res.render('index', {
    header: `${req.t('Privacy Policy')}`,
    subHeader: `${req.t('Project Title')}`,
    title: `${req.t('Privacy Policy')} - ${req.t('Legal')} - ${req.t('Project Title')}`,
    description: `${req.t('Privacy Policy')} - ${req.t('Legal')} - ${req.t('Project Title')}`,
  });
});


router.get('/privacy/cookies', (req, res, next) => {
  res.render('index', {
    header: `${req.t('Use of Cookies')}`,
    subHeader: `${req.t('Project Title')}`,
    title: `${req.t('Use of Cookies')} - ${req.t('Privacy Policy')} - ${req.t('Legal')} - ${req.t('Project Title')}`,
    description: `${req.t('Use of Cookies')} - ${req.t('Privacy Policy')} - ${req.t('Legal')} - ${req.t('Project Title')}`,
  });
});


router.get('/terms', (req, res, next) => {
  res.render('index', {
    header: `${req.t('Terms of Use')}`,
    subHeader: `${req.t('Project Title')}`,
    title: `${req.t('Terms of Use')} - ${req.t('Legal')} - ${req.t('Project Title')}`,
    description: `${req.t('Terms of Use')} - ${req.t('Legal')} - ${req.t('Project Title')}`,
  });
});


router.get('/sales_refunds', (req, res, next) => {
  res.render('index', {
    header: `${req.t('Sales and Refunds')}`,
    subHeader: `${req.t('Project Title')}`,
    title: `${req.t('Sales and Refunds')} - ${req.t('Legal')} - ${req.t('Project Title')}`,
    description: `${req.t('Sales and Refunds')} - ${req.t('Legal')} - ${req.t('Project Title')}`,
  });
});


module.exports = router;
