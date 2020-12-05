const KJUR = require('jsrsasign');
const mongoose = require('mongoose');
const JWK = mongoose.model('jwks');
const log = require('../../logger').getLogger('SERVER:DB:JWKS');
const SS = require('../lib').smartStringify;




async function getJwkPrivKey(header, callback) {
  const logTrace = 'getJwkPrivKey().';
  try {
    const doc = await JWK.findOne({ kid: header.kid });
    return callback(null, doc);
  } catch (error) {
    log.error('%s Error:', logTrace, error);
    return callback(error, null);
  }
}

async function getJwkPubKey(header, callback) {
  const logTrace = 'getJwkPubKey().';
  try {
    const doc = await JWK.findOne({ kid: header.kid }, { d: false });
    return callback(null, doc);
  } catch (error) {
    log.error('%s Error:', logTrace, error);
    return callback(error, null);
  }
}

async function getPubKeyObjByKid(kid) {
  const logTrace = 'getPubKeyObjByKid().';
  return new Promise(async (resolve, reject) => {
    try {
      const doc = await JWK.findOne({ kid }, { d: false });
      if (!doc)
        return doc;
      const obj = KJUR.KEYUTIL.getKey(doc);
      return resolve(obj);
    } catch (error) {
      log.error('%s Error:', logTrace, error);
      return reject(error);
    }
  });
}


async function getJwkPubKeys() {
  const logTrace = 'getJwkPubKeys().';
  return new Promise(async (resolve, reject) => {
    try {
      const docs = await JWK.find({}, { d: false });
      return resolve(docs);
    } catch (error) {
      log.error('%s Error:', logTrace, error);
      return reject(error);
    }
  });
}

module.exports = {
  getJwkPubKey,
  getPubKeyObjByKid,
  getJwkPubKey,
  getJwkPrivKey,
};
