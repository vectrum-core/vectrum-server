const express = require('express');
const router = express.Router(); const mongoose = require('mongoose');
const Actions = mongoose.model('action_traces');
const { smartStringify: SS, getRouterLogger } = require('../../../../lib');
const passport = require('../../../../passport');
const VR = require('../../../../../vectrum-robot');



router.post('/account/actions',
  async (req, res, next) => {
    const answer = { ok: false, error: undefined, result: undefined, };

    // проверка корректность имени аккаунта
    let { account } = req.body;
    if (!account) {
      answer.error = { message: 'Wrong account name' };
      return res.json(answer);
    }

    try {
      const docs = await Actions
        .find({
          'act.account': 'eosio.token', 'act.name': 'transfer',
          //$or: [{ 'act.data.from': account }, { 'act.data.to': account }]
        })
        .sort({ createdAt: -1 })
        .limit(10);
      answer.result = docs;
    } catch (error) {

    }


    if (!answer.error) answer.ok = true;
    return res.json(answer);
  }
);



router.post('/account/create',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    const answer = { ok: false, error: undefined, result: undefined, };

    let transaction_id = '';
    // проверка корректность имени аккаунта
    let { account } = req.body;
    if (!account
      || account.length != 12
      || !/^[a-z]{1,1}[a-z1-5]{11,11}$/.test(account)
    ) {
      answer.error = { message: 'Wrong account name' };
      return res.json(answer);
    }

    // проверка на наличие уже созданного аккаунта
    if (req.user.account) {
      answer.error = { message: 'Only 1 account per user' };
      return res.json(answer);
    }

    try {
      await VR.rpc.get_account(account);
      answer.error = { message: `Account '${account}' already exist` };
      return res.json(answer);
    } catch (error) { console.log(error); }

    // создаем аккаунт
    try {
      const res = await VR.api.transact(
        VR.getTxTemplateCreateAccount(account),
        {
          blocksBehind: 3,
          expireSeconds: 30,
        }
      );
      transaction_id = res.transaction_id; // транзакция где создается аккаунт
      req.user.account = account;
      req.user.accounts.push(account);
      await req.user.save();

      // настраиваем акк в частности получение ревардов
      const res2 = await VR.api.transact(
        VR.getTxTemplateSetupAccount(account),
        {
          blocksBehind: 3,
          expireSeconds: 30,
        }
      );
    } catch (error) {
      console.log(error);
      answer.error = { message: 'error' };
      return res.json(answer);
    }


    if (!answer.error) answer.ok = true;
    answer.result = transaction_id;
    return res.json(answer);
  }
);


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
