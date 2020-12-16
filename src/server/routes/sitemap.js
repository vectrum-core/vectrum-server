const express = require('express');
const router = express.Router();



router.get('/', (req, res, next) => {
  res.render('index', {
    header: `${req.t('Site Map')}`,
    subHeader: `${req.t('Project Title')}`,
    title: `${req.t('Site Map')} - ${req.t('Project Title')}`,
    description: `${req.t('Site Map')} - ${req.t('Project Title')}`,
  });
});

module.exports = router;
