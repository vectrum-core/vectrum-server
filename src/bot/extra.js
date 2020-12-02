const Extra = require('telegraf/extra');



const getExtra = ({
  html = false, markdown = false,
  notifications = true, webPreview = false,
  keyboard = {},
}) => {
  return Extra
    .markdown(markdown).HTML(html)
    .notifications(notifications)
    .webPreview(webPreview)
    .markup(keyboard);
}


module.exports = getExtra;
