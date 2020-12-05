const fs = require('fs');
const path = require('path');
const createError = require('http-errors');
const KJUR = require('jsrsasign');
const JWT = require('jsonwebtoken');
const cfg = require('../../config');
const db = require('../db');



const KEYUTIL = KJUR.KEYUTIL;
const jws = KJUR.jws;


const jwkPrivKeyPath = path.resolve(__dirname, cfg.get('data.dir'), 'jwk-key-priv.json');
const jwkPubKeyPath = path.resolve(__dirname, cfg.get('data.dir'), 'jwk-key-pub.json');

const jwkPrivKey = require(jwkPrivKeyPath);
const jwkPubKey = require(jwkPubKeyPath);

const objPrivKey = KEYUTIL.getKey(jwkPrivKey);
const objPubKey = KEYUTIL.getKey(jwkPubKey);





const typ = 'JWT';
const alg = 'ES256';
const iss = 'https://vectrum.group';
const issuers = [iss];

const keyAlg = 'EC';
const keyCurve = 'P-256'; // 'P-256' === 'secp256r1'


const generateKeypair = () => {
  const kp = KEYUTIL.generateKeypair(keyAlg, keyCurve);
  return kp;
}

const getJWKFromKeyObj = (keyObj) => {
  // keyObj = kp.prvKeyObj or kp.pubKeyObj
  const jwk = KEYUTIL.getJWKFromKey(keyObj);
  jwk.kid = jws.JWS.getJWKthumbprint(jwk);
  return jwk;
}

const getKidFromJWK = (jwk) => {
  const kid = jws.JWS.getJWKthumbprint(jwk);
  return kid;
}

const getKeyObjFromJWK = (jwk) => {
  const keyObj = KEYUTIL.getKey(jwk);
  return keyObj;
}

const verify = (sJWT, keyObj) => {
  const isValid = jws.JWS.verify(sJWT, keyObj, [alg]);
  return isValid;
}

const verifyJWT = (sJWT, keyObj) => {
  const acceptField = {
    alg: [alg],
    iss: [iss],
  };
  const isValid = jws.JWS.verifyJWT(sJWT, keyObj, acceptField);
  return isValid;
}

const createJWTFromData = (data, privKeyObj = jwkPrivKey) => {
  const oHeader = { alg: 'ES256', typ: 'JWT', kid: privKeyObj.kid, };
  const sHeader = JSON.stringify(oHeader);
  const iat = jws.IntDate.get('now');
  const oPayload = { iat, iss, };
  const sPayload = JSON.stringify(Object.assign({}, oPayload, data));
  const sJWT = jws.JWS.sign('ES256', sHeader, sPayload, getKeyObjFromJWK(privKeyObj));
  return sJWT;
}

const createJWSFromData = (data, privKeyObj = jwkPrivKey) => {
  const oHeader = { alg: 'ES256', typ: 'JWS', kid: privKeyObj.kid, };
  const sHeader = JSON.stringify(oHeader);
  const sPayload = JSON.stringify(data);
  return jws.JWS.sign('ES256', sHeader, sPayload, getKeyObjFromJWK(privKeyObj));
}


const decodeJWT = (sJWT) => {
  //const decoded = { header: { alg: 'ES256', typ: 'JWT', kid: '' }, payload: {}, signature: '' };
  const decoded = JWT.decode(jwt, { complete: true });
  return decoded;
}

const decodeAndVerifyJWT = async (sJWT) => {
  return new Promise(async (resolve, reject) => {
    const decoded = JWT.decode(sJWT, { complete: true });
    // Загрузка публичного ключа API клиента из базы
    const pubKeyObj = await db.getPubKeyObjByKid(decoded.header.kid);
    // ?!? проверка может ли ключ подписывать объект
    if (!pubKeyObj)
      return reject({ messge: `"kid": "${decoded.header.kid}" - Not Found` });
    const options = { alg: ['ES256'], };
    decoded.isValid = KJUR.jws.JWS.verifyJWT(sJWT, pubKeyObj, options);
    return resolve(decoded);
  });
}


const verifyJWTAndDecodeMiddleware = (options = {}) => {
  return async (req, res, next) => {
    const db = req.app.locals.db;
    const { apiKey } = req;
    const { jwt } = req.body;
    if (jwt) {
      try {
        const decoded = JWT.decode(jwt, { complete: true });
        if (decoded.header.kid !== apiKey.key.kid)
          return next(createError(500, `Header "X-API-KEY": "${apiKey.key._id}" - contains incorrect key!`));
        const pubKeyObj = KJUR.KEYUTIL.getKey(apiKey.key);
        //const pubKeyObj = await db.getPubKeyObjByKid(decoded.header.kid);
        if (!pubKeyObj)
          return next(createError(500, 'API Public Key - Not Found'));
        const options = { alg: ['ES256'], };
        const isValid = KJUR.jws.JWS.verifyJWT(jwt, pubKeyObj, options);
        if (isValid) {
          req.jwt = decoded;
          return next();
        } else {
          return next(createError(500, 'Invalid JWT signature.'));
        }
      } catch (error) {
        console.error(error);
        return next(createError(500, 'API Public Key - Error for verifing signature'));
      }
    } else
      req.jwt = null;
    return next();
  }
}


module.exports = {
  verifyJWTAndDecodeMiddleware,
  decodeAndVerifyJWT,
  decodeJWT,
  createJWSFromData,
  createJWTFromData,
  verifyJWT,
  verify,
  getKeyObjFromJWK,
  getKidFromJWK,
  getJWKFromKeyObj,
  generateKeypair,
  keyCurve,
  keyAlg,
  issuers,
  iss,
  alg,
  typ,
  jws,
  KEYUTIL,
};

/*
const kp = KEYUTIL.generateKeypair(keyAlg, keyCurve);
const jwkPriv = KEYUTIL.getJWKFromKey(kp.prvKeyObj);
jwkPriv.kid = jws.JWS.getJWKthumbprint(jwkPriv);
console.log(JSON.stringify(jwkPriv))
const jwkPub = KEYUTIL.getJWKFromKey(kp.pubKeyObj);
jwkPub.kid = jws.JWS.getJWKthumbprint(jwkPub);
console.log(JSON.stringify(jwkPub))
*/
