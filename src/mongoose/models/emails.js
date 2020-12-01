const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrementPlugin = require('mongoose-sequence')(mongoose);
const emailValidator = require('./lib/validator-email');



const name = 'emails';

const schema = new Schema({
  num: { type: Number, min: 1, },
  // _id = email
  _id: {
    type: String, lowercase: true, trim: true,
    required: true, unique: true,
    validate: emailValidator,
  },
  email: {
    type: String, lowercase: true, trim: true,
    required: true, unique: true,
    validate: emailValidator,
  },

  confirmed: { type: Boolean, index: true, default: false, },

}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});


schema.plugin(
  AutoIncrementPlugin,
  { id: name, inc_field: 'num', start_seq: 1, },
);


schema.pre('validate', async function (next) {
  if (!this._id) this._id = this.email;
  next();
});


module.exports = mongoose.model(name, schema);
module.exports.name = name;
module.exports.schema = schema;
