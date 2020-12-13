const mongoose = require('mongoose');
const User = mongoose.model('users');
const Email = mongoose.model('emails');
const TgUser = mongoose.model('tg_users');
const log = require('../../logger').getLogger('SERVER:DB:USERS');
const { smartStringify: SS } = require('../lib');



async function getUserById(_id) {
  const logTrace = 'getUserById().';
  return new Promise(async (resolve, reject) => {
    const projection = {};
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


async function getUserByEmail(email) {
  const logTrace = 'getUserByEmail().';
  return new Promise(async (resolve, reject) => {
    const projection = {};
    try {
      const doc = await User.findOne({ email }, projection);
      log.trace('%s Result:', logTrace, SS(doc));
      return resolve(doc);
    } catch (error) {
      log.error('%s Error:', logTrace, error);
      return reject(error);
    }
  });
}


async function getUserByUsername(username) {
  const logTrace = 'getUserByUsername().';
  return new Promise(async (resolve, reject) => {
    const projection = {};
    try {
      const re = new RegExp(username);
      const doc = await User.findOne(
        { username: { $regex: re, $options: 'i' } }, projection
      );
      log.trace('%s Result:', logTrace, SS(doc));
      return resolve(doc);
    } catch (error) {
      log.error('%s Error:', logTrace, error);
      return reject(error);
    }
  });
}


async function getUserByTelegramId(tg_user) {
  const logTrace = 'getUserByTelegramId().';
  return new Promise(async (resolve, reject) => {
    const projection = {};
    try {
      const doc = await User.findOne({ tg_user }, projection);
      log.trace('%s Result:', logTrace, SS(doc));
      return resolve(doc);
    } catch (error) {
      log.error('%s Error:', logTrace, error);
      return reject(error);
    }
  });
}


async function createUserByEmailAndPassword(email, password, extra) {
  const logTrace = 'createUserByEmailAndPassword().';
  return new Promise(async (resolve, reject) => {
    try {
      let emailDoc = await Email.findById(email);
      if (!emailDoc) {
        emailDoc = new Email({ email });
        await emailDoc.save();
      }
      const doc = new User(
        { email, status: { agreed: true, }, ...extra }
      );
      await doc.setAndSavePassword(password);
      await doc.save();
      log.trace('%s Result:', logTrace, SS(doc));
      return resolve(doc);
    } catch (error) {
      log.error('%s Error:', logTrace, error);
      return reject(error);
    }
  });
}


async function createUserByUsernameAndPassword(username, password, extra) {
  const logTrace = 'createUserByUsernameAndPassword().';
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new User(
        { username, status: { agreed: true, }, ...extra }
      );
      await doc.setAndSavePassword(password);
      await doc.save();
      log.trace('%s Result:', logTrace, SS(doc));
      return resolve(doc);
    } catch (error) {
      log.error('%s Error:', logTrace, error);
      return reject(error);
    }
  });
}


async function createUserByTelegramAuthData(telegramAuthdata, extra) {
  const logTrace = 'createUserByTelegramAuthData().';
  return new Promise(async (resolve, reject) => {
    try {
      let tgUserDoc = await TgUser.findById(telegramAuthdata.id);
      if (!tgUserDoc) {
        tgUserDoc = new TgUser(telegramAuthdata);
        await tgUserDoc.save();
      }
      const doc = new User(
        { tg_user: tgUserDoc._id, status: { agreed: true, }, ...extra }
      );
      await doc.setAndSavePassword(password);
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
  getUserByEmail,
  getUserByUsername,
  getUserByTelegramId,
  createUserByEmailAndPassword,
  createUserByUsernameAndPassword,
  createUserByTelegramAuthData,
};
