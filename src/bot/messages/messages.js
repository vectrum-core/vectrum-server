const Handlebars = require('handlebars');
const cfg = require('../../config');



const hbsMsgAgreeTermsOfServiceEN = `
Are you confirm that you read and agree <a href="{{law_documents_url}}">terms of service</a>?
Please click on the button below to confirm.
`;
const hbsMsgAgreeTermsOfServiceRU = `
Вы подтверждаете, что ознакомились и согласны с <a href="{{law_documents_url}}">условиями предоставления услуг</a>?
Пожалуйста, нажмите на кнопку внизу чтобы подтвердить.
`;
const msgAgreeTermsOfService = (ctx) => {
  const { i18n } = ctx;
  let hbsText = '';
  switch (i18n.shortLanguageCode) {
    case 'en': hbsText = hbsMsgAgreeTermsOfServiceEN; break;
    case 'ru': hbsText = hbsMsgAgreeTermsOfServiceRU; break;
  }
  const template = Handlebars.compile(hbsText);
  const law_documents_url = cfg.get('domains.root') + '/terms';
  return template({ law_documents_url, });
}


const hbsMsgShortInfoEN = `
<b>{{bot_username}}</b>
`;
const hbsMsgShortInfoRU = `
<b>{{bot_username}}</b>
`;
const msgShortInfo = (ctx) => {
  const { i18n } = ctx;
  let hbsText = '';
  let bot_username = 'VECTRUM Bot';
  switch (i18n.shortLanguageCode) {
    case 'en': hbsText = hbsMsgShortInfoEN; break;
    case 'ru': hbsText = hbsMsgShortInfoRU; break;
  }
  const template = Handlebars.compile(hbsText);
  return template({
    bot_username,
  });
}


const hbsMsgGreetingEN = `
<b>Hello, {{user_first_name}}!</b>

This telegram bot is a part of <a href="{{company_url}}">{{company_name}}</a>!
`;
const hbsMsgGreetingRU = `
<b>Приветствую, {{user_first_name}}!</b>

Это телеграм бот часть <a href="{{company_url}}">{{company_name}}</a>!
`;
const msgGreeting = (ctx) => {
  const { i18n } = ctx;
  let hbsText = '';
  switch (i18n.shortLanguageCode) {
    case 'en': hbsText = hbsMsgGreetingEN; break;
    case 'ru': hbsText = hbsMsgGreetingRU; break;
  }
  const template = Handlebars.compile(hbsText);
  const user_first_name = ctx.from.first_name;
  const company_name = 'VECTRUM';
  const company_url = 'https://vectrum.group/';
  return template({
    user_first_name,
    company_name, company_url,
  });
}


const hbsMsgWrongCommandEN = `
⚠️ <b>Attention, the wrong command was most likely entered!</b>
`;
const hbsMsgWrongCommandRU = `
⚠️ <b>Внимание, вероятнее всего, была введена неверная команда!</b>
`;
const msgWrongCommand = (ctx) => {
  const { i18n } = ctx;
  let hbsText = '';
  switch (i18n.shortLanguageCode) {
    case 'en': hbsText = hbsMsgWrongCommandEN; break;
    case 'ru': hbsText = hbsMsgWrongCommandRU; break;
  }
  const template = Handlebars.compile(hbsText);
  return template({});
}


const hbsMsgOhSorryEN = `
Oh, sorry 😕
`;
const hbsMsgOhSorryRU = `
Ой, извините 😕
`;
const msgOhSorry = (ctx) => {
  const { i18n } = ctx;
  let hbsText = '';
  switch (i18n.shortLanguageCode) {
    case 'en': hbsText = hbsMsgOhSorryEN; break;
    case 'ru': hbsText = hbsMsgOhSorryRU; break;
  }
  const template = Handlebars.compile(hbsText);
  return template({});
}


const hbsMsgCancelledEN = `
<b>Cancelled</b>
`;
const hbsMsgCancelledRU = `
<b>Отменено</b>
`;
const msgCancelled = (ctx) => {
  const { i18n } = ctx;
  let hbsText = '';
  switch (i18n.shortLanguageCode) {
    case 'en': hbsText = hbsMsgCancelledEN; break;
    case 'ru': hbsText = hbsMsgCancelledRU; break;
  }
  const template = Handlebars.compile(hbsText);
  return template({});
}


module.exports = {
  msgAgreeTermsOfService,
  msgShortInfo,
  msgGreeting,
  msgWrongCommand,
  msgOhSorry,
  msgCancelled,
};
