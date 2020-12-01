const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrementPlugin = require('mongoose-sequence')(mongoose);



const name = 'languages';

const schema = new Schema({
  num: { type: Number, min: 1, },
  // _id = code
  _id: { type: String, trim: true, required: true, index: true, unique: true, },
  code: { type: String, trim: true, required: true, index: true, unique: true, },

  title: { type: String, trim: true, },
  title_native: { type: String, trim: true, },

  emoji: { type: String, trim: true, },
  emoji_unicode: { type: String, trim: true, },

  enabled: { type: Boolean, sparse: true, default: false, },
  visible: { type: Boolean, sparse: true, default: false, },
  serial_number: { type: Number, sparse: true, default: 1100000, },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at', },
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
    const docsObj = require('./languages.json');
    let serial_number = 1000000;
    for (let key in docsObj) {
      docsObj[key].enabled = true;
      docsObj[key].visible = false;
      docsObj[key].serial_number = ++serial_number;

      if (key === 'ru') {
        docsObj[key].visible = true;
        docsObj[key].serial_number = 1;
      }

      if (key === 'en') {
        docsObj[key].visible = true;
        docsObj[key].serial_number = 2;
      }

      docs.push(docsObj[key]);
    }

    await model.create(docs);
  }
});


module.exports = model; // mongoose.model(name, schema);
module.exports.name = name;
module.exports.schema = schema;
