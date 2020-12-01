const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrementPlugin = require('mongoose-sequence')(mongoose);
const { v4: uuidv4, validate: uuidv4Validate } = require('uuid');
const uuidValidator = require('./lib/validator-uuid');
const mailAttachmentsSchema = require('./mail-attachments').schema;



const name = 'mails';

const addressObject = new Schema({
  name: { type: String, trim: true, },
  address: { type: String, trim: true, required: true, sparse: true, },
});

// https://nodemailer.com/message/
const schema = new Schema({
  num: { type: Number, },
  _id: {
    type: String, lowercase: true, trim: true,
    required: true, unique: true, default: uuidv4,
    validate: uuidValidator,
  },

  template: { type: String, default: undefined, },
  context: { type: Schema.Types.Mixed, default: {}, },

  // Common fields
  from: { type: addressObject, required: true, },
  to: [{ type: addressObject, required: true, }],
  cc: [{ type: addressObject, }],
  bcc: [{ type: addressObject, }],
  subject: { type: String, required: true, },
  text: { type: String, default: '', },
  html: { type: String, default: '', },
  //attachments: [{ ref: 'mail_attachments', type: Schema.Types.ObjectId, }],
  attachments: [{ type: mailAttachmentsSchema, }],
  message: { type: Schema.Types.Buffer, default: undefined, },

  // Routing options
  // An email address that will appear on the Sender: field (always prefer from if you’re not sure which one to use)
  sender: { type: String, default: undefined, },
  // An email address that will appear on the Reply-To: field
  replyTo: { type: String, default: undefined, },
  // The Message - ID this message is replying to
  inReplyTo: { type: String, default: undefined, },
  // Message - ID list(an array or space separated string)
  references: [{ type: String, default: undefined, }],
  // optional SMTP envelope, if auto generated envelope is not suitable(see SMTP envelope for details)
  envelope: { type: Schema.Types.Mixed, default: undefined, }, // https://nodemailer.com/smtp/envelope/

  // Content options
  // if true then convert data: images in the HTML content of this message to embedded attachments
  attachDataUrls: { type: Boolean, default: false, },
  // Apple Watch specific HTML version of the message. Latest watches have no problems rendering text/html content so watchHtml is most probably never seen by the recipient
  watchHtml: { type: String, default: undefined, },
  // AMP4EMAIL specific HTML version of the message, same usage as with text and html.See AMP example below for usage or this blogpost for sending and rendering
  amp: { type: String, default: undefined, },
  // iCalendar event to use as an alternative. See details here
  icalEvent: { type: Schema.Types.Mixed, default: undefined, }, // https://nodemailer.com/message/calendar-events/
  // An array of alternative text contents (in addition to text and html parts) (see Using alternative content for details)
  alternatives: [{ type: Schema.Types.Mixed, default: undefined, }], // https://nodemailer.com/message/alternatives/
  // identifies encoding for text/html strings (defaults to ‘utf-8’, other values are ‘hex’ and ‘base64’)
  encodin: { type: String, default: 'base64', },
  // existing MIME message to use instead of generating a new one. See details here
  raw: { type: String, default: undefined, },
  // force content-transfer-encoding for text values (either quoted-printable or base64). By default the best option is detected (for lots of ascii use quoted-printable, otherwise base64)
  textEncoding: { type: String, default: 'base64', },

  // Header options
  // Sets message importance headers, either ‘high’, ‘normal’ (default) or ‘low’.
  priority: { type: String, enum: ['high', 'normal', 'low'], default: 'high', },
  // An object or array of additional header fields(e.g. { “X- Key - Name”: “key value”} or [{ key: “X-Key - Name”, value: “val1”}, { key: “X - Key - Name”, value: “val2” }]).Read more about custom headers here
  headers: { type: Schema.Types.Mixed, default: {}, },
  // optional Message - Id value, random value will be generated if not set
  // '0186b521-052a-fceb-feab-5d98b7c09987'
  messageId: { type: String, default: undefined, index: true, unique: true, sparse: true },
  // optional Date value, current UTC string will be used if not set
  date: { type: Date, default: Date.now, },
  // helper for setting List -* headers(see more here)
  list: { type: Schema.Types.Mixed, default: undefined, }, // https://nodemailer.com/message/list-headers/

  // Security options
  // if true, then does not allow to use files as content. Use it when you want to use JSON data from untrusted source as the email. If an attachment or message node tries to fetch something from a file the sending returns an error. If this field is also set in the transport options, then the value in mail data is ignored
  disableFileAccess: { type: Boolean, default: undefined, },
  // if true, then does not allow to use Urls as content. If this field is also set in the transport options, then the value in mail data is ignored
  disableUrlAccess: { type: Boolean, default: undefined, },

  // info includes the result, the exact format depends on the transport mechanism used
  info: {
    // most transports should return the final Message- Id value used with this property
    // '<0186b521-052a-fceb-feab-5d98b7c09987@vectrum.group>'
    messageId: { type: String, index: true, unique: true, sparse: true, default: undefined, },
    // includes the envelope object for the message
    envelope: { type: Schema.Types.Mixed, default: undefined, }, // https://nodemailer.com/smtp/envelope/
    //is an array returned by SMTP transports(includes recipient addresses that were accepted by the server)
    accepted: [{ type: String, default: undefined, }],
    // is an array returned by SMTP transports(includes recipient addresses that were rejected by the server)
    rejected: [{ type: String, default: undefined, }],
    // is an array returned by Direct SMTP transport.Includes recipient addresses that were temporarily rejected together with the server response
    pending: [{ type: String, default: undefined, }],
    // is a string returned by SMTP transports and includes the last SMTP response from the server
    response: { type: String, default: undefined, },
  },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});


schema.pre('validate', async function (next) {
  if (!this._id) this._id = uuidv4();
  next();
});


schema.statics.validateId = (_id) => {
  return uuidv4Validate(_id);
};


schema.pre('save', async function (next) {
  this.messageId = `<${this._id}@vectrum.group>`;

  for (let i in this.attachments) {
    const doc = new this.model('mail_attachments')(this.attachments[i]);
    await doc.save();
    this.attachments[i] = doc;
  }
  return next();
});


schema.plugin(
  AutoIncrementPlugin,
  { id: name, inc_field: 'num', start_seq: 1, },
);


module.exports = mongoose.model(name, schema);
module.exports.name = name;
module.exports.schema = schema;
