const fs = require('fs');
const path = require('path');
const convict = require('convict');
const schema = require('./schema');
const formats = require('./formats');



// Define a custom formats.
convict.addFormats(formats);

// Define a schema.
const config = convict(schema);

// Load environment dependent configuration.
const env = config.get('env');

// Set env prefix for configuration and log file names.
if (env !== 'production') {
  config.set('config.file.name', env + '-' + config.get('config.file.name'));
  config.set('logger.file.name', env + '-' + config.get('logger.file.name'));
}

// Set global path to data dir.
const dataDirPath = path.resolve(__dirname, config.get('data.dir'));

// Create data dir.
if (!fs.existsSync(dataDirPath)) {
  const options = { recursive: true, mode: 0o777, };
  fs.mkdirSync(dataDirPath, options);
  fs.mkdirSync(dataDirPath + '/public', options);
}

// Save default config file or rewrite existed config file.
if (config.get('config.file.save')) {
  config.set('config.file.save', false);
  const options = { encoding: 'utf8', mode: 0o777, flag: 'w' };
  fs.writeFileSync(configFilePath, config.toString(), options);
  process.exit(1);
}

// Print default config file to console.
if (config.get('config.file.print')) {
  config.set('config.file.print', false);
  console.log(config.toString());
  process.exit(1);
}

config.set('data.dir', dataDirPath);

// Set global path to configuration file.
const configFileName = config.get('config.file.name');
const configFilePath = path.resolve(__dirname, config.get('data.dir'), configFileName);
config.set('config.file.path', configFilePath);

// Load configuration file.
if (fs.existsSync(configFilePath)) {
  config.loadFile(configFilePath);
}

// Perform validation.
config.validate({ allowed: 'strict' });

module.exports = config;
