const mongoose = require('mongoose');
const Mail = mongoose.model('mails');
const log = require('../../logger').getLogger('MAILER:PLUGINS:SaveMail');



module.exports = (options = {}) => {
  const defaulOptions = {};
  const opts = { ...defaulOptions, ...options, };

  return async (mail, done) => {
    if (!mail || !mail.data)
      return done();

    if (mail.data.notSave)
      return done();

    try {
      const doc = new Mail(mail.data);
      await doc.save();
      mail.data = doc.toObject();
      return done();
    } catch (error) {
      log.error(error);
      return done(error);
    }
  };
}
