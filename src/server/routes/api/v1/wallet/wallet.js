const express = require('express');
const router = express.Router();
const db = require('../../../../db');
const { smartStringify: SS, getRouterLogger } = require('../../../../lib');



router.post('/',
  async (req, res, next) => {
    const log = getRouterLogger(req);
    const answer = { ok: false, error: undefined, result: undefined, };

    let { } = req.body;
    if (!answer.error) answer.ok = true;

    log.trace(SS(answer));
    return res.json(answer);
  }
);

module.exports = router;
