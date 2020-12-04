module.exports = (options = {}) => {
  const { i18n } = options;

  return async (mail, done) => {
    if (!mail || !mail.data || !mail.data.context) {
      return done();
    }

    if (mail.data.context.language && mail.data.context.language !== i18n.language)
      await i18n.changeLanguage(mail.data.context.language);

    if (mail.data.subject)
      mail.data.subject = i18n.t(mail.data.subject);

    return done();
  }
}
