const createError = require('http-errors');
const KJUR = require('jsrsasign');
const util = require('util');
const _ = require('lodash');
const db = require('../db');



const defaults = {
  requestProperty: 'apiKey',
  permissionsProperty: 'permissions',
};

function isString(value) {
  return typeof value === 'string';
}

function isArray(value) {
  return value instanceof Array;
}


const apiKeyMiddleware = (options = {}) => {
  const opts = Object.assign({}, defaults, options);

  return async (req, res, next) => {
    if (req.method === 'OPTIONS')
      return next();

    const xApiKey = _.get(req.headers, 'x-api-key', undefined);
    const xIdentity = _.get(req.headers, 'x-identity', undefined);
    const xSignature = _.get(req.headers, 'x-signature', undefined);

    if (!xApiKey)
      return next(createError(401, 'Header "X-API-KEY" required!'));

    let apiKey = _.get(req, opts.requestProperty, undefined);
    if (!apiKey || apiKey._id !== xApiKey) {
      apiKey = await db.getApiKeyById(xApiKey);
      if (apiKey.key.kid !== xIdentity) {
        return next(createError(401, `Header "X-IDENTITY": "${xIdentity}" - is wrong!`));
      }
      delete apiKey.key.d;
      apiKey.pubKeyObj = KJUR.KEYUTIL.getKey(apiKey.key);
    }
    if (!apiKey)
      return next(createError(401, `Header "X-API-KEY": "${xApiKey}" - Not found!`));
    if (apiKey.blocked)
      return next(createError(401, `Header "X-API-KEY": "${xApiKey}" - Blocked!`));


    const md = new KJUR.crypto.MessageDigest({ alg: 'sha256', prov: 'cryptojs' });
    const reqUrl = `${req.protocol}://${req.headers.host}${req.originalUrl}`;
    md.updateString(reqUrl);
    if (req.method !== 'GET') md.updateString(JSON.stringify(req.body));
    const mdHex = md.digest();
    const xSignatureHex = KJUR.b64utohex(xSignature);
    const signatureVerifyed = apiKey.pubKeyObj.verifyHex(mdHex, xSignatureHex, apiKey.pubKeyObj.pubKeyHex);
    if (!signatureVerifyed)
      return next(createError(500, `Header "X-SIGNATURE": "${xSignature}" - WRONG!`));

    _.set(req, opts.requestProperty, apiKey);

    return next();
  };
}


// https://github.com/MichielDeMey/express-jwt-permissions/blob/master/index.js
const apiKeyPermissionsMiddleware = (required) => {
  if (isString(required)) {
    required = [[required]];
  } else if (isArray(required) && required.every(isString)) {
    required = [required];
  }

  return async (req, res, next) => {
    let apiKey = _.get(req, defaults.requestProperty, undefined);
    if (!apiKey)
      return next(createError(401, `Header "X-API-KEY": "${xApiKey}" - Not found!`));
    if (apiKey.blocked)
      return next(createError(401, `Header "X-API-KEY": "${xApiKey}" - Blocked!`));


    let permissions = _.get(apiKey, defaults.permissionsProperty, undefined);
    if (typeof permissions === 'string')
      permissions = permissions.split(' ');
    if (!Array.isArray(permissions))
      return next(createError(500, 'Permissions should be an Array or String. Bad format?'));


    const sufficient = required.some((required) => {
      return required.every((permission) => {
        return permissions.indexOf(permission) !== -1;
      });
    });
    return next(!sufficient ? createError(403, 'Permission denied!') : null);
  };
}

module.exports.apiKeyMiddleware = apiKeyMiddleware;
module.exports.apiKeyPermissionsMiddleware = apiKeyPermissionsMiddleware;
//module.exports.apiKeyStatsMiddleware = apiKeyStatsMiddleware;
