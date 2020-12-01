const schema = {
  domains: {
    root: {
      doc: 'Root domain',
      format: String,
      default: 'http://127.0.0.1',
    },
    api: {
      doc: 'API domain',
      format: String,
      default: 'http://127.0.0.1',
    },
  },
};

module.exports = schema;
