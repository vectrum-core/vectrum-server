const express = require('express');
const router = express.Router();
const db = require('../../../../db');
const { getRouterLogger } = require('../../../../lib');



router.get('/',
  async (req, res, next) => {
    const log = getRouterLogger(req);
    const time = new Date().getTime();
    const answer = { ok: false, error: undefined, result: undefined, };
    const xGuid = req.headers['x-guid'];

    const user = await db.getUserById(xGuid);
    if (!user) {
      answer.error = { message: 'User not found.' };
      return res.json(answer);
    }
    user.last_active_at = time;
    await user.save();

    const email = await db.getEmailById(user.email);
    answer.result = email;
    answer.ok = true;

    log.info('User getted email data. guid:', answer.result.guid);
    return res.json(answer);
  }
);


module.exports = router;
