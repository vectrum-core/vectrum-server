const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrementPlugin = require('mongoose-sequence')(mongoose);
const crypto = require('crypto');
const cfg = require('../../config');



const name = 'passwords';

const schema = new Schema({
  num: { type: Number, min: 1, },

  salt: {
    size: { type: Number, required: true, default: cfg.get('password.salt.size'), },
    value: { type: String, trim: true, required: true, },
  },

  hash: {
    iterations: { type: Number, required: true, default: cfg.get('password.hash.iterations'), },
    keylen: { type: Number, required: true, default: cfg.get('password.hash.keylen'), },
    digest: { type: String, required: true, default: cfg.get('password.hash.digest'), },
    value: { type: String, trim: true, required: true, },
  },

}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});


schema.methods.setPassword = function (password) {
  this.salt.value = crypto.randomBytes(
    this.salt.size
  ).toString('hex');

  this.hash.value = crypto.pbkdf2Sync(
    password,
    this.salt.value,
    this.hash.iterations,
    this.hash.keylen,
    this.hash.digest,
  ).toString('hex');
  return this.hash.value;
};


schema.methods.validatePassword = function (password) {
  const hash = crypto.pbkdf2Sync(
    password,
    this.salt.value,
    this.hash.iterations,
    this.hash.keylen,
    this.hash.digest,
  ).toString('hex');
  return this.hash.value === hash;
};


schema.plugin(
  AutoIncrementPlugin,
  { id: name, inc_field: 'num', start_seq: 1, },
);


module.exports = mongoose.model(name, schema);
module.exports.name = name;
module.exports.schema = schema;
