const express = require('express');
const router = express.Router();
const { smartStringify: SS } = require('../../../lib');



router.get('/',
  async (req, res, next) => {
    const log = req.app.locals.logger.getLogger('SERVER:ROUTER:GET "/api/v1/ping"');
    const answer = { ok: false, error: undefined, result: undefined, };

    answer.result = 'pong';
    answer.ok = true;

    log.trace('%s Response: "%s"', SS(answer));
    return res.json(answer);
  }
);


router.post('/',
  async (req, res, next) => {
    const log = req.app.locals.logger.getLogger('SERVER:ROUTER:POST "/api/v1/ping"');
    const answer = { ok: false, error: undefined, result: undefined, };

    answer.result = 'pong';
    answer.ok = true;

    log.trace('%s Response: "%s"', SS(answer));
    return res.json(answer);
  }
);


module.exports = router;
