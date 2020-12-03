const mongoose = require('mongoose');
const User = mongoose.model('users');
const SS = require('../lib').smartStringify;
const log = require('../logger').getLogger('DB.USERS');



async function getUserById(_id) {
  const logTrace = 'getUserById().';
  return new Promise(async (resolve, reject) => {
    const projection = { password: false };
    try {
      const doc = await User.findById(_id, projection);
      log.trace('%s Result:', logTrace, SS(doc));
      return resolve(doc);
    } catch (error) {
      log.error('%s Error:', logTrace, error);
      return reject(error);
    }
  });
}


async function getUserByTgUserId(tgUserId) {
  const logTrace = 'getUserByTgUserId().';
  return new Promise(async (resolve, reject) => {
    const projection = { password: false };
    try {
      const doc = await User.findOne({ tg_user: tgUserId }, projection);
      log.trace('%s Result:', logTrace, SS(doc));
      return resolve(doc);
    } catch (error) {
      log.error('%s Error:', logTrace, error);
      return reject(error);
    }
  });
}


async function getUserByEmail(email) {
  const logTrace = 'getUserByEmail().';
  return new Promise(async (resolve, reject) => {
    const projection = { password: false };
    try {
      const doc = await User.findOne({ email: email }, projection);
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
  getUserById,
  getUserByTgUserId,
  getUserByEmail,
  createUserByTgUserId,
};
