const validator = {
  validator: function (text) {
    let res = false;
    const re = /^([a-z]{1,1})([a-z0-9_]{0,31})([a-z0-9]{1,1})+$/i;
    if (re.test(text)) res = true;
    return res;
  },
  message: 'Invalid username.',
};

module.exports = validator;
