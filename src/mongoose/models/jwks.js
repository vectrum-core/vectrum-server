const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrementPlugin = require('mongoose-sequence')(mongoose);



const name = 'jwks';

const schema = new Schema({
  num: { type: Number, min: 1, },

  _id: { type: String, trim: true, required: true, index: true, unique: true, },
  kid: { type: String, trim: true, required: true, index: true, unique: true, },
  kty: { type: String, trim: true, required: true, index: true, sparse: true, },
  crv: { type: String, trim: true, required: true, index: true, sparse: true, },

  d: { type: String, trim: true, }, // privkey part
  x: { type: String, trim: true, required: true, },
  y: { type: String, trim: true, required: true, },

  private: { type: Boolean, index: true, sparse: true, default: false, },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});


schema.pre('validate', function (next) {
  if (!this._id)
    this._id = this.kid;
  if (this.d)
    this.private = true;
  return next();
});


schema.methods.getJwkPrivKey = function () {
  const jwk = {};
  jwk.kid = this.kid;
  jwk.kty = this.kty;
  jwk.crv = this.crv;
  jwk.d = this.d; // privkey part
  jwk.x = this.x;
  jwk.y = this.y;
  return jwk;
}

schema.methods.getJwkPubKey = function () {
  const jwk = {};
  jwk.kid = this.kid;
  jwk.kty = this.kty;
  jwk.crv = this.crv;
  //jwk.d = this.d; // privkey part
  jwk.x = this.x;
  jwk.y = this.y;
  return jwk;
}


schema.plugin(
  AutoIncrementPlugin,
  { id: name, inc_field: 'num', start_seq: 1, },
);


const model = mongoose.model(name, schema);
model.estimatedDocumentCount(async (error, count) => {
  if (count === 0) {
    const docs = [
      {
        kid: 'LrOD55Jb1ixNLfPDshRLIcUURrPE05ivzmk4QLbn75A',
        kty: 'EC', crv: 'P-256', private: true,
        d: 'WMc7rfxJ97Ly3ykdibdYFUKFAfo8_OGXD7HCqniQ4Eg',
        x: '-JiCxpRCvDa6SRGTDZ6auBAHz5SghVplC6pUECHqhhU',
        y: 'moC8eM_-HqqfjLXAea7D0yBfrkDdTFe5rD9MnEsO-Iw',
      }, {
        kid: 'rqkqNIfTNbLm6ysHTtD_FyD6qgDMBbZOcgEvNl5QboQ',
        kty: 'EC', crv: 'P-256', private: true,
        d: 'fPBZrwhXQ_yzWYW0olyqo-RUEEIFQJGOndKak04kXKY',
        x: 'buThZV3KFPscTjTUZXsymW9AkjVNQ6pRaT4uP2IORns',
        y: 'Eo--3QS6993VwTOIFZJM28Owoaadf7DPX_GFjj_qASE',
      }
    ];
    await model.create(docs);
  }
});


module.exports = model; // mongoose.model(name, schema);
module.exports.name = name;
module.exports.schema = schema;
