const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrementPlugin = require('mongoose-sequence')(mongoose);
const { v4: uuidv4, validate: uuidv4Validate } = require('uuid');
const uuidValidator = require('./lib/validator-uuid');
const accountNameValidator = require('./lib/validator-account-name');



const name = 'users';

const schema = new Schema({
  num: { type: Number, min: 1, },

  _id: {
    type: String, lowercase: true, trim: true,
    required: true, unique: true, default: uuidv4,
    validate: uuidValidator,
  },

  email: { ref: 'emails', type: String, lowercase: true, trim: true, sparse: true, },
  password: { ref: 'passwords', type: Schema.Types.ObjectId, },
  tg_user: { ref: 'tg_users', type: Number, sparse: true, },
  phone_number: { ref: 'phone_numbers', type: String, trim: true, sparse: true, },

  first_name: { type: String, trim: true, },
  middle_name: { type: String, trim: true, },
  last_name: { type: String, trim: true, },

  permissions: {
    type: [{ type: String, lowercase: true, trim: true, sparse: true, }],
    default: ['user']
  },

  parent: { ref: 'users', type: String, lowercase: true, trim: true, sparse: true, },

  account: {
    ref: 'accounts',
    type: String, lowercase: true, trim: true, minLength: 1, maxLength: 12,
    sparse: true,
    validate: accountNameValidator,
  },
  accounts: [{
    ref: 'accounts',
    type: String, lowercase: true, trim: true, minLength: 1, maxLength: 12,
    sparse: true,
    validate: accountNameValidator,
  }],

  country: { ref: 'countries', type: String, uppercase: true, trim: true, sparse: true, },
  time_zone: { ref: 'time_zones', type: String, trim: true, sparse: true, },
  language: { ref: 'languages', type: String, lowercase: true, trim: true, sparse: true, },
  currency: { ref: 'currencies', type: String, uppercase: true, trim: true, sparse: true, },

  last_active_at: { type: Date, default: Date.now, },
  status: {
    agreed: { type: Boolean, sparse: true, default: false, },
    blocked: { type: Boolean, sparse: true, default: false, },
  },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});


schema.pre('validate', async function (next) {
  if (!this._id) this._id = uuidv4();

  if (this.email) {
    let email = await mongoose.model('emails').findById(this.email);
    if (!email) {
      email = new mongoose.model('emails')({ email: this.email });
      await email.save();
    }
  };

  if (this.account && this.account.length < 12) {
    if (
      this.permissions.includes('root')
      || this.permissions.includes('admin')
    ) {
      next();
    } else
      throw new Error('Insufficient rights to create a short VECTRUM account name');
  }

  next();
});


schema.statics.validateId = (_id) => {
  return uuidv4Validate(_id);
};


schema.methods.setAndSavePassword = async function (password) {
  let pswd = {};
  if (!this.password) {
    pswd = new mongoose.model('passwords')({});
    this.password = pswd._id;
    await this.save();
  } else {
    pswd = await mongoose.model('passwords').findById(this.password);
  }
  pswd.setPassword(password);
  await pswd.save();
  return true;
};


schema.methods.validatePassword = async function (password) {
  const pswd = await mongoose.model('passwords').findById(this.password);
  return pswd.validatePassword(password);;
};


schema.methods.generateJWT = function (info) {
  const newJWT = {
    subject: this._id,
    subject_model: 'users',
    audience: this.permissions,
    info,
  }

  return this.model('jwts')(newJWT).save()
    .then((doc) => doc.generateJWT())
    .then((jwt) => jwt);
}


schema.methods.toAuthJSON = function (info) {
  return this.generateJWT(info)
    .then((jwt) => {
      return {
        guid: this._id,
        apiToken: jwt,
        permissions: this.permissions || [],
        authenticated: true,
      };
    });
};


schema.plugin(
  AutoIncrementPlugin,
  { id: name, inc_field: 'num', start_seq: 1, },
);


const model = mongoose.model(name, schema);
model.estimatedDocumentCount(async (error, count) => {
  if (count === 0) {
    const docs = [
      { email: 'root@example.com', raw_password: '12345678', permissions: ['root'], },
      { email: 'admin@example.com', raw_password: '12345678', permissions: ['admin'], },
    ];
    for (let i in docs) {
      const doc = new model(docs[i]);
      await doc.setAndSavePassword(docs[i].raw_password);
      await doc.save();
    }
  }
});


module.exports = model; // mongoose.model(name, schema);
module.exports.name = name;
module.exports.schema = schema;
