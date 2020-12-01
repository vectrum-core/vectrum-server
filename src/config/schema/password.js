const schema = {
  password: {
    salt: {
      size: {
        doc: 'Password salt size in bytes.',
        format: Number,
        default: 16, // 16,
      },
    },
    hash: {
      iterations: {
        doc: 'Password hash iterations.',
        format: Number,
        default: 10000, // 10000,
      },
      keylen: {
        doc: 'Password hash keylen.',
        format: Number,
        default: 512, // 512,
      },
      digest: {
        doc: 'Password hash digest.',
        format: String,
        default: 'sha512', // 'sha512',
      },
    },
  }
};

module.exports = schema;
