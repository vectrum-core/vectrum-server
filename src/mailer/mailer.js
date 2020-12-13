const cfg = require('../config');
const i18n = require('./transporter').i18n;
const i18nextConfig = require('./i18n/i18next-config');
const sendMail = require('./send-mail');



const from = {
  name: cfg.get('mailer.from.name'),
  address: cfg.get('mailer.from.address'),
};


const sendVerifyYourEmail = async (address, code, language) => {
  const options = {
    from,
    to: [{ address, }],
    subject: i18n.t('Your verification code', { code }),
    template: 'verify_your_email',
    context: {
      confirmCode: code,
      language,
    },
  };
  return sendMail(options);
};


const sendYourEmailVerified = (address, language) => {
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
