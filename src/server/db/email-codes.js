const mongoose = require('mongoose');
const EmailCode = mongoose.model('email_codes');
const log = require('../../logger').getLogger('SERVER:DB:EMAIL_CODES');
const { smartStringify: SS } = require('../lib');



const getCode = (num = 6) => {
  const code = Math.random().toFixed(num).split('.')[1];
  return code;
}

async function getEmailConfirmationCode(email) {
  const logTrace = 'getEmailConfirmationCode().';
  return new Promise(async (resolve, reject) => {
    const projection = {};
    try {
      const doc = await EmailCode.findOne(
        { email, tag: 'email_confirmation' }, projection
      );
      log.trace('%s Result:', logTrace, SS(doc));
      return resolve(doc);
    } catch (error) {
      log.error('%s Error:', logTrace, error);
      return reject(error);
    }
  });
}

async function createEmailConfirmationCode(email) {
  const logTrace = 'createEmailConfirmationCode().';
  return new Promise(async (resolve, reject) => {
    try {
      await EmailCode.deleteMany({ email, tag: 'email_confirmation' });
      const code = getCode(6);
      const doc = new EmailCode({ email, tag: 'email_confirmation' });
      doc.setCode(code);
      await doc.save();
      doc.code = code;
      log.trace('%s Result:', logTrace, SS(doc));
      return resolve(doc);
    } catch (error) {
      log.error('%s Error:', logTrace, error);
      return reject(error);
    }
  });
}


module.exports = {
  getEmailConfirmationCode,
  createEmailConfirmationCode,
};
