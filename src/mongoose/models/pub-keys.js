const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const accountNameValidator = require('./lib/validator-account-name');



const name = 'pub_keys';

// created in eosio node
const schema = new Schema({
  name: {
    type: String, lowercase: true, trim: true, minlength: 1, maxlength: 12,
    required: true, index: true,
    validate: accountNameValidator,
  },
  permission: {
    type: String, lowercase: true, trim: true, minlength: 1, maxlength: 12,
    required: true, index: true,
    validate: accountNameValidator,
  },
  public_key: {
    type: String, trim: true,
    required: true, index: true,
    validate: accountNameValidator,
  },

  reatedAt: { type: Date, },
  updatedAt: { type: Date, },
});


schema.index(
  { name: 1, permission: 1, public_key: 1, },
  { unique: true, }
);


module.exports = mongoose.model(name, schema);
module.exports.name = name;
module.exports.schema = schema;
