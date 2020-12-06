const express = require('express');
const router = express.Router();
const { smartStringify: SS, getRouterLogger } = require('../../../../lib');



router.get('/info',
  async (req, res, next) => {
    const log = getRouterLogger(req);
    const answer = { ok: false, error: undefined, result: undefined, };

    answer.result = 'pong';
    answer.ok = true;

    log.trace('%s Response: "%s"', SS(answer));
    return res.json(answer);
  }
);


router.get('/stats',
  async (req, res, next) => {
    const log = getRouterLogger(req);
    const answer = { ok: false, error: undefined, result: undefined, };

    answer.result = 'pong';
    answer.ok = true;

    log.trace('%s Response: "%s"', SS(answer));
    return res.json(answer);
  }
);


router.get('/stats/accounts',
  async (req, res, next) => {
    const log = getRouterLogger(req);
    const answer = { ok: false, error: undefined, result: undefined, };

    answer.result = 'pong';
    answer.ok = true;

    log.trace('%s Response: "%s"', SS(answer));
    return res.json(answer);
  }
);


router.get('/stats/token',
  async (req, res, next) => {
    const log = getRouterLogger(req);
    const answer = { ok: false, error: undefined, result: undefined, };

    answer.result = 'pong';
    answer.ok = true;

    log.trace('%s Response: "%s"', SS(answer));
    return res.json(answer);
  }
);


module.exports = router;
