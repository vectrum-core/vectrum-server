const { createHash, createHmac } = require('crypto');



function checkTelegramAuthData(params = {}) {
  const { token, hash, ...data } = params;

  const secret = createHash('sha256')
    .update(token)
    .digest();

  const stringToCheck = Object.keys(data)
    .sort()
    .map((key) => (`${key}=${data[key]}`))
    .join('\n');

  const hmac = createHmac('sha256', secret)
    .update(stringToCheck)
    .digest('hex');

  return hmac === hash;
}


module.exports = {
  checkTelegramAuthData,
};
