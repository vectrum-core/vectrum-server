const express = require('express');
const router = express.Router();
const SS = require('../../../../lib').smartStringify;



router.get('/info',
  async (req, res, next) => {
    const log = req.app.locals.logger.getLogger('ROUTER: "/api/v1/vectrum"');
    const logTrace = 'Method GET.';
    const answer = { jsonrpc: '2.0', id: null, ok: false, error: undefined, result: undefined, };

    answer.result = 'pong';
    answer.ok = true;

    log.trace('%s Response: "%s"', logTrace, SS(answer));
    return res.json(answer);
  }
);


router.get('/stats',
  async (req, res, next) => {
    const log = req.app.locals.logger.getLogger('ROUTER: "/api/v1/vectrum"');
    const logTrace = 'Method GET.';
    const answer = { jsonrpc: '2.0', id: null, ok: false, error: undefined, result: undefined, };

    answer.result = 'pong';
    answer.ok = true;

    log.trace('%s Response: "%s"', logTrace, SS(answer));
    return res.json(answer);
  }
);


router.get('/stats/accounts',
  async (req, res, next) => {
    const log = req.app.locals.logger.getLogger('ROUTER: "/api/v1/vectrum"');
    const logTrace = 'Method GET.';
    const answer = { jsonrpc: '2.0', id: null, ok: false, error: undefined, result: undefined, };

    answer.result = 'pong';
    answer.ok = true;

    log.trace('%s Response: "%s"', logTrace, SS(answer));
    return res.json(answer);
  }
);


router.get('/stats/token',
  async (req, res, next) => {
    const log = req.app.locals.logger.getLogger('ROUTER: "/api/v1/vectrum"');
    const logTrace = 'Method GET.';
    const answer = { jsonrpc: '2.0', id: null, ok: false, error: undefined, result: undefined, };

    answer.result = 'pong';
    answer.ok = true;

    log.trace('%s Response: "%s"', logTrace, SS(answer));
    return res.json(answer);
  }
);


module.exports = router;
