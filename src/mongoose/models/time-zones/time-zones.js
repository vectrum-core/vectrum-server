const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrementPlugin = require('mongoose-sequence')(mongoose);



const name = 'time_zones';

const schema = new Schema({
  num: { type: Number, min: 1, },
  // _id = title
  _id: { type: String, trim: true, required: true, index: true, unique: true, },
  title: { type: String, trim: true, required: true, index: true, unique: true, },

  code: { type: String, trim: true, required: true, index: true, sparse: true, },
  offset: { type: Number, default: 0, },

  enabled: { type: Boolean, sparse: true, default: false, },
  visible: { type: Boolean, sparse: true, default: false, },
  serial_number: { type: Number, sparse: true, default: 1100000, },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});


schema.pre('validate', async function (next) {
  if (!this._id) this._id = this.title;
  next();
});


schema.plugin(
  AutoIncrementPlugin,
  { id: name, inc_field: 'num', start_seq: 1, },
);


const model = mongoose.model(name, schema);
model.estimatedDocumentCount(async (error, count) => {
  if (count === 0) {
    const docs = [];
    const docsObj = require('./time-zones.json');
    let serial_number = 1000000;
    for (let key in docsObj) {
      docsObj[key].enabled = true;
      docsObj[key].visible = false;
      docsObj[key].serial_number = ++serial_number;

      if (docsObj[key].title === 'Europe/Moscow') {
        docsObj[key].visible = true;
        docsObj[key].serial_number = 1;
      }

      docs.push(docsObj[key]);
    }

    await model.create(docs);
  }
});


module.exports = model; // mongoose.model(name, schema);
module.exports.name = name;
module.exports.schema = schema;
