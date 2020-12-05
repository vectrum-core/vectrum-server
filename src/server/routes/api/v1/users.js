const express = require('express');
const router = express.Router();
const db = require('../../../db');



router.post('/signup',
  async (req, res, next) => {
    const loggerName = `SERVER:ROUTER:${req.method} "${req.originalUrl}"`;
    const log = req.app.locals.logger.getLogger(loggerName);
    const time = new Date().getTime();
    const answer = { ok: false, error: undefined, result: undefined, };
    const { email, password } = req.body;

    let user = await db.getUserByEmail(email);
    if (user) {
      answer.error = 'Email is already taken.';
      return res.json(answer);
    }

    user = await db.createUserByEmailAndPassword(email, password);
    const info = { time: time, ip: req.ip, useragent: req.useragent, };
    answer.result = await user.toAuthJSON(info);
    answer.ok = true;

    log.info('User created by email. guid:', answer.result.guid);
    return res.json(answer);
  }
);

router.post('/permissions',
  async (req, res, next) => {
    const loggerName = `SERVER:ROUTER:${req.method} "${req.originalUrl}"`;
    const log = req.app.locals.logger.getLogger(loggerName);
    const time = new Date().getTime();
    const answer = { ok: false, error: undefined, result: undefined, };
    const { guid, permissions } = req.body;

    let user = await db.getUserById(guid);
    if (!user) {
      answer.error = 'User not found.';
      return res.json(answer);
    }

    //  проверк на админа
    user.permissions = permissions;
    await user.save();
    answer.result = true;
    answer.ok = true;

    log.info('User created by email. guid:', answer.result.guid);
    return res.json(answer);
  }
);



router.post('/signin',
  async (req, res, next) => {
    const loggerName = `SERVER:ROUTER:${req.method} "${req.originalUrl}"`;
    const log = req.app.locals.logger.getLogger(loggerName);
    const time = new Date().getTime();
    const answer = { ok: false, error: undefined, result: undefined, };
    const { email, password } = req.body;

    let user = await db.getUserByEmail(email);
    if (!user) {
      answer.error = 'Email or Password is invalid.';
      return res.json(answer);
    }

    const isValid = await user.validatePassword(password);
    if (!isValid) {
      answer.error = 'Email or Password is invalid.';
      return res.json(answer);
    }

    user.last_active_at = time;
    await user.save();

    const info = { time: time, ip: req.ip, useragent: req.useragent, };
    answer.result = await user.toAuthJSON(info);
    answer.ok = true;

    log.info('User signined by email. guid:', answer.result.guid);
    return res.json(answer);
  }
);


router.post('/logout',
  async (req, res, next) => {
    const loggerName = `SERVER:ROUTER:${req.method} "${req.originalUrl}"`;
    const log = req.app.locals.logger.getLogger(loggerName);
    const time = new Date().getTime();
    const answer = { ok: false, error: undefined, result: undefined, };
    const xGuid = req.headers['x-guid'];
    const xJTI = req.headers['x-jti'];

    const user = await db.getUserById(xGuid);
    if (!user) {
      answer.error = 'User not found.';
      return res.json(answer);
    }
    user.last_active_at = time;
    await user.save();

    const count = await db.delJwtById(xJTI);
    if (count === 1) {
      answer.result = true;
      answer.ok = true;
    } else
      answer.result = count;

    log.info('User logout. guid:', xGuid);
    return res.json(answer);
  }
);


module.exports = router;
