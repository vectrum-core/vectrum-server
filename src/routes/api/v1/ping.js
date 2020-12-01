const express = require('express');
const router = express.Router();
const SS = require('../../../lib/smart-stringify');
const log = require('../../../logger').getLogger('ROUTER: "/api/v1/ping"');



router.get('/',
  async (req, res, next) => {
    const logTrace = 'Method GET.';
    const answer = { jsonrpc: '2.0', id: null, ok: false, error: undefined, result: undefined, };

    answer.result = 'pong';
    answer.ok = true;

    log.trace('%s Response: "%s"', logTrace, SS(answer));
    return res.json(answer);
  }
);


router.post('/',
  async (req, res, next) => {
    const logTrace = 'Method POST.';
    const answer = { jsonrpc: '2.0', id: null, ok: false, error: undefined, result: undefined, };

    answer.result = 'pong';
    answer.ok = true;

    log.trace('%s Response: "%s"', logTrace, SS(answer));
    return res.json(answer);
  }
);


module.exports = router;
