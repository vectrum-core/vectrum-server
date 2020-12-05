const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../../../db');
const { decodeAndVerifyJWT, createJWTFromData } = require('../../../jwt');
const { smartStringify: SS } = require('../../../lib');



router.post('/check',
  async (req, res, next) => {
    const loggerName = `SERVER:ROUTER:${req.method} "${req.originalUrl}"`;
    const log = req.app.locals.logger.getLogger(loggerName);
    const answer = { ok: false, error: undefined, result: undefined, };

    let { id, token, info } = req.body;
    let resetId = false;

    try {
      if (token && token !== null) {
        const decoded = await decodeAndVerifyJWT(token);
        if (!decoded.isValid || id !== decoded.payload.sub)
          resetId = true;
      } else
        resetId = true;

      // Если токена устройства нет или подпись не валидна или если id не сходятся,
      // то сброс id
      if (resetId) id = uuidv4();
      const ip = req.ip;
      const useragent = req.useragent;

      await db.updateDevice({ _id: id, ip, info, useragent });
      // обновление токена
      token = createJWTFromData({ sub: id });

      answer.result = { id, token, };
    } catch (error) {
      log.trace(error);
      answer.error = error;
    }

    if (!answer.error) answer.ok = true;

    log.trace(SS(answer));
    return res.json(answer);
  }
);


module.exports = router;
