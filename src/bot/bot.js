const { Telegraf } = require('telegraf');
const cfg = require('../config');
const applyContext = require('./context');
const applyMiddlewares = require('./middlewares');
const applyHandlers = require('./handlers');



module.exports = () => {
  const bot = initialize();
  return bot;
}


function initialize() {
  const token = cfg.get('bot.token');
  const config = getBotConfig();
  const bot = new Telegraf(token, config);
  applyContext(bot);
  applyMiddlewares(bot);
  applyHandlers(bot);
  return bot;
}

function getBotConfig() {
  const config = {
    telegram: {                         // Telegram options
      agent: null,                      // https.Agent instance, allows custom proxy, certificate, keep alive, etc.
      webhookReply: false,              // Reply via webhook
    },
    username: cfg.get('bot.username'),  // Bot username (optional)
    channelMode: false,                 // Handle `channel_post` updates as messages (optional)
  };

  return config;
}
