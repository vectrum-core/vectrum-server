const validator = {
  validator: function (text) {
    let res = false;
    const re = /^([a-z1-5]{1,12})|([a-z]{1,1})([a-z1-5\.]{0,10})([a-z1-5]{1,1})+$/;
    if (re.test(text)) res = true;
    return res;
  },
  message: 'Invalid VECTRUM account name.',
};

module.exports = validator;
