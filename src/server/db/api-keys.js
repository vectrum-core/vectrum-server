const mongoose = require('mongoose');
const ApiKey = mongoose.model('api_keys');
const log = require('../../logger').getLogger('SERVER:DB:API_KEYS');



async function getApiKeyById(_id) {
  const logTrace = 'getApiKeyById().';
  return new Promise(async (resolve, reject) => {
    try {
      doc = await ApiKey.findById(_id).populate('key');
      return resolve(doc);
    } catch (error) {
      log.error('%s Error:', logTrace, error);
      return reject(error);
    }
  });
}


module.exports = {
  getApiKeyById,
};
