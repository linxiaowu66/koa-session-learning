const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const config = require('../../config/index')

const SALT_WORK_FACTOR = 10

var User = mongoose.Schema({
  username: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  avatar: { type: String, required: true }
})

User.pre('save', function preSave (next) {
  const user = this

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) {
    return next()
  }

  new Promise((resolve, reject) => {
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
      if (err) { return reject(err) }
      resolve(salt)
    })
  })
  .then(salt => {
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) { throw new Error(err) }

      user.password = hash

      next(null)
    })
  })
  .catch(err => next(err))

})

User.methods.validatePassword = function validatePassword (password) {
  const user = this

  return new Promise((resolve, reject) => {
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) { return reject(err) }

      resolve(isMatch)
    })
  })
}

User.methods.generateToken = function generateToken () {
  const user = this

  return jwt.sign({ id: user.id }, config.token)
}

const user = mongoose.model('user', User);


module.exports={
  create: function(params){
    const instance = new user(params);
    return instance.save();
  },
  findAll: function () {
    return user.find({})
  },
  findById: function (id) {
    if (!id) {
      return Promise.reject('缺少参数');
    }
    return user.findById(id, '-password')
  },
  findOne: function (param) {
    if (!param) {
      return Promise.reject('缺少参数');
    }
    return user.findOne({username: param.username})
  }
};
