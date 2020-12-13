const express = require('express');
const router = express.Router();
const db = require('../../../db');
const { smartStringify: SS, getRouterLogger } = require('../../../lib');



router.post('/',
  async (req, res, next) => {
    const log = getRouterLogger(req);
    const answer = { ok: false, error: undefined, result: undefined, };
    const { apiKey, device } = req;
    const { type, location, data } = req.body;
    const xGuid = req.headers['x-guid'];

    const doc = await db.createAppEvent(
      apiKey, device, xGuid, type, location, data
    );
    answer.result = doc._id;
    answer.ok = true;

    log.info(
      `Logged app event. apiKey: ${apiKey}, device: ${device}, `
      + `type: ${type}, location: ${location}, data:`,
      SS(data)
    );
    return res.json(answer);
  }
);

module.exports = router;
