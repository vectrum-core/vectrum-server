const express = require('express');
const router = express.Router();
const db = require('../../../../db');
const { smartStringify: SS, checkTelegramAuthData, getRouterLogger } = require('../../../../lib');



router.post('/email',
  async (req, res, next) => {
    const log = getRouterLogger(req);
    const time = new Date().getTime();
    const answer = { ok: false, error: undefined, result: undefined, };
    const { email, password } = req.body;

    let user = await db.getUserByEmail(email);
    if (!user) {
      answer.error = { message: 'User not found.' };
      return res.json(answer);
    }

    const passwordIsValid = await user.validatePassword(password);
    if (!passwordIsValid) {
      answer.error = { message: 'Password is invalid.' };
      return res.json(answer);
    }

    const info = { time: time, ip: req.ip, useragent: req.useragent, };
    answer.result = await user.toAuthJSON(info);
    answer.ok = true;

    log.info('User loginned by email. guid:', answer.result.guid);
    return res.json(answer);
  }
);


router.post('/username',
  async (req, res, next) => {
    const log = getRouterLogger(req);
    const time = new Date().getTime();
    const answer = { ok: false, error: undefined, result: undefined, };
    const { username, password } = req.body;

    let user = await db.getUserByUsername(username);
    if (!user) {
      answer.error = { message: 'User not found.' };
      return res.json(answer);
    }

    const passwordIsValid = await user.validatePassword(password);
    if (!passwordIsValid) {
      answer.error = { message: 'Password is invalid.' };
      return res.json(answer);
    }

    const info = { time: time, ip: req.ip, useragent: req.useragent, };
    answer.result = await user.toAuthJSON(info);
    answer.ok = true;

    log.info('User loginned by username. guid:', answer.result.guid);
    return res.json(answer);
  }
);


router.post('/telegram',
  async (req, res, next) => {
    const log = getRouterLogger(req);
    const time = new Date().getTime();
    const answer = { ok: false, error: undefined, result: undefined, };
    const { telegramAuthData } = req.body;
    const token = cfg.get('bot.token');

    if (checkTelegramAuthData(token, telegramAuthData)) {
      let user = await db.getUserByTelegramId(telegramAuthData.id);
      if (!user) {
        answer.error = { message: 'User not found.' };
        return res.json(answer);
      }

      const info = { time: time, ip: req.ip, useragent: req.useragent, };
      answer.result = await user.toAuthJSON(info);
      answer.ok = true;
    }

    log.info('User loginned by telegramAuthData. guid:', answer.result.guid);
    return res.json(answer);
  }
);

module.exports = router;
