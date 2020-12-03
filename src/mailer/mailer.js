const cfg = require('../config');
const sendMail = require('./send-mail');



const from = {
  name: cfg.get('mailer.from.name'),
  address: cfg.get('mailer.from.address'),
};


const sendVerifyYourEmail = (params = {}) => {
  const { language, address, token, code, } = params;
  const options = {
    from,
    to: [{ address, }],
    subject: 'Verify your email',
    template: 'verify_your_email',
    context: {
      confirmLink: `/verify/${token}`,
      confirmCode: code,
      language,
    },
  };
  return sendMail(options);
};


const sendYourEmailVerified = (params = {}) => {
  const { language, address, } = params;
  const options = {
    from,
    to: [{ address, }],
    subject: 'Your email is verified',
    template: 'your_email_is_verified',
    context: {
      language,
    },
  };
  return sendMail(options);
};


module.exports = () => {
  return {
    sendYourEmailVerified,
    sendVerifyYourEmail,
    sendMail,
  };
};
