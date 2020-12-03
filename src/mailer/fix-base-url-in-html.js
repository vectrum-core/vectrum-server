module.exports = (options = {}) => {
  const defaulOptions = {
    baseUrl: '',
  };
  const opts = { ...defaulOptions, ...options, };

  return (mail, done) => {
    if (!mail || !mail.data || !mail.data.html) {
      return done();
    }

    mail.resolveContent(mail.data, 'html', (error, html) => {
      if (error) return done(error);
      while (html.match(/href=(["]{1,1})\//gi)) {
        html = html.replace(/href=(["]{1,1})\//gi, `href="${opts.baseUrl}/`);
      }
      while (html.match(/src=(["]{1,1})\//gi)) {
        html = html.replace(/src=(["]{1,1})\//gi, `src="${opts.baseUrl}/`);
      }

      mail.data.html = html;
      return done();
    });
  };
}
