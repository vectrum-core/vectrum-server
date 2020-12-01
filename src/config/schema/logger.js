const os = require('os');



const schema = {
  logger: {
    level: {
      doc: 'Logger level',
      format: ['fatal', 'error', 'warn', 'info', 'debug', 'trace'],
      default: isProd ? 'info' : 'trace',
    },
    appenders: {
      stdout: {
        doc: 'Logger appender stdout',
        format: Boolean,
        default: false,
      },
      stderr: {
        doc: 'Logger appender stderr',
        format: Boolean,
        default: false,
      },
      gelf: {
        doc: 'Logger appender gelf',
        format: Boolean,
        default: false,
      },
      file: {
        doc: 'Logger appender file',
        format: Boolean,
        default: false,
      },
    },
    gelf: {
      host: {
        doc: 'logger gelf host',
        format: '*',
        default: '127.0.0.1', // host - string(defaults to localhost) - the gelf server hostname
      },
      port: {
        doc: 'logger gelf port',
        format: 'port',
        default: 12201, //port - integer(defaults to 12201) - the port the gelf server is listening on
      },
      hostname: {
        doc: 'logger gelf hostname',
        format: String,
        default: os.hostname(), // hostname - string(defaults to OS.hostname()) - the hostname used to identify the origin of the log messages.
      },
      facility: {
        doc: 'logger gelf facility',
        format: String,
        default: os.hostname(), // facility - string(optional)
      },
      customFields: {
        doc: 'logger gelf customFields',
        format: Object,
        default: {}, // customFields: { '_something': 'yep' }, // customFields - object(optional) - fields to be added to each log message; custom fields must start with an underscore.
      },
    },
    file: {
      name: {
        doc: 'logger.file.name',
        format: String,
        default: 'debug.log',
      },
      pattern: {
        doc: 'logger.file.pattern',
        format: String,
        default: '.yyyy-MM-dd-hh',
      },
      keep_file_ext: {
        doc: 'logger.file.keep_file_ext',
        format: Boolean,
        default: true, // - boolean (default false) - preserve the file extension when rotating log files (file.log becomes file.2017-05-30.log instead of file.log.2017-05-30).
      },
      encoding: {
        doc: 'logger.file.encoding',
        format: String,
        default: 'utf-8', // - string (default “utf-8”)
      },
      mode: {
        doc: 'logger.file.mode',
        format: Number,
        default: 0o777, // - integer (default 0o644 - node.js file modes)
      },
      flags: {
        doc: 'logger.file.flags',
        format: String,
        default: 'a', // flags: 'a', // - string (default ‘a’)
      },
      compress: {
        doc: 'logger.file.compress',
        format: Boolean,
        default: false, // - boolean (default false) - compress the backup files during rolling (backup files will have .gz extension)
      },
      always_include_pattern: {
        doc: 'logger.file.always_include_pattern',
        format: Boolean,
        default: false, // - boolean (default false) - include the pattern in the name of the current log file as well as the backups.
      },
      days_to_keep: {
        doc: 'logger.file.days_to_keep',
        format: Number,
        default: 1, // - integer (default 0) - if this value is greater than zero, then files older than that many days will be deleted during log rolling.
      }
    }
  },
};

module.exports = schema;
