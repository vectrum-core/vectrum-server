const cfg = require('../config');



const smartStringify = (obj) => {
  if (cfg.get('env') === 'production')
    return JSON.stringify(obj);
  else
    return JSON.stringify(obj, null, 2);
}

module.exports = smartStringify;
