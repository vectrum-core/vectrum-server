const isProd = process.env.NODE_ENV === 'production';



const schema = {
  logger: {
    level: {
      doc: 'logger.level',
      format: String,
      default: isProd ? 'info' : 'trace', // fatal, error, warn, info, debug, trace
    },
    appenders: {
      stdout: {
        doc: 'logger.appenders.stdout',
        format: Boolean,
        default: false,
      },
      stderr: {
        doc: 'logger.appenders.stderr',
        format: Boolean,
        default: false,
      },
      gelf: {
        doc: 'logger.appenders.gelf',
        format: Boolean,
        default: false,
      },
      file: {
        doc: 'logger.appenders.file',
        format: Boolean,
        default: false,
      },
    },
    gelf: {
      host: {
        doc: 'logger gelf host',
        format: String,
        default: 'localhost', // host - string(defaults to localhost) - the gelf server hostname
      },
      port: {
        doc: 'logger gelf port',
        format: Number,
        default: 12201, //port - integer(defaults to 12201) - the port the gelf server is listening on
      },
      hostname: {
        doc: 'logger gelf hostname',
        format: String,
        default: 'vectrum-server', // + require('os').hostname(), // hostname - string(defaults to OS.hostname()) - the hostname used to identify the origin of the log messages.
      },
      facility: {
        doc: 'logger gelf facility',
        format: String,
        default: 'vectrum-server', // facility - string(optional)
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
