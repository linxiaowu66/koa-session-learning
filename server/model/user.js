var bcrypt = require('../common/bcrypt_promise.js'); // version that supports yields
var mongoose = require('mongoose');
var co = require('co');

const SALT_WORK_FACTOR = 10;

var UserSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  avatar: { type: String, required: true }
});

UserSchema.pre('save', function (done) {
  // only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return done();
  }

  bcrypt.genSalt()
   .then( salt => bcrypt.hash(this.password, salt))
   .then( hash => {
      this.password = hash;
      done();
    })
   .catch(err => {
    console.error(err);
    done(err);
   })

});

UserSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.statics.matchUser = function *(username, password) {
  try{
    var user = yield this.findOne({ 'username': username.toLowerCase() }).exec();
  } catch (err){
    console.error('Database operation failure, error: ', err);
    throw new Error('数据库操作失败');
  }

  if (!user) return {user: null, message: '没有找到该用户'};

  try{
    if (yield user.comparePassword(password))
      return {user: user, message: ''};
  } catch (err){
    console.error('password compare failure, error: ', err);
    throw new Error('数据库比对失败');
  }

  return {user: null, message: '用户名和密码不匹配'};
};

var name="user";

module.exports={
  [name]:mongoose.model(name, UserSchema)
};
