const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrementPlugin = require('mongoose-sequence')(mongoose);



const name = 'phone_numbers';

const schema = new Schema({
  num: { type: Number, min: 1, },
  // _id = phone_number
  _id: { type: String, trim: true, required: true, unique: true, },
  phone_number: { type: String, trim: true, required: true, unique: true, },

  confirmed: { type: Boolean, index: true, default: false, },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at', },
});


schema.pre('validate', async function (next) {
  if (!this._id) this._id = this.phone_number;
  next();
});


schema.plugin(
  AutoIncrementPlugin,
  { id: name, inc_field: 'num', start_seq: 1, },
);


module.exports = mongoose.model(name, schema);
module.exports.schema = schema;
module.exports.name = name;
