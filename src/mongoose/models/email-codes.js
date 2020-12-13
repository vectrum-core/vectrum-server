const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { createHash } = require('crypto');
const emailValidator = require('./lib/validator-email');



const name = 'email_codes';

const schema = new Schema({
  num: { type: Number, min: 1, },
  email: {
    type: String, lowercase: true, trim: true,
    required: true, index: true,
    validate: emailValidator,
  },
  // email_confirmation,
  tag: {
    type: String, lowercase: true, trim: true,
    enum: ['email_confirmation'],
    required: true, index: true,
  },
  // code
  hash: { type: String, lowercase: true, trim: true, required: true, },
  tryes: { type: Number, default: 0, },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});


schema.index({ created_at: 1 }, { expireAfterSeconds: 30 * 60, });


schema.index({ email: 1, tag: 1, }, { unique: true, });


schema.methods.setCode = function (code) {
  this.hash = createHash('sha256')
    .update(code)
    .digest('hex');
  return this.hash;
};


schema.methods.validateCode = function (code) {
  const hash = createHash('sha256')
    .update(code)
    .digest('hex');
  return this.hash === hash;
};


module.exports = mongoose.model(name, schema);
module.exports.name = name;
module.exports.schema = schema;
