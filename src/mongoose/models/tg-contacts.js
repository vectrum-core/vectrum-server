const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrementPlugin = require('mongoose-sequence')(mongoose);



const name = 'tg_contacts';

const schema = new Schema({
  num: { type: Number, min: 1, },

  phone_number: { ref: 'phone_numbers', type: String, trim: true, required: true, index: true, },
  user_id: { ref: 'tg_users', type: Number, required: true, index: true, },
  first_name: { type: String, trim: true, },
  last_name: { type: String, trim: true, },
  vcard: { type: String, trim: true, },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at', },
});


schema.plugin(
  AutoIncrementPlugin,
  { id: name, inc_field: 'num', start_seq: 1, },
);


module.exports = mongoose.model(name, schema);
module.exports.name = name;
module.exports.schema = schema;
