const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrementPlugin = require('mongoose-sequence')(mongoose);



const name = 'tg_users';

const schema = new Schema({
  num: { type: Number, min: 1, },
  // _id = telegram user id
  _id: { type: Number, required: true, unique: true, },
  id: { type: Number, required: true, unique: true, },

  is_bot: { type: Boolean, sparse: true, },
  type: { type: String, trim: true, sparse: true, },

  first_name: { type: String, trim: true, },
  last_name: { type: String, trim: true, },
  username: { type: String, trim: true, minlength: 5, maxlength: 20, },
  language_code: { type: String, trim: true, sparse: true, },

  photo: {
    small_file_id: { type: String, trim: true, },
    small_file_unique_id: { type: String, trim: true, },
    big_file_id: { type: String, trim: true, },
    big_file_unique_id: { type: String, trim: true, },
  },
  //photos: [{}], //  ref: 'tg_photos',
  photo_url: { type: String, trim: true, },

  last_active_at: { type: Date, default: Date.now, },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at', },
});


schema.pre('validate', async function (next) {
  if (!this._id) this._id = this.id;
  next();
});


schema.plugin(
  AutoIncrementPlugin,
  { id: name, inc_field: 'num', start_seq: 1, },
);


const model = mongoose.model(name, schema);
model.estimatedDocumentCount(async (error, count) => {
  if (count === 0) {
    const docs = [
      //{ id: 0, },
    ];
    await model.create(docs);
  }
});


module.exports = model; // mongoose.model(name, schema);
module.exports.name = name;
module.exports.schema = schema;
