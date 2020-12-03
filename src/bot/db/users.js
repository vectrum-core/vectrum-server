const mongoose = require('mongoose');
const User = mongoose.model('users');
const SS = require('../../lib').smartStringify;
const log = require('../../logger').getLogger('DB.TG_USERS');



async function getUserByTgUserId(tgUserId) {
  const logTrace = 'getUserByTgUserId().';
  return new Promise(async (resolve, reject) => {
    const projection = { password: false };
    try {
      const doc = await User.findOne({ tg_user: tgUserId }, projection).populate('tg_user');
      log.trace('%s Result:', logTrace, SS(doc));
      return resolve(doc);
    } catch (error) {
      log.error('%s Error:', logTrace, error);
      return reject(error);
    }
  });
}


async function createUserByTgUserId(tgUserId) {
  const logTrace = 'createUserByTgUserId().';
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new User({ tg_user: tgUserId });
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
  getUserByTgUserId,
  createUserByTgUserId,
};
