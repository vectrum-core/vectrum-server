const log = require('../../logger').getLogger('BOT');



const applyContext = (bot) => {
  bot.context.log = log;
}


module.exports = applyContext;
