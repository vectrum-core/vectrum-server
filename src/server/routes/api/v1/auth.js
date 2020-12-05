const express = require('express');
const router = express.Router();
const db = require('../../../db');
const cfg = require('../../../../config');
const { smartStringify: SS, checkTelegramAuthData } = require('../../../lib');



// https://core.telegram.org/widgets/login#receiving-authorization-data
router.get('/tg',
  async (req, res, next) => {
    const log = req.app.locals.logger.getLogger('SERVER:ROUTER:%s "%s"', req.method, req.originalUrl);
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

      log.debug('%s Login by telegram successed!', SS(req.query));
    } else
      log.warn('%s Login by telegram failed!', SS(req.query));

    return res.json(preloadedReduxState.profile);
  }
);


router.post('/tg',
  async (req, res, next) => {
    const log = req.app.locals.logger.getLogger('SERVER:ROUTER:%s "%s"', req.method, req.originalUrl);
    const preloadedReduxState = {};
    const time = new Date().getTime();

    const token = cfg.get('bot.token');
    req.body.id = parseInt(req.body.id);
    const authData = req.body;
    if (checkTelegramAuthData({ token, ...authData })) {
      // data is from Telegram
      let tgUser = await db.getTGUserById(req.body.id);
      if (tgUser === null) {
        tgUser = await db.createTGUser(req.body);
      } else {
        tgUser.last_active_at = time;
        await tgUser.save();
      }

      let user = await db.getUserByTgUserId(req.body.id);
      if (user === null) {
        user = await db.createUserByTgUserId(req.body.id);
      } else {
        user.last_active_at = time;
        await user.save();
      }

      const info = {
        time: time,
        ip: req.ip,
        useragent: req.useragent,
      };
      preloadedReduxState.profile = await user.toAuthJSON(info);

      log.debug('%s Login by telegram successed!', SS(req.body));
    } else
      log.warn('%s Login by telegram failed!', SS(req.body));

    return res.json(preloadedReduxState.profile);
  }
);


module.exports = router;
