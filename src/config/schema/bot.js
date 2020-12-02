const schema = {
  bot: {
    token: {
      doc: "Telegram Bot Token",
      format: "TelegramBotToken",
      default: null,
      env: "BOT_TOKEN",
      arg: "bot-token",
    },
    username: {
      doc: "Telegram Bot username",
      format: String,
      default: undefined,
      env: "BOT_USERNAME",
      arg: "bot-username",
    },
  },
};

module.exports = schema;
