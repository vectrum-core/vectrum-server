const mongoose = require('mongoose');
const Mail = mongoose.model('mails');
const transporter = require('./transporter');
const i18nextConfig = require('../i18n/i18next-config');
const log = require('../logger').getLogger('MAILER:transporter:sendMail');



module.exports = (mailOptions = {}) => {
  const defaultOptions = {
    from: {
      name: cfg.get('mailer.from.name'),
      address: cfg.get('mailer.from.address'),
    },
    context: {},
  };
  const options = Object.assign({}, defaultOptions, mailOptions);
  if (!options.context.language)
    options.context.language = i18nextConfig.fallbackLng;

  return new Promise(async (resolve, reject) => {
    try {
      const ready = await transporter.verify();
      log.debug('Server is ready to take our messages.', ready);

      const info = await transporter.sendMail(options);
      log.debug(info);

      const messageId = info.messageId;
      const doc = await Mail.findOneAndUpdate({ messageId },
        { ...options, messageId, info },
        { new: true, }
      );

      log.info('Sended mail to %s, id: %s', options.to.address, messageId);

      return resolve(doc);
    } catch (error) {
      log.error('Error:', error);
      return reject(error);
    }
  });
};
