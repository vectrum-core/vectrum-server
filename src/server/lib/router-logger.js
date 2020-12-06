const logger = require('../../logger');



function getRouterLogger(req) {
  const loggerName = `SERVER:ROUTER:${req.method} "${req.originalUrl}"`;
  const log = logger.getLogger(loggerName);
  return log;
}


module.exports = {
  getRouterLogger,
};
