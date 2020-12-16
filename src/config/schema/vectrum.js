const schema = {
  vectrum: {
    node: {
      doc: 'VECTRUM node endpoint.',
      format: String,
      default: 'http://127.0.0.1:8888',
    },
    wallet: {
      doc: 'VECTRUM wallet (keystore) endpoint.',
      format: String,
      default: 'http://127.0.0.1:8899',
    },
    hyperion: {
      doc: 'VECTRUM hyperion endpoint.',
      format: String,
      default: 'http://127.0.0.1:8080',
    },
    robot: {
      keys: {
        owner: {
          doc: 'VECTRUM Robot owner key.',
          format: String,
          default: undefined,
        },
        active: {
          doc: 'VECTRUM Robot active key.',
          format: String,
          default: undefined,
        },
      }
    }
  }
};

module.exports = schema;
