const express = require('express');
const router = express.Router();



router.get('/', (req, res, next) => {
  res.render('index', {
    header: `${req.t('Sign Up')}`,
    subHeader: `${req.t('Project Title')}`,
    title: `${req.t('Sign Up')} - ${req.t('Project Title')}`,
    description: `${req.t('Sign Up')} - ${req.t('Project Title')}`,
  });
});

module.exports = router;
