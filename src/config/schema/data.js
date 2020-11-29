const schema = {
  data: {
    dir: {
      doc: 'data dir full path',
      format: String,
      default: '../../data',
      env: 'DATA_DIR',
      arg: 'data-dir',
    }
  },
};

module.exports = schema;
