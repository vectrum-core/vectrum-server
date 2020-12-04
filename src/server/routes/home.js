const express = require('express');
const router = express.Router();



router.get('/', (req, res, next) => {
  res.render('index', {
    header: `${req.t('Project Title')}`,
    subHeader: `${req.t('Project Slogan')}`,
    lang: req.language,
    title: `${req.t('Project Title')}`,
    description: `${req.t('Project Slogan')}`,
    noscript: req.t('noscript'),
  });
});


module.exports = router;
