const { minify } = require('html-minifier');
const log = require('../../logger').getLogger('MAILER:PLUGINS:MinifyHtml');



module.exports = (options = {}) => {
  const defaulOptions = {
    collapseWhitespace: true,
    conservativeCollapse: true,
    collapseInlineTagWhitespace: true,
    preserveLineBreaks: false,
    minifyCSS: true,
    minifyJS: true,
    processConditionalComments: true,
    removeComments: true,
    removeEmptyAttributes: true,
    removeEmptyElements: true,
    useShortDoctype: true,
    trimCustomFragments: true,
  };
  const opts = { ...defaulOptions, ...options, };

  return (mail, done) => {
    if (!mail || !mail.data || !mail.data.html) {
      return done();
    }

    mail.resolveContent(mail.data, 'html', (error, html) => {
      if (error) {
        log.error(error);
        return done(error);
      }

      try {
        mail.data.html = minify(html, opts);
        return done();
      } catch (error) {
        log.error(error);
        return done(error);
      }
    });
  };
}
