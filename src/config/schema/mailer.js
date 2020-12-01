const schema = {
  nodemailer: {
    host: {
      doc: 'The IP address/host to connect to smtp server.',
      format: '*',
      default: '127.0.0.1',
    },
    port: {
      doc: 'smtp port.',
      format: 'port',
      default: 25,
    },
    secure: {
      doc: 'nodemailer secure',
      format: Boolean,
      default: false,
    },
    auth: {
      user: {
        doc: 'nodemailer auth->user',
        format: String,
        default: undefined,
      },
      pass: {
        doc: 'nodemailer auth->pass',
        format: String,
        default: undefined,
      },
    },
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: {
        doc: 'nodemailer tls->rejectUnauthorized',
        format: Boolean,
        default: false,
      },
    },
    attachDataUrls: {
      doc: 'nodemailer attachDataUrls',
      format: Boolean,
      default: true,
    },
  }
};

module.exports = schema;
