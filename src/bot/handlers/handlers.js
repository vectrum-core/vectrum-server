const applyHandlersOfCallbacks = require('./callbacks');
const applyHandlersOfCommands = require('./commands');
const applyHandlersOfMessages = require('./messages');



const applyHandlers = (bot) => {
  applyHandlersOfCallbacks(bot);
  applyHandlersOfCommands(bot);
  applyHandlersOfMessages(bot);
}


module.exports = applyHandlers;
