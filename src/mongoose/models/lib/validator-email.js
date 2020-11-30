const validator = {
  validator: (text) => {
    let res = false;
    const re = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,})+$/;
    if (re.test(text)) res = true;
    return res;
  },
  message: 'Invalid email.',
};

module.exports = validator;
