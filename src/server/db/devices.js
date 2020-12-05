const mongoose = require('mongoose');
const Device = mongoose.model('devices');
const log = require('../../logger').getLogger('SERVER:DB:DEVICES');
const SS = require('../lib').smartStringify;



async function getDevice(_id) {
  const logTrace = 'getDevice().';
  return new Promise(async (resolve, reject) => {
    try {
      const doc = await Device.findById(_id);
      return resolve(doc);
    } catch (error) {
      log.error('%s Error:', logTrace, error);
      return reject(error);
    }
  });
}

async function updateDevice(params = {}) {
  const { _id, ip, info, useragent } = params;
  const logTrace = 'updateDevice().';
  return new Promise(async (resolve, reject) => {
    try {
      const update = {};
      if (ip) update.ip = ip;
      if (info) update.info = info;
      if (info) update.useragent = useragent;

      const doc = await Device.findByIdAndUpdate(
        _id, update, { new: true, upsert: true, }
      );
      return resolve(doc);
    } catch (error) {
      log.error('%s Error:', logTrace, error);
      return reject(error);
    }
  });
}


module.exports = {
  updateDevice,
  getDevice,
};
