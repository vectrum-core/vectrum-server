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
  }
};

module.exports = schema;
