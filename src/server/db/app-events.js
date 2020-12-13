const mongoose = require('mongoose');
const AppEvent = mongoose.model('app_events');
const log = require('../../logger').getLogger('SERVER:DB:APP_EVENTS');
const { smartStringify: SS } = require('../lib');



async function createAppEvent(api_key, device, user = undefined, type, location, data) {
  const logTrace = 'createAppEvent().';
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new AppEvent({ api_key, device, user, type, location, data });
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
  createAppEvent,
};
