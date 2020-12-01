const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const name = 'counters';

const schema = new Schema({
  id: { type: String, required: true, },
  reference_value: { type: Schema.Types.Mixed, required: true, },
  seq: { type: Number, required: true, default: 1, },
}, {
  collection: name,
  validateBeforeSave: false,
  versionKey: false,
  _id: false,
});


schema.index({ id: 1, reference_value: 1 }, { unique: true });


module.exports = mongoose.model(name, schema);
module.exports.name = name;
module.exports.schema = schema;
