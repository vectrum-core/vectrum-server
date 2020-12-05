const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrementPlugin = require('mongoose-sequence')(mongoose);
const { v4: uuidv4, validate: uuidv4Validate } = require('uuid');
const uuidValidator = require('./lib/validator-uuid');



const name = 'api_keys';

const schema = new Schema({
  num: { type: Number, min: 1, },

  _id: {
    type: String, lowercase: true, trim: true,
    required: true, unique: true, default: uuidv4,
    validate: uuidValidator,
  },
  key: { // key = kid
    ref: 'jwks', type: String, trim: true,
    required: true, sparse: true,
  },

  blocked: { type: Boolean, index: true, default: true, },

  permissions: [{
    type: String, lowercase: true, trim: true,
    sparse: true,
  }],
  comment: { type: String, trim: true, default: '', },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});


schema.pre('validate', async function (next) {
  if (!this._id) this._id = uuidv4();
  next();
});


schema.plugin(
  AutoIncrementPlugin,
  { id: name, inc_field: 'num', start_seq: 1, },
);


schema.statics.validateId = (_id) => {
  return uuidv4Validate(_id);
};


const model = mongoose.model(name, schema);
model.estimatedDocumentCount(async (error, count) => {
  if (count === 0) {
    const docs = [
      {
        _id: 'f1839e8e-02ab-4374-88b6-179d857fd964',
        key: 'LrOD55Jb1ixNLfPDshRLIcUURrPE05ivzmk4QLbn75A',
        blocked: false,
        comment: 'VECTRUM Web App v0.1.0',
        permissions: ['app'],
      },
    ];
    await model.create(docs);
  }
});


module.exports = model; // mongoose.model(name, schema);
module.exports.name = name;
module.exports.schema = schema;
