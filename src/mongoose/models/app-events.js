const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrementPlugin = require('mongoose-sequence')(mongoose);
const { v4: uuidv4, validate: uuidv4Validate } = require('uuid');
const uuidValidator = require('./lib/validator-uuid');



const name = 'app_events';

const schema = new Schema({
  num: { type: Number, min: 1, },
  api_key: {
    ref: 'api_keys',
    type: String, lowercase: true, trim: true,
    required: true, index: true, default: uuidv4,
    validate: uuidValidator,
  },
  device: {
    ref: 'devices',
    type: String, lowercase: true, trim: true,
    required: true, index: true, default: uuidv4,
    validate: uuidValidator,
  },
  user: {
    ref: 'users',
    type: String, lowercase: true, trim: true,
    required: true, index: true, default: uuidv4,
    validate: uuidValidator,
  },

  type: {
    type: String, lowercase: true, trim: true,
    enum: ['fatal', 'error', 'warn', 'info', 'debug', 'trace'],
    required: true, index: true,
  },
  location: {
    type: String, trim: true,
    required: true, index: true,
  },
  data: { type: Schema.Types.Mixed, },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});


schema.plugin(
  AutoIncrementPlugin,
  { id: name, inc_field: 'num', start_seq: 1, },
);


module.exports = mongoose.model(name, schema);
module.exports.name = name;
module.exports.schema = schema;
