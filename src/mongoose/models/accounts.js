const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const accountNameValidator = require('./lib/validator-account-name');



const name = 'accounts';

// created in eosio node
const abiSchema = new Schema({
  version: { type: String, trim: true, }, // "eosio::abi/1.1",
  types: [{ type: Schema.Types.Mixed, }],
  structs: [{ type: Schema.Types.Mixed, }],
  actions: [{ type: Schema.Types.Mixed, }],
  tables: [{ type: Schema.Types.Mixed, }],
  ricardian_clauses: [{ type: Schema.Types.Mixed, }],
  error_messages: [{ type: Schema.Types.Mixed, }],
  abi_extensions: [{ type: Schema.Types.Mixed, }],
  variants: [{ type: Schema.Types.Mixed, }],
});

const schema = new Schema({
  name: {
    type: String, lowercase: true, trim: true, minlength: 1, maxlength: 12,
    required: true, unique: true,
    validate: accountNameValidator,
  },
  abi: { type: abiSchema, },
  reatedAt: { type: Date, },
  updatedAt: { type: Date, },
});


module.exports = mongoose.model(name, schema);
module.exports.name = name;
module.exports.schema = schema;
