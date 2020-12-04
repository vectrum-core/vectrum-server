const cfg = require('../config');
const i18n = require('./transporter').i18n;
const i18nextConfig = require('./i18n/i18next-config');
const sendMail = require('./send-mail');



const from = {
  name: cfg.get('mailer.from.name'),
  address: cfg.get('mailer.from.address'),
};


const sendVerifyYourEmail = async (params = {}) => {
  let { language, address, token, code, } = params;

  if (language && language !== i18n.language)
    await i18n.changeLanguage(mail.data.context.language);
  else language = i18nextConfig.fallbackLng;

  const options = {
    from,
    to: [{ address, }],
    subject: i18n.t('Your verification code', { code }),
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
