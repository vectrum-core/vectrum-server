const { v4: uuidv4, validate } = require('uuid');



const validator = {
  validator: (text) => {
    return validate(text);
  },
  message: 'Invalid uuid.',
};

module.exports = validator;
