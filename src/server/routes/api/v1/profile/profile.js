const express = require('express');
const router = express.Router();
const passport = require('../../../../passport');
const db = require('../../../../db');
const { smartStringify: SS, getRouterLogger } = require('../../../../lib');
const signupRouter = require('./signup');
const signinRouter = require('./signin');
const emailRouter = require('./email');



router.use('/signup', signupRouter);
router.use('/signin', signinRouter);

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
  //passport.authenticate('jwt', { session: false }),
  emailRouter
);


module.exports = router;
