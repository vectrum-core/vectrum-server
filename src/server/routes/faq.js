const express = require('express');
const router = express.Router();



router.get('/', (req, res, next) => {
  res.render('index', {
    header: `${req.t('FAQ')}`,
    subHeader: `${req.t('Project Title')}`,
    title: `${req.t('FAQ')} - ${req.t('Project Title')}`,
    description: `${req.t('FAQ')} - ${req.t('Project Title')}`,
  });
});

module.exports = router;
