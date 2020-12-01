// https://www.npmjs.com/package/passport-jwt
// https://www.npmjs.com/package/express-jwt
// https://www.npmjs.com/package/jsonwebtoken
// https://jwt.io/
// https://www.iana.org/assignments/jwt/jwt.xhtml
// https://medium.com/nuances-of-programming/%D1%83%D1%87%D0%B8%D0%BC%D1%81%D1%8F-%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%B0%D1%82%D1%8C-%D1%81-%D0%B0%D1%83%D1%82%D0%B5%D0%BD%D1%82%D0%B8%D1%84%D0%B8%D0%BA%D0%B0%D1%86%D0%B8%D0%B5%D0%B9-%D0%B2-node-%D0%B8%D1%81%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D1%83%D1%8F-passport-js-58c14b9fe823
const crypto = require('crypto');



const schema = {
  jwt: {
    algorithms: {
      doc: 'jwt algorithms',
      format: Array,
      default: ['HS256', 'ES256', 'RS256'],
    },
    sign_by: {
      doc: 'jwt sign by',
      format: ['key', 'secret'],
      default: 'secret',
    },
    secret: {
      doc: 'jwt secret',
      format: String,
      default: crypto.randomBytes(64).toString('hex'),
    },
    secret_algorithm: {
      doc: 'jwt algorithm',
      format: String,
      default: 'HS256',
    },
    key_algorithm: {
      doc: 'jwt algorithm',
      format: String,
      default: 'ES256',
    },
    expiresInDays: {
      doc: 'jwt expiresIn Days',
      format: Number,
      default: 365,
    },
    issuer: {
      doc: 'jwt issuer',
      format: String,
      default: 'http://localhost.local',
    },
  }
};

module.exports = schema;
