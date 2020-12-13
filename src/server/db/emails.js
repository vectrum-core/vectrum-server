const mongoose = require('mongoose');
const Email = mongoose.model('emails');
const log = require('../../logger').getLogger('SERVER:DB:EMAILS');
const { smartStringify: SS } = require('../lib');



async function getEmailById(_id) {
  const logTrace = 'getEmailById().';
  return new Promise(async (resolve, reject) => {
    const projection = {};
    try {
      const doc = await Email.findById(_id, projection);
      log.trace('%s Result:', logTrace, SS(doc));
      return resolve(doc);
    } catch (error) {
      log.error('%s Error:', logTrace, error);
      return reject(error);
    }
  });
}

async function getOrCreateEmail(email) {
  const logTrace = 'getOrCreateEmail().';
  return new Promise(async (resolve, reject) => {
    const projection = {};
    try {
      let doc = await Email.findById(email, projection);
      if (!doc) {
        doc = new Email({ email });
        await doc.save();
      }
      log.trace('%s Result:', logTrace, SS(doc));
      return resolve(doc);
    } catch (error) {
      log.error('%s Error:', logTrace, error);
      return reject(error);
    }
  });
}


module.exports = {
  getEmailById,
  getOrCreateEmail,
};
