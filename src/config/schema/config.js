const schema = {
  config: {
    file: {
      name: {
        doc: 'config file name',
        format: String,
        default: 'config.json',
        env: 'CONFIG_FILE_NAME',
        arg: 'config-file-name',
      },
      path: {
        doc: 'config file full path',
        format: String,
        default: '',
        env: 'CONFIG_FILE_PATH',
        arg: 'config-file-path',
      },
      save: {
        doc: 'Force save/rewrite config file (The App will be shutdown)',
        format: Boolean,
        default: false,
        env: 'CONFIG_FILE_SAVE',
        arg: 'config-file-save',
      },
      print: {
        doc: 'Print config file to console (The App will be shutdown)',
        format: Boolean,
        default: false,
        env: 'CONFIG_FILE_PRINT',
        arg: 'config-file-print',
      },
    },
  },
};

module.exports = schema;
