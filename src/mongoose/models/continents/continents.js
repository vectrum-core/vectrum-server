const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrementPlugin = require('mongoose-sequence')(mongoose);



const name = 'continents';

const schema = new Schema({
  num: { type: Number, min: 1, },
  // _id = code
  _id: { type: String, uppercase: true, trim: true, required: true, unique: true, },
  code: { type: String, uppercase: true, trim: true, required: true, unique: true, },

  title: { type: String, trim: true, },

  enabled: { type: Boolean, sparse: true, default: false, },
  visible: { type: Boolean, sparse: true, default: false, },
  serial_number: { type: Number, sparse: true, default: 1100000, },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});


schema.plugin(
  AutoIncrementPlugin,
  { id: name, inc_field: 'num', start_seq: 1, },
);


schema.pre('validate', async function (next) {
  if (!this._id) this._id = this.code;
  next();
});


const model = mongoose.model(name, schema);
model.estimatedDocumentCount(async (error, count) => {
  if (count === 0) {
    const docs = [];
    const docsObj = require('./continents.json');
    let serialNumber = 1000000;
    for (let key in docsObj) {
      docsObj[key].enabled = true;
      docsObj[key].visible = true;
      docsObj[key].serial_number = ++serialNumber;
      docs.push(docsObj[key]);
    }
    await model.create(docs);
  }
});


module.exports = model; // mongoose.model(name, schema);
module.exports.name = name;
module.exports.schema = schema;
