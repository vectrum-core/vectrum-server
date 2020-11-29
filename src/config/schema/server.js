const isProduction = process.env.NODE_ENV === 'production';



const schema = {
  server: {
    secure_mode: {
      doc: 'Server secure mode.',
      format: Boolean,
      default: isProduction ? true : false,
      env: 'SERVER_SECURE_MODE',
      arg: 'server-secure-mode',
    },
    host: {
      doc: 'The IP address to bind.',
      format: '*',
      default: '0.0.0.0',
      env: 'SERVER_HOST',
      arg: 'server-host',
    },
    exclusive: {
      doc: 'exclusive.',
      format: Boolean,
      default: false,
    },
    ipv6Only: {
      doc: 'ipv6 Only.',
      format: Boolean,
      default: false,
    },
    // HTTP
    http: {
      port: {
        doc: 'The HTTP port to bind.',
        format: 'port',
        default: isProduction ? 80 : 3001,
        env: 'SERVER_HTTP_PORT',
        arg: 'server-http-port',
      },
    },
    // HTTPS (TLS/SSL)
    https: {
      port: {
        doc: 'The HTTPS port to bind.',
        format: 'port',
        default: isProduction ? 443 : 4443,
        env: 'SERVER_HTTPS_PORT',
        arg: 'server-https-port',
      },
      // Certificate
      key: {
        doc: 'TLS/SSL key file name',
        format: String,
        default: undefined, //'privkey.pem',
        env: 'SERVER_HTTPS_KEY',
        arg: 'server-https-key',
      },
      cert: {
        doc: 'TLS/SSL sert file name',
        format: String,
        default: undefined, //'cert.pem',
        env: 'SERVER_HTTPS_SERT',
        arg: 'server-https-sert',
      },
      ca: {
        doc: 'TLS/SSL ca file name',
        format: String,
        default: undefined, //'chain.pem',
        env: 'SERVER_HTTPS_CA',
        arg: 'server-https-ca',
      },
      // PFX
      pfx: {
        doc: 'PFX file name',
        format: String,
        default: undefined, //'server.pfx',
        env: 'SERVER_HTTPS_PFX',
        arg: 'server-https-pfx',
      },
      pfx_pass: {
        doc: 'PFX passphrase',
        format: String,
        default: undefined, //'passphrase',
        env: 'SERVER_HTTPS_PFX_PASS',
        arg: 'server-https-pfx-pass',
      },
    },
  },
};

module.exports = schema;
