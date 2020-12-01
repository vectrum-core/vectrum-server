const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrementPlugin = require('mongoose-sequence')(mongoose);



const name = 'tg_photos';

const schema = new Schema({
  num: { type: Number, min: 1, },

  file_id: { type: String, trim: true, required: true, unique: true, },
  file_unique_id: { type: String, trim: true, required: true, unique: true, },
  file_size: { type: Number, },
  width: { type: Number, },
  height: { type: Number, },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at', },
});


schema.plugin(
  AutoIncrementPlugin,
  { id: name, inc_field: 'num', start_seq: 1, },
);


module.exports = mongoose.model(name, schema);
module.exports.schema = schema;
module.exports.name = name;
