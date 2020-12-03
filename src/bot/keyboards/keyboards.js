const {
  keyboard, inlineKeyboard,
  button, urlButton, callbackButton, loginButton,
} = require('telegraf/markup');
const { int_to_base58 } = require('base58');
const urlapi = require('url');
const cfg = require('../../config');




const kbStart = (ctx) => {
  const kbArray = [
    button('/start'),
  ];
  return keyboard(kbArray).resize();
}


const kbCancel = (ctx) => {
  const kbArray = [
    button(ctx.i18n.t('Cancel'))
  ];
  return keyboard(kbArray).resize();
}


const kbCancelNext = (ctx) => {
  const kbArray = [
    button(ctx.i18n.t('Cancel')),
    button(ctx.i18n.t('Next'))
  ];
  return keyboard(kbArray).resize();
}


const kbCancelSkip = (ctx) => {
  const kbArray = [
    button(ctx.i18n.t('Cancel')),
    button(ctx.i18n.t('Skip'))
  ];
  return keyboard(kbArray).resize();
}


const kbListAndCancel = (ctx, arr = []) => {
  const kbArray = [];
  kbArray.push(ctx.i18n.t('Cancel'));
  for (let i in arr)
    kbArray.push(button(arr[i]));
  return keyboard(kbArray).resize();
}


const kbIAgree = (ctx) => {
  const { i18n } = ctx;
  const kbArray = [];
  kbArray.push([
    button(i18n.t('I totally agree')),
  ]);
  return keyboard(kbArray).resize();
}


const kbMain = (ctx) => {
  const { i18n } = ctx;
  const kbArray = [];

  kbArray.push([
    button(i18n.t('Wallet')),
    button(i18n.t('Exchange')),
  ]);

  kbArray.push([
    button(i18n.t('Marketplace')),
  ]);

  return keyboard(kbArray).resize();
}


const ikbMenuShortInfo = (ctx) => {
  const { i18n } = ctx;
  const kbArray = [];

  const LoginUrl = {
    url: cfg.get('domains.root') + '/auth/tg',
    forward_text: 'forward_text',
    bot_username: cfg.get('bot.username'),
    request_write_access: true,
  }

  kbArray.push([
    loginButton(
      'Авторизоваться на ' + cfg.get('domains.root'),
      LoginUrl
    )
  ]);

  kbArray.push([
    urlButton(
      'Перейти в кошелек',
      cfg.get('domains.root') + '/wallet'
    )
  ]);

  kbArray.push([
    urlButton(
      'Перейти в обменник',
      cfg.get('domains.root') + '/exchange'
    )
  ]);

  kbArray.push([
    urlButton(
      'Перейти в маркетплейс',
      cfg.get('domains.root') + '/marketplace'
    )
  ]);

  return inlineKeyboard(kbArray);
}


const ikbMenuBack = (ctx, data) => {
  const { i18n } = ctx;
  const ts = int_to_base58(Math.round(new Date().getTime() / 1000));

  const kbArray = [];
  const pathname = data.back ? data.back : 'back';
  const query = { ts: ts, };
  kbArray.push([
    callbackButton(
      i18n.t('Back'),
      urlapi.format({ pathname, query, }),
    ),
  ]);
  return inlineKeyboard(kbArray);
}


module.exports = {
  kbStart,
  kbCancel,
  kbCancelNext,
  kbCancelSkip,
  kbListAndCancel,
  kbIAgree,
  kbMain,
  ikbMenuBack,
  ikbMenuShortInfo,
};
