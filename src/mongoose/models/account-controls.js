const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const accountNameValidator = require('./lib/validator-account-name');



const name = 'account_controls';

// created in eosio node
const schema = new Schema({
  controlled_account: {
    type: String, lowercase: true, trim: true, minlength: 1, maxlength: 12,
    required: true, index: true,
    validate: accountNameValidator,
  },
  controlled_permission: {
    type: String, lowercase: true, trim: true, minlength: 1, maxlength: 12,
    required: true, index: true,
    validate: accountNameValidator,
  },
  controlling_account: {
    type: String, lowercase: true, trim: true, minlength: 1, maxlength: 12,
    required: true, index: true,
    validate: accountNameValidator,
  },

  reatedAt: { type: Date, },
  updatedAt: { type: Date, },
});


schema.index(
  { controlled_account: 1, controlled_permission: 1, controlling_account: 1, },
  { unique: true, }
);


module.exports = mongoose.model(name, schema);
module.exports.name = name;
module.exports.schema = schema;
