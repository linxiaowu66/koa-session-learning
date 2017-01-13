var LocalStrategy = require('passport-local').Strategy;
var User=require('../model').user;
var co = require('co');

// 判断用户是否匹配数据库
function AuthLocalUser(username, password, done) {
  co(function *() {
    try {
      return yield User.matchUser(username, password);
    } catch (err) {
      throw new Error(err);
    }
  }).then(result => {
    if (!result.user) {
      done(null, false, {message: result.message})
    } else {
      done(null, result.user, {message: result.message});
    }
  }, err => {
    done(err);
  });
};

var serialize = function (user, done) {
  done(null, user._id);
};

var deserialize = function (id, done) {
  User.findById(id, done);
};

// Config of passport
module.exports = function (passport) {
  passport.serializeUser(serialize);
  passport.deserializeUser(deserialize);
  passport.use(new LocalStrategy(AuthLocalUser));
};
