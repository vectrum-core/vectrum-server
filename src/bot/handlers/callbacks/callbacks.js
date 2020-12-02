const { msgOhSorry, } = require('../../messages');



const applyHandlersOfCallbacks = (bot) => {
  bot.on('callback_query', (ctx, next) => {
    const { callbackQuery } = ctx;
    return next().then(() => {
      ctx.log.debug(
        `{ "callback_query": {` +
        `"id": ${callbackQuery.id}, ` +
        `"data_length": ${callbackQuery.data.length}, ` +
        `"data": ${JSON.stringify(callbackQuery.data)} ` +
        `} }`
      );
      ctx.log.trace(`{ "callback_query": ${JSON.stringify(callbackQuery)} }`);
    });
  });


  bot.on('callback_query', (ctx) => {
    const { callbackQuery } = ctx;
    ctx.answerCbQuery(msgOhSorry(ctx));
    ctx.log.warn(
      'not found callback_query handler',
      'ctx.callbackQuery:',
      callbackQuery.data,
      JSON.stringify(callbackQuery)
    );
  });
}


module.exports = applyHandlersOfCallbacks;
