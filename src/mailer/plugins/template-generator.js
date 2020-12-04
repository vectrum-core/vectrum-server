const path = require('path');
const expressHandlebars = require('express-handlebars');
const log = require('../../logger').getLogger('MAILER:PLUGINS:TemplateGenerator');



const TemplateGenerator = function (opts) {
  let viewEngine = opts.viewEngine || {};
  if (!viewEngine.renderView) {
    viewEngine = expressHandlebars.create(viewEngine);
  }
  this.viewEngine = viewEngine;
  this.viewPath = opts.viewPath;
  this.extName = opts.extName || '.hbs';
};


TemplateGenerator.prototype.render = function render(mail, done) {
  if (mail.data.html) {
    return done();
  };

  const templatePath = path.join(this.viewPath, mail.data.template + this.extName);

  this.viewEngine.renderView(templatePath, mail.data.context, (error, html) => {
    if (error) {
      log.error(error);
      return done();
    };

    mail.data.html = html;
    return done();
  });
};


module.exports = (options) => {
  const generator = new TemplateGenerator(options);
  return (mail, done) => {
    return generator.render(mail, done);
  }
}
