const {
  withWrongCommandHandler,
  sendShortInfoHandler, sendGreetingHandler, sendAgreeIsExpectedHandler,
} = require('./lib');



const applyHandlersOfMessages = (bot) => {
  bot.on(['connected_website'], (ctx) => {
    return sendShortInfoHandler(ctx);
  });


  bot.hears(/.+/gi, async (ctx, next) => {
    const { i18n, session } = ctx;

    switch (ctx.match[0]) {
      case i18n.t('Wallet'):
      case i18n.t('Exchange'):
      case i18n.t('Marketplace'):
        return sendShortInfoHandler(ctx);
      default:
        break;
    }

    return next();
  });


  // неизвестная команда или текст которые не отработаны обработчиками.
  bot.hears(/.+/gi, withWrongCommandHandler);
};


module.exports = applyHandlersOfMessages;
