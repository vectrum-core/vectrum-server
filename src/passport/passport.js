const passport = require('passport');
const LocalStrategy = require('passport-local');
const { JwtStrategy, ExtractJwt } = require('passport-jwt');
const mongoose = require('mongoose');
const User = mongoose.model('users');
const cfg = require('../config');
const log = require('../logger').getLogger('PASSPORT');



const emailRegExp = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,})+$/;
const tgUsernameRegExp = /^([a-zA-Z0-9]{5,20})+$/;

const localStrategyOptions = {
  usernameField: 'username', // - Optional, defaults to 'username'
  passwordField: 'password', // - Optional, defaults to 'password'
};
passport.use(new LocalStrategy(localStrategyOptions, (username, password, done) => {
  const conditions = {};
  let type = '';

  if (emailRegExp.test(username)) {
    conditions.email = username;
    type = 'email';
  } else if (tgUsernameRegExp.test(username)) {
    conditions['tg_user.username'] = username;
    type = 'tg_user.username';
  } else {
    conditions.username = username;
    type = 'username';
  }

  return User.findOne(conditions).populate('tg_user')
    .then((user) => {
      if (!user) {
        log.debug(`Try auth failure. Incorrect ${type}:`, username);
        const error = { message: `${type} or password is invalid`, };
        return done(error, false);
      }

      if (!user.validatePassword(password)) {
        log.debug(`Try auth failure. Incorrect password for ${type}:`, username);
        const error = { message: `${type} or password is invalid`, };
        return done(error, false);
      }

      log.debug(`Try auth done for ${type}:`, username, 'user _id:', user);
      return done(null, user);
    })
    .catch((error) => {
      log.debug(`Passport LocalStrategy error:`, error);
      return done(error);
    });
}));



const JwtStrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
  secretOrKey: cfg.get('jwt.secret'),
  algorithms: cfg.get('jwt.secret_algorithm'),
  issuer: cfg.get('jwt.issuer'),
};
passport.use(new JwtStrategy(JwtStrategyOptions, (jwt_payload, done) => {
  return User.findOne({ _id: jwt_payload.sub })
    .then((user) => {
      if (!user) {
        log.debug('Try auth failure. User not found for JWT sub:', jwt_payload.sub);
        const error = { message: `JWT sub is invalid`, };
        return done(error, false);
      }

      log.debug('Try auth done for JWT sub:', jwt_payload.sub, 'user _id:', user._id);
      return done(null, user); // or you could create a new account
    })
    .catch((error) => {
      log.debug(`Passport JwtStrategy error:`, error);
      return done(error);
    });
}));


passport.serializeUser((user, done) => {
  return done(null, user._id);
});

passport.deserializeUser((user, done) => {
  return User.findById(user._id, (err, user) => {
    return done(err, user);
  });
});

module.exports = passport;
