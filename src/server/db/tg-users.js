const mongoose = require('mongoose');
const TGUser = mongoose.model('tg_users');
const log = require('../../logger').getLogger('SERVER:DB:TG_USERS');
const { smartStringify: SS } = require('../lib');



async function getTGUserById(_id) {
  const logTrace = 'getTGUserById().';
  return new Promise(async (resolve, reject) => {
    const projection = {};
    try {
      const doc = await TGUser.findById(_id, projection);
      log.trace('%s Result:', logTrace, SS(doc));
      return resolve(doc);
    } catch (error) {
      log.error('%s Error:', logTrace, error);
      return reject(error);
    }
  });
}


async function createTGUser(tgUser) {
  const logTrace = 'createTGUser()).';
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new TGUser({ ...tgUser });
      await doc.save();
      log.trace('%s Result:', logTrace, SS(doc));
      return resolve(doc);
    } catch (error) {
      log.error('%s Error:', logTrace, error);
      return reject(error);
    }
  });
}


module.exports = {
  getTGUserById,
  createTGUser,
};
