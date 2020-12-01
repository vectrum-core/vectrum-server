const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrementPlugin = require('mongoose-sequence')(mongoose);



const name = 'mail_attachments';

// https://nodemailer.com/message/attachments/
const schema = new Schema({
  num: { type: Number, },
  // filename to be reported as the name of the attached file. Use of unicode is allowed.
  filename: { type: String, trim: true, default: undefined, },
  // String, Buffer or a Stream contents for the attachment
  content: { type: Schema.Types.Buffer, default: undefined, },
  // path to the file if you want to stream the file instead of including it (better for larger attachments)
  path: { type: String, trim: true, default: undefined, },
  // an URL to the file (data uris are allowed as well)
  href: { type: String, trim: true, default: undefined, },
  // optional HTTP headers to pass on with the href request, eg. {authorization: "bearer ..."}
  httpHeaders: { type: Schema.Types.Mixed, trim: true, default: undefined, },
  // optional content type for the attachment, if not set will be derived from the filename property
  contentType: { type: String, trim: true, default: undefined, },
  // optional content disposition type for the attachment, defaults to ‘attachment’
  contentDisposition: { type: String, trim: true, default: undefined, },
  // optional content id for using inline images in HTML message source
  cid: { type: String, trim: true, default: undefined, },
  // If set and content is string, then encodes the content to a Buffer using the specified encoding. Example values: ‘base64’, ‘hex’, ‘binary’ etc. Useful if you want to use binary attachments in a JSON formatted email object.
  encoding: { type: String, trim: true, default: undefined, },
  // custom headers for the attachment node. Same usage as with message headers
  headers: { type: Schema.Types.Mixed, trim: true, default: undefined, },
  // is an optional special value that overrides entire contents of current mime node including mime headers.Useful if you want to prepare node contents yourself
  raw: { type: String, default: undefined, },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});


schema.plugin(
  AutoIncrementPlugin,
  { id: name, inc_field: 'num', start_seq: 1, },
);


module.exports = mongoose.model(name, schema);
module.exports.name = name;
module.exports.schema = schema;
