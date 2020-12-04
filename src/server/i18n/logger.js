const logger = require('../../logger').getLogger('SERVER:I18N');



module.exports = {
  type: 'logger',
  log: (args) => { logger.debug(args) },
  warn: (args) => { logger.warn(args) },
  error: (args) => { logger.error(args) },
}
