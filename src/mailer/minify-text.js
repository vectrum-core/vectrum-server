module.exports = (options = {}) => {
  const defaulOptions = {};
  const opts = { ...defaulOptions, ...options, };

  return (mail, done) => {
    if (!mail || !mail.data || !mail.data.text) {
      return done();
    }

    mail.resolveContent(mail.data, 'text', (error, text) => {
      if (error) return done(error);
      try {
        text = text.replace(/ ‌/gi, ' ');
        text = text.replace(/‌/gi, ' ');
        while (text.includes('  ')) {
          text = text.replace(/  /gi, ' ');
        }
        mail.data.text = text;
      } catch (error) {
        done(error);
      }
      return done();
    });
  };
}
