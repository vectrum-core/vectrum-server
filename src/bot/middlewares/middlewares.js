const sessionOnMemory = require('telegraf/session');
const mongoose = require('mongoose');
const User = mongoose.model('users');
const TGUser = mongoose.model('tg_users');
const i18n = require('../i18n');
const stage = require('../stage');
const getExtra = require('../extra');
const { kbStart } = require('../keyboards');
const { sendAgreeIsExpectedHandler, cmdStartHandler } = require('../handlers/lib');



const applyMiddlewares = (bot) => {
  bot.catch((error, ctx) => {
    ctx.log.error(`Bot Error catched! Ooops, ecountered an error for '${ctx.updateType}'`, error);
  });

  bot.use((ctx, next) => {
    ctx.log.trace(`{"update":${JSON.stringify(ctx.update)}}`);
    return next();
  });


  bot.use(sessionOnMemory())
  bot.use(i18n.middleware());
  bot.use(stage.middleware());


  bot.use(async (ctx, next) => {
    const { log, i18n, session } = ctx;
    if (session.temp === undefined) session.temp = {};

    await updateUser(ctx);

    if (session.user.status.blocked) {
      log.warn(`{"user_blocked":${JSON.stringify(session.user)}}`);
      switch (ctx.updateType) {
        case 'message': {
          const keyboard = kbStart(ctx);
          const extra = getExtra({ html: true, keyboard });
          return ctx.reply('Something wrong...', extra);
        }
        case 'callback_query': {
          ctx.answerCbQuery('Something wrong...');
          const keyboard = kbStart(ctx);
          const extra = getExtra({ html: true, keyboard });
          return ctx.reply('Something wrong...', extra);
        }
        default:// Игнорирование других типов обновлений
          return;
      }
    }

    if (!session.user.status.agreed) { // Если еще не согласился с условиями
      switch (ctx.updateType) {
        case 'message': {
          if (ctx.message.text === i18n.t('I totally agree')) { // согласие получено
            const doc = await User.findOneAndUpdate(
              { tg_user: ctx.from.id },
              { 'status.agreed': true, },
              { new: true, }
            ).populate('tg_user');
            session.user = doc.toJSON();
            return cmdStartHandler(ctx);
          }
          // любое другое текстовое сообщение
        }
        default: // по дефолту и если тип не message
          return sendAgreeIsExpectedHandler(ctx);
      }
    }
    // далее если соглашение принято
    return next();
  });
}


module.exports = applyMiddlewares;


async function updateUser(ctx) {
  const { session } = ctx;

  // Обновление данных или создание нового телегам пользователя
  const tg_user = await TGUser.findOneAndUpdate(
    { id: ctx.from.id },
    Object.assign({}, ctx.from, { last_active_at: new Date().getTime(), }),
    { new: true, upsert: true, }
  );

  // Если пользователь в сессии отсутствует
  if (session.user === undefined) {
    // Получение записи пользователя из БД или создание нового пользователя
    let doc = await User.findOneAndUpdate(
      { tg_user: ctx.from.id },
      { last_active_at: new Date().getTime(), },
      { new: true, upsert: true, }
    ).populate('tg_user');
    // Если пользователь не привязан к телегам пользователю,
    // то создание нового пользователя. Пользователь телеграм создан выше.
    if (doc === null) {
      doc = await User.findOneAndUpdate(
        { tg_user: ctx.from.id },
        Object.assign({}, { tg_user: tg_user, last_active_at: new Date().getTime(), }),
        { new: true, upsert: true, }
      );
    }
    session.user = doc.toJSON();

    // Установка значений по умолчанию и обновление.
    await setDefaultsForNewUser(ctx);

    // Обновление фото телеграм пользователя
    ctx.getChat()
      .then(async (data) => {
        if (!session.user || !session.user.tg_user || !session.user.tg_user.photo)
          await TGUser.findOneAndUpdate(
            { id: ctx.from.id },
            Object.assign({}, data),
            { upsert: true, }
          );
        else if (session.user.photo.tg_user.small_file_unique_id !== data.photo.tg_user.small_file_unique_id)
          await TGUser.findOneAndUpdate(
            { id: ctx.from.id },
            Object.assign({}, data),
            { upsert: true, }
          );
      })
      .catch((error) => {
        ctx.log.error(`getChat(). Catrched error:`, error);
      });
  } else {
    // Если есть в сессии, то обновляем дату и загружаем свежие данные
    let doc = await User.findOneAndUpdate(
      { tg_user: ctx.from.id },
      { last_active_at: new Date().getTime(), },
      { new: true, upsert: true, }
    ).populate('tg_user');
    session.user = doc.toJSON();
  }
}


async function setDefaultsForNewUser(ctx) {
  const { session, i18n, } = ctx;
  let update = false;

  if (session.user.language === undefined) {
    session.user.language = i18n.locale();
    update = true;
  } else
    i18n.locale(session.user.language);

  if (update) {
    let doc = await User.findOneAndUpdate(
      { tg_user: ctx.from.id },
      Object.assign({}, session.user),
      { new: true, upsert: true, }
    ).populate('tg_user');
    session.user = doc.toJSON();
  }
}
