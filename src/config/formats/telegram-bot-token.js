const validate = (val) => {
  if (val !== null) {
    if (typeof val !== 'string') {
      throw new TypeError(`'${val}' is not a String! TelegramBotToken must be a String!`);
    }
    if (!val.includes(':')) {
      throw new TypeError(`'${val}' is not valid a TelegramBotToken!`);
    }
    const elements = val.split(':');
    if (elements.length !== 2) {
      throw new TypeError(`'${val}' is not valid a TelegramBotToken!`);
    }
    if (Number.isInteger(elements[0])) {
      throw new TypeError(`Telegram Bot id '${elements[0]}' must be a Integer!`);
    }

    return true;
  }
  throw new TypeError('Telegram Bot Token is required');
}

const coerce = (val) => {
  return val;
}

module.exports = {
  validate,
  coerce,
};
