const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrementPlugin = require('mongoose-sequence')(mongoose);
const jwt = require('jsonwebtoken');
const { v4: uuidv4, validate: uuidv4Validate } = require('uuid');
const uuidValidator = require('./lib/validator-uuid');
const cfg = require('../../config');



const name = 'jwts';

const schema = new Schema({
  num: { type: Number, min: 1, },
  _id: {
    type: String, lowercase: true, trim: true,
    required: true, unique: true, default: uuidv4,
    validate: uuidValidator,
  },

  sign_by: { type: String, default: cfg.get('jwt.sign_by'), enum: ['key', 'secret'], sparse: true, },
  algorithm: { type: String, default: cfg.get('jwt.secret_algorithm') },
  issuer: { type: String, required: true, default: cfg.get('jwt.issuer') },

  subject: { type: String, trim: true, required: true, refPath: 'subject_model', },
  subject_model: {
    type: String, lowercase: true, trim: true,
    required: true, sparse: true,
  },

  audience: [{
    type: String, lowercase: true, trim: true, sparse: true,
  }],

  info: { type: Schema.Types.Mixed, },

  revoked: { type: Boolean, default: false, },
  not_expires: { type: Boolean, default: true, },
  expires_in: { type: Date, default: undefined, },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});


schema.index({ 'expires_in': 1 }, { expireAfterSeconds: 0, sparse: true, });


schema.virtual('expiresIn')
  .get(function (value, virtual, doc) {
    if (this.expires_in)
      return parseInt(this.expires_in.getTime() / 1000, 10);
    return undefined;
  })
  .set(function (value, virtual, doc) {
    this.expires_in = new Date(value * 1000);
  });

schema.virtual('exp')
  .get(function (value, virtual, doc) {
    return parseInt(this.expires_in.getTime() / 1000, 10);
  })
  .set(function (value, virtual, doc) {
    this.expires_in = new Date(value * 1000);
  });

schema.virtual('notBefore')
  .get(function (value, virtual, doc) {
    return undefined; // date 
  })

//audience
schema.virtual('aud')
  .get(function (value, virtual, doc) {
    return this.audience;
  });

// issued at
schema.virtual('iat')
  .get(function (value, virtual, doc) {
    return parseInt(this.created_at.getTime() / 1000, 10);
  });

schema.virtual('jwtid')
  .get(function (value, virtual, doc) {
    return this._id;
  });

//noTimestamp
//header
//keyid
//mutatePayload

schema.methods.generateJWT = function () {
  let payload = {
    //iat: this.iat,
    //typ: 'JWT',
  };

  let opts = {
    algorithm: this.algorithm,
    expiresIn: this.expiresIn,
    notBefore: this.notBefore,
    audience: this.audience,
    issuer: this.issuer,
    jwtid: this.jwtid,
    subject: this.subject,
  };

  if (this.sign_by === 'secret') {
    const secret = cfg.get('jwt.secret');
    return jwt.sign(payload, secret, JSON.parse(JSON.stringify(opts)));
  } else if (this.sign_by === 'key') {
    throw new Error({ message: 'Signing JWT by key unsupported!' })
    const key = cfg.get('jwt.key');
    opts.keyid = '';
    return jwt.sign(payload, key, JSON.parse(JSON.stringify(opts)));
  }
}

schema.pre('validate', function (next) {
  let today = new Date();
  if (this.created_at === undefined)
    this.created_at = today;
  else
    today = this.created_at;

  if (this.expires_in === undefined && !this.not_expires) {
    const expirationDate = new Date(today);
    this.expires_in = expirationDate.setDate(
      today.getDate() + cfg.get('jwt.expiresInDays')
    );
  }
  next();
});


schema.plugin(
  AutoIncrementPlugin,
  { id: name, inc_field: 'num', start_seq: 1, },
);


module.exports = mongoose.model(name, schema);
module.exports.name = name;
module.exports.schema = schema;

/*
https://www.npmjs.com/package/express-useragent
{
  "sign_by": "secret",
  "algorithm": "HS256",
  "issuer": "http://localhost",
  "revoked": false,
  "not_expires": true,
  "subject": "5fc867dac9c274f484a7e551",
  "subject_model": "users",
  "info": {
      "time": 1606970295651,
      "ip": "127.0.0.1",
      "useragent": {
          "isYaBrowser": false,
          "isAuthoritative": true,
          "isMobile": false,
          "isMobileNative": false,
          "isTablet": false,
          "isiPad": false,
          "isiPod": false,
          "isiPhone": false,
          "isiPhoneNative": false,
          "isAndroid": false,
          "isAndroidNative": false,
          "isBlackberry": false,
          "isOpera": false,
          "isIE": false,
          "isEdge": false,
          "isIECompatibilityMode": false,
          "isSafari": false,
          "isFirefox": false,
          "isWebkit": false,
          "isChrome": true,
          "isKonqueror": false,
          "isOmniWeb": false,
          "isSeaMonkey": false,
          "isFlock": false,
          "isAmaya": false,
          "isPhantomJS": false,
          "isEpiphany": false,
          "isDesktop": true,
          "isWindows": false,
          "isLinux": false,
          "isLinux64": false,
          "isMac": true,
          "isChromeOS": false,
          "isBada": false,
          "isSamsung": false,
          "isRaspberry": false,
          "isBot": false,
          "isCurl": false,
          "isAndroidTablet": false,
          "isWinJs": false,
          "isKindleFire": false,
          "isSilk": false,
          "isCaptive": false,
          "isSmartTV": false,
          "isUC": false,
          "isFacebook": false,
          "isAlamoFire": false,
          "isElectron": false,
          "silkAccelerated": false,
          "browser": "Chrome",
          "version": "86.0.4240.80",
          "os": "OS X",
          "platform": "Apple Mac",
          "source": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.80 Safari/537.36",
          "isWechat": false
      }
  }
}
*/
