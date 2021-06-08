const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const EmailCode = mongoose.model('email_codes');
const db = require('../../../../db');
const mailer = require('../../../../../mailer')();
const { getRouterLogger, checkPOW } = require('../../../../lib');



/*
const powIsvalid = checkPOW(email, nonce, 4);
if (!powIsvalid) {
  answer.error = { message: 'POW is invalid.' };
  return res.json(answer);
}
*/

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

    log.info('User getted email data. guid:', xGuid);
    return res.json(answer);
  }
);


router.post('/check',
  async (req, res, next) => {
    const log = getRouterLogger(req);
    const answer = { ok: false, error: undefined, result: undefined, };
    const { email, nonce } = req.body;

    let user = await db.getUserByEmail(email);
    if (user) {
      answer.error = { message: 'Email is already taken.' };
      return res.json(answer);
    }

    const emailDoc = await db.getOrCreateEmail(email);

    answer.result = true;
    answer.ok = true;

    log.info('Checked email address. email:', email);
    return res.json(answer);
  }
);


router.post('/recovery',
  async (req, res, next) => {
    const log = getRouterLogger(req);
    const answer = { ok: false, error: undefined, result: undefined, };
    const { email } = req.body;

    if (email) {
      log.info('Recovery pass by email address. email:', email);
      let user = await db.getUserByEmail(email);
      if (user) {
        answer.error = { message: 'Email not found.' };
        return res.json(answer);
      }

      // TODO отправка письма с кодом
      answer.result = true;
      answer.ok = true;
      return res.json(answer);
    }

    answer.error = { message: 'Not found.' };
    return res.json(answer);
  }
);



router.post('/code',
  async (req, res, next) => {
    const log = getRouterLogger(req);
    const answer = { ok: false, error: undefined, result: undefined, };
    const { email, language } = req.body;
    const lng = language || req.language;

    const emailDoc = await db.getEmailById(email);
    if (!emailDoc) {
      answer.error = { message: 'Email not found.' };
      return res.json(answer);
    }

    const codeDoc = await db.createEmailConfirmationCode(email);
    await mailer.sendVerifyYourEmail(email, codeDoc.code, lng);

    answer.result = { created_at: codeDoc.created_at.getTime() };
    answer.ok = true;

    log.info('Getted email confirmation code. email:', email);
    return res.json(answer);
  }
);


router.post('/confirm',
  async (req, res, next) => {
    const log = getRouterLogger(req);
    const time = new Date().getTime();
    const answer = { ok: false, error: undefined, result: undefined, };
    const { email, code, language } = req.body;
    const lng = language || req.language;

    const emailDoc = await db.getEmailById(email);
    if (!emailDoc) {
      answer.error = { message: 'Email not found.' };
      return res.json(answer);
    }

    let codeDoc = await db.getEmailConfirmationCode(email);
    if (!codeDoc) {
      answer.error = { message: 'Email confirmation code not found.' };
      return res.json(answer);
    }

    if (!codeDoc.validateCode(code)) {
      answer.error = { message: 'Incorrect email confirmation code.' };
      codeDoc = await EmailCode.findOneAndUpdate(
        { _id: codeDoc._id }, { $inc: { tryes: 1 } }, { new: true }
      );
      if (codeDoc.tryes > 2) {
        await EmailCode.findByIdAndRemove({ _id: codeDoc._id });
        answer.error.message += ' Tryes ended!';
      } else {
        answer.error.message += ` Tryes ${codeDoc.tryes}/3!`;
        return res.json(answer);
      }
    } else {
      emailDoc.confirmed = true;
      await emailDoc.save();
      await EmailCode.findByIdAndRemove({ _id: codeDoc._id });
      await mailer.sendYourEmailVerified(email, lng);
    }

    answer.result = true;
    answer.ok = true;

    log.info('Email confirmation. email:', email);
    return res.json(answer);
  }
);



module.exports = router;
