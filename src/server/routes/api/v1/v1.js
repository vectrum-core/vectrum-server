const express = require('express');
const router = express.Router();
const {
  apiKeyMiddleware, apiKeyPermissionsMiddleware,
} = require('../../../middlewares/api-key-middlewares');
const pingRouter = require('./ping');
const deviceRouter = require('./devices');
const userRouter = require('./users');
const vectrumRouter = require('./vectrum');



router.use('/ping', pingRouter);

// Далее обязателен API ключ и уровень разрешения
router.use(apiKeyMiddleware());
router.use(apiKeyPermissionsMiddleware('app'));

router.use('/devices', deviceRouter);
router.use('/users', userRouter);


router.use('/vectrum', vectrumRouter);

router.use('/continents', pingRouter);
router.use('/countries', pingRouter);
router.use('/time-zones', pingRouter);
router.use('/languages', pingRouter);
router.use('/currencies', pingRouter);

/*
counters: require('./counters'),
mails: require('./mails'),
continents: require('./continents'),
countries: require('./countries'),
time_zones: require('./time-zones'),
languages: require('./languages'),
currencies: require('./currencies'),
emails: require('./emails'),
passwords: require('./passwords'),
users: require('./users'),
tg_users: require('./tg-users'),
tg_contacts: require('./tg-contacts'),
phone_numbers: require('./phone-numbers'),
*/

module.exports = router;
