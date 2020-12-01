const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrementPlugin = require('mongoose-sequence')(mongoose);



const name = 'currencies';

const schema = new Schema({
  num: { type: Number, min: 1, },
  // _id = code
  _id: { type: String, trim: true, uppercase: true, required: true, unique: true, },
  code: { type: String, trim: true, uppercase: true, required: true, unique: true, },

  symbol: { type: String, trim: true, required: true, },
  symbol_native: { type: String, trim: true, required: true, },
  title: { type: String, trim: true, required: true, },
  decimas: { type: Number, default: 4, },

  thousands_sep: { type: String, trim: true, default: ',', },
  decimal_sep: { type: String, trim: true, default: '.', },
  symbol_left: { type: Boolean, default: false, },
  space_between: { type: Boolean, default: true, },

  is_fiat: { type: Boolean, sparse: true, default: false, },
  is_coin: { type: Boolean, sparse: true, default: false, },
  is_token: { type: Boolean, sparse: true, default: false, },

  enabled: { type: Boolean, sparse: true, default: false, },
  visible: { type: Boolean, sparse: true, default: false, },
  serial_number: { type: Number, sparse: true, default: 1100000, },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});


schema.pre('validate', async function (next) {
  if (!this._id) this._id = this.code;
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
    const docsObj = require('./currencies.json');
    let serial_number = 1000000;
    for (let key in docsObj) {
      docsObj[key].enabled = true;
      docsObj[key].visible = false;
      docsObj[key].serial_number = ++serial_number;

      if (key === 'RUB') {
        docsObj[key].visible = true;
        docsObj[key].serial_number = 1;
      }

      if (key === 'USD') {
        docsObj[key].visible = true;
        docsObj[key].serial_number = 2;
      }

      if (key === 'VTM') {
        docsObj[key].visible = true;
        docsObj[key].serial_number = 3;
      }

      docs.push(docsObj[key]);
    }

    await model.create(docs);
  }
});


module.exports = model; // mongoose.model(name, schema);
module.exports.name = name;
module.exports.schema = schema;
