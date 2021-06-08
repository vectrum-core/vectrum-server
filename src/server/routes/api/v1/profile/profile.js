const express = require('express');
const router = express.Router();
const passport = require('../../../../passport');
const db = require('../../../../db');
const { smartStringify: SS, getRouterLogger } = require('../../../../lib');
const signupRouter = require('./signup');
const signinRouter = require('./signin');
const emailRouter = require('./email');
const VR = require('../../../../../vectrum-robot');



router.use('/signup', signupRouter);
router.use('/signin', signinRouter);

router.post('/claimrewards',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    const log = getRouterLogger(req);
    const answer = { ok: false, error: undefined, result: undefined, };

    if (!req.user.account) {
      answer.error = { message: 'No account' };
      return res.json(answer);
    }

    try {
      const res = await VR.api.transact(
        VR.getTxTemplateClaimRewards(req.user.account),
        {
          blocksBehind: 3,
          expireSeconds: 30,
        }
      );

      answer.result = res.transaction_id;
      answer.ok = true;

    } catch (error) {
      console.error(error);
      answer.error = { message: 'Error' };
      return res.json(answer);
    }


    return res.json(answer);
  }
);


router.post('/send',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    const answer = { ok: false, error: undefined, result: undefined, };
    const { recipient, amount } = req.body;

    if (!req.user.account) {
      answer.error = { message: 'No account' };
      return res.json(answer);
    }

    try {
      const res = await VR.api.transact(
        VR.getTxTemplateSendVtm(req.user.account, recipient, amount, 'VECTRUM SMART WALLET'),
        {
          blocksBehind: 3,
          expireSeconds: 30,
        }
      );

      answer.result = res.transaction_id;
      answer.ok = true;

    } catch (error) {
      console.error(error);
      answer.error = { message: 'Error' };
      return res.json(answer);
    }


    return res.json(answer);
  }
);


router.post('/data',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    const log = getRouterLogger(req);
    const answer = { ok: false, error: undefined, result: undefined, };
    const xGuid = req.headers['x-guid'];

    const user = await db.getUserById(xGuid);
    if (!user) {
      answer.error = { message: 'User not found.' };
      return res.json(answer);
    }

    answer.result = user.toObject();
    answer.ok = true;

    log.info('User data. guid:', xGuid);
    return res.json(answer);
  }
);

router.post('/logout',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    const log = getRouterLogger(req);
    const time = new Date().getTime();
    const answer = { ok: false, error: undefined, result: undefined, };
    const xGuid = req.headers['x-guid'];
    const xJTI = req.headers['x-jti'];

    const user = await db.getUserById(xGuid);
    if (!user) {
      answer.error = { message: 'User not found.' };
      return res.json(answer);
    }
    user.last_active_at = time;
    await user.save();

    await db.delJwtById(xJTI);
    answer.result = true;
    answer.ok = true;

    log.info('User logout. guid:', xGuid);
    return res.json(answer);
  }
);


router.post('/permissions',
  async (req, res, next) => {
    const log = getRouterLogger(req);
    const answer = { ok: false, error: undefined, result: undefined, };
    const { guid, permissions } = req.body;

    let user = await db.getUserById(guid);
    if (!user) {
      answer.error = { message: 'User not found.' };
      return res.json(answer);
    }

    // todo  проверк на админа
    user.permissions = permissions;
    await user.save();
    answer.result = true;
    answer.ok = true;

    log.info('?permissions. guid:', answer.result.guid);
    return res.json(answer);
  }
);


router.use('/email',
  emailRouter
);


module.exports = router;
