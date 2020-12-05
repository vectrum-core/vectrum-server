const express = require('express');
const router = express.Router();
const cfg = require('../../../config');
const db = require('../../db');
const { smartStringify: SS, checkTelegramAuthData } = require('../../lib');



// https://core.telegram.org/widgets/login#receiving-authorization-data
router.get('/tg',
  async (req, res, next) => {
    const log = req.app.locals.logger.getLogger('SERVER:ROUTER:GET:"/auth/tg"');
    const preloadedReduxState = {};
    const time = new Date().getTime();

    const token = cfg.get('bot.token');
    req.query.id = parseInt(req.query.id);
    const authData = req.query;
    if (checkTelegramAuthData({ token, ...authData })) {
      // data is from Telegram
      let tgUser = await db.getTGUserById(req.query.id);
      if (tgUser === null) {
        tgUser = await db.createTGUser(req.query);
      } else {
        tgUser.last_active_at = time;
        await tgUser.save();
      }

      let user = await db.getUserByTgUserId(req.query.id);
      if (user === null) {
        user = await db.createUserByTgUserId(req.query.id);
      } else {
        user.last_active_at = time;
        await user.save();
      }

      const info = { time: time, ip: req.ip, useragent: req.useragent, };
      preloadedReduxState.profile = await user.toAuthJSON(info);

      log.debug('%s Login by Telegram successed!', SS(req.query));
    } else
      log.warn('%s Login by Telegram failed!', SS(req.query));

    return res.render('index', {
      header: `${req.t('Project Title')}`,
      subHeader: `Авторизация через Telegram`,
      lang: req.language,
      title: `Авторизация через Telegram | ${req.t('Project Title')}`,
      description: `Авторизация через Telegram | ${req.t('Project Title')}`,
      noscript: req.t('noscript'),
      preloadedReduxState: JSON.stringify(preloadedReduxState),
    });
  }
);


module.exports = router;
