// https://nodemailer.com/
const schema = {
  mailer: {
    host: {
      doc: 'The IP address/host to connect to smtp server.',
      format: '*',
      default: '127.0.0.1',
    },
    port: {
      doc: 'mailer smtp port.',
      format: 'port',
      default: 25,
    },
    secure: {
      doc: 'mailer secure.',
      format: Boolean,
      default: false,
    },
    auth: {
      user: {
        doc: 'mailer auth->user.',
        format: String,
        default: undefined,
      },
      pass: {
        doc: 'mailer auth->pass.',
        format: String,
        default: undefined,
      },
    },
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: {
        doc: 'mailer tls->rejectUnauthorized.',
        format: Boolean,
        default: false,
      },
    },
    attachDataUrls: {
      doc: 'mailer attachDataUrls',
      format: Boolean,
      default: true,
    },
    from: {
      name: {
        doc: 'mailer from name',
        format: String,
        default: 'NO REPLY',
      },
      address: {
        doc: 'mailer from address',
        format: String,
        default: 'noreply@localhost',
      },
    },
  }
};

module.exports = schema;
