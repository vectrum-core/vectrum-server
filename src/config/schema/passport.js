const schema = {
  passport: {
    password: {
      salt: {
        size: {
          doc: 'passport password salt size',
          format: Number,
          default: 16, //16,
        },
      },
      hash: {
        iterations: {
          doc: 'passport password hash iterations',
          format: Number,
          default: 10000, //10000,
        },
        keylen: {
          doc: 'passport password hash keylen',
          format: Number,
          default: 512,//512,
        },
        digest: {
          doc: 'passport password hash digest',
          format: String,
          default: 'sha512', //'sha512',
        },
      },
    }
  },
};

module.exports = schema;
