const KJUR = require('jsrsasign');
const mongoose = require('mongoose');
const JWT = mongoose.model('jwts');
const log = require('../../logger').getLogger('SERVER:DB:JWKS');



async function delJwtById(id) {
  const logTrace = 'delJwtById().';
  return new Promise(async (resolve, reject) => {
    try {
      const count = await JWT.remove({ _id: id });
      return resolve(count);
    } catch (error) {
      log.error('%s Error:', logTrace, error);
      return reject(error);
    }
  });
}


module.exports = {
  delJwtById,
};
