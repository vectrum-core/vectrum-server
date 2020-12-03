const sessionOnMemory = require('telegraf/session');
const mongoose = require('mongoose');
const User = mongoose.model('users');
const TGUser = mongoose.model('tg_users');
const db = require('../db');
const i18n = require('../i18n');
const stage = require('../stage');
const getExtra = require('../extra');
const { kbStart } = require('../keyboards');
const { sendAgreeIsExpectedHandler, sendGreetingHandler } = require('../handlers/lib');



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
            session.user.status.agreed = true;
            await session.user.save();
            return sendGreetingHandler(ctx);
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
  const time = new Date().getTime();

  // Обновление данных или создание нового телегам пользователя
  let tgUser = await db.getTGUserById(ctx.from.id);
  if (tgUser === null) {
    tgUser = await db.createTGUser(ctx.from);
  } else {
    tgUser.last_active_at = time;
    await tgUser.save();
  }

  // Если пользователь в сессии отсутствует
  if (session.user === undefined) {
    // Получение записи пользователя из БД или создание нового пользователя
    let user = await db.getUserByTgUserId(ctx.from.id);
    if (user === null) {
      user = await db.createUserByTgUserId(ctx.from.id);
    } else {
      user.last_active_at = time;
      await user.save();
    }
    session.user = user;

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
        else if (session.user.tg_user.photo.small_file_unique_id !== data.photo.small_file_unique_id)
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
    session.user.last_active_at = time;
    await session.user.save();
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
    await session.user.save();
  }
}
