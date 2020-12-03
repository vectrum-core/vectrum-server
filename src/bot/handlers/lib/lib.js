const getExtra = require('../../extra');
const {
  msgAgreeTermsOfService,
  msgShortInfo, msgGreeting,
  msgWrongCommand,
} = require('../../messages');
const {
  kbIAgree, kbMain,
  ikbMenuShortInfo,
} = require('../../keyboards');




function withWrongCommandHandler(ctx) {
  ctx.log.warn(`{"wrong_command:"${JSON.stringify(ctx.update)}}`);
  const text = msgWrongCommand(ctx);
  const keyboard = kbMain(ctx);
  const extra = getExtra({ html: true, keyboard });
  return ctx.reply(text, extra);
};


async function cmdStartHandler(ctx, next) {
  const { startPayload, session } = ctx;
  const { user } = session;
  if (user.status.agreed) {
    return sendShortInfoHandler(ctx)
      .then((message) => sendGreetingHandler(ctx));
  }
  return sendAgreeIsExpectedHandler(ctx);
}


async function sendAgreeIsExpectedHandler(ctx) {
  const text = msgAgreeTermsOfService(ctx);
  const keyboard = kbIAgree(ctx);
  const extra = getExtra({ html: true, keyboard });
  return ctx.reply(text, extra);
}


async function sendGreetingHandler(ctx) {
  const text = msgGreeting(ctx);
  const keyboard = kbMain(ctx);
  const extra = getExtra({ html: true, keyboard });
  return ctx.reply(text, extra);
}


async function sendShortInfoHandler(ctx) {
  const text = msgShortInfo(ctx);
  const keyboard = ikbMenuShortInfo(ctx);
  const extra = getExtra({ html: true, keyboard });
  return ctx.reply(text, extra);
}


module.exports = {
  withWrongCommandHandler,
  cmdStartHandler,
  sendAgreeIsExpectedHandler,
  sendGreetingHandler,
  sendShortInfoHandler,
};
