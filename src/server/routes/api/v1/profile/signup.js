const express = require('express');
const router = express.Router();
const db = require('../../../../db');
const { smartStringify: SS, checkTelegramAuthData, getRouterLogger } = require('../../../../lib');



router.post('/email',
  async (req, res, next) => {
    const log = getRouterLogger(req);
    const time = new Date().getTime();
    const answer = { ok: false, error: undefined, result: undefined, };
    const { email, password, ...extra } = req.body;

    let user = await db.getUserByEmail(email);
    if (user) {
      answer.error = { message: 'Email is already taken.' };
      return res.json(answer);
    }

    // Проверка extra данных
    delete extra.permissions;
    user = await db.createUserByEmailAndPassword(email, password, extra);

    const info = { time: time, ip: req.ip, useragent: req.useragent, };
    answer.result = await user.toAuthJSON(info);
    answer.ok = true;

    log.info('User created by email. guid:', answer.result.guid);
    return res.json(answer);
  }
);


router.post('/username',
  async (req, res, next) => {
    const log = getRouterLogger(req);
    const time = new Date().getTime();
    const answer = { ok: false, error: undefined, result: undefined, };
    const { username, password, ...extra } = req.body;

    let user = await db.getUserByUsername(username);
    if (user) {
      answer.error = { message: 'Username is already taken.' };
      return res.json(answer);
    }

    // Проверка extra данных
    delete extra.permissions;
    user = await db.createUserByUsernameAndPassword(username, password, extra);

    const info = { time: time, ip: req.ip, useragent: req.useragent, };
    answer.result = await user.toAuthJSON(info);
    answer.ok = true;

    log.info('User created by username. guid:', answer.result.guid);
    return res.json(answer);
  }
);


router.post('/telegram',
  async (req, res, next) => {
    const log = getRouterLogger(req);
    const time = new Date().getTime();
    const answer = { ok: false, error: undefined, result: undefined, };
    const { telegramAuthData, ...extra } = req.body;
    const token = cfg.get('bot.token');

    if (checkTelegramAuthData(token, telegramAuthData)) {
      let user = await db.getUserByTelegramId(telegramAuthData.id);
      if (user) {
        answer.error = { message: 'Telegram user id is already taken.' };
        return res.json(answer);
      }

      // Проверка extra данных
      delete extra.permissions;
      user = await db.createUserByTelegramAuthData(telegramAuthData, extra);

      const info = { time: time, ip: req.ip, useragent: req.useragent, };
      answer.result = await user.toAuthJSON(info);
      answer.ok = true;
    }

    log.info('User created by telegramAuthData. guid:', answer.result.guid);
    return res.json(answer);
  }
);

module.exports = router;
