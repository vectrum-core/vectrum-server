const {
  withWrongCommandHandler,
  sendShortInfoHandler, sendGreetingHandler, sendAgreeIsExpectedHandler,
} = require('./lib');



const applyHandlersOfMessages = (bot) => {
  bot.on(['connected_website'], (ctx) => {
    return sendShortInfoHandler(ctx)
      .then((message) => sendAgreeIsExpectedHandler(ctx));
  });

  // неизвестная команда или текст которые не отработаны обработчиками.
  bot.hears(/.+/gi, withWrongCommandHandler);
};


module.exports = applyHandlersOfMessages;
