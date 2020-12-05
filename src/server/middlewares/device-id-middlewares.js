const _ = require('lodash');
const log = require('../../logger').getLogger('SERVER:APP:MIDLEWARES:DeviceId');
const db = require('../db');



const defaults = {
  requestProperty: 'device',
};


const deviceIdMiddleware = (options = {}) => {
  const logTrace = 'deviceIdMiddleware().';
  const opts = Object.assign({}, defaults, options);

  return async (req, res, next) => {
    let xDeviceId = _.get(req.headers, 'x-device', undefined);

    let device = _.get(req, opts.requestProperty, undefined);
    if (!device) {
      if (xDeviceId) {
        try {
          device = await db.getDevice(xDeviceId);
        } catch (error) {
          log.error('%s Error:', logTrace, error);
        }
      }

      if (device)
        _.set(req, opts.requestProperty, device);
    }

    return next();
  };
}


module.exports = {
  deviceIdMiddleware,
};

