const express = require('express');
const router = express.Router();



router.get('/', (req, res, next) => {
  res.render('index', {
    header: `${req.t('Contacts')}`,
    subHeader: `${req.t('Project Title')}`,
    title: `${req.t('Contacts')} - ${req.t('Project Title')}`,
    description: `${req.t('Contacts')} - ${req.t('Project Title')}`,
  });
});

module.exports = router;
