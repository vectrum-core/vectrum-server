const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrementPlugin = require('mongoose-sequence')(mongoose);
const { v4: uuidv4, validate: uuidv4Validate } = require('uuid');
const uuidValidator = require('./lib/validator-uuid');



const name = 'devices';

const schema = new Schema({
  num: { type: Number, min: 1, },

  _id: {
    type: String, lowercase: true, trim: true,
    required: true, unique: true, default: uuidv4,
    validate: uuidValidator,
  },

  ip: { type: String, trim: true, indes: true, sparse: true, },
  info: { type: Schema.Types.Mixed, default: {}, },
  useragent: { type: Schema.Types.Mixed, default: {}, },
  /*
  info: {
    os: {
      type: { type: String, trim: true, index: true, sparse: true, },
      name: { type: String, trim: true, index: true, sparse: true, },
      version: { type: String, trim: true, index: true, sparse: true, },
    },
    browser: {
      name: { type: String, trim: true, index: true, sparse: true, },
      version: { type: String, trim: true, index: true, sparse: true, },
      ua: { type: String, trim: true, index: true, sparse: true, },
    },
    screen: {
      orientation: { type: String, trim: true, index: true, sparse: true, },
      type: {
        type: String, trim: true,
        enum: ['mobile', 'tablet', 'computer', 'largeScreen', 'wideScreen'],
        index: true, sparse: true,
      },
      size: {
        height: { type: Number, },
        availHeight: { type: Number, },
        width: { type: Number, },
        availWidth: { type: Number, },
      },
      colorDepth: { type: Number, },
      pixelDepth: { type: Number, },
    },
  },
  */

}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});


schema.pre('validate', async function (next) {
  if (!this._id) this._id = uuidv4();
  return next();
});


schema.statics.validateId = (_id) => {
  return uuidv4Validate(_id);
};


schema.plugin(
  AutoIncrementPlugin,
  { id: name, inc_field: 'num', start_seq: 1, },
);


module.exports = mongoose.model(name, schema);
module.exports.name = name;
module.exports.schema = schema;
