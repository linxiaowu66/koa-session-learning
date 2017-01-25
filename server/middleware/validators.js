const User = require('../models/user')
const config = require('../../config/index.js')
const getToken = require('../helper/auth')
const verify = require('jsonwebtoken')

exports = module.exports = function ensureUser (req, res, next) {
  const token = getToken(req)

  if (!token) {
    res.status(401)
  }

  let decoded = null
  try {
    decoded = verify(token, config.token)
  } catch (err) {
    res.status(401)
  }

  User.findById(decoded.id).then (user => {
    if (!user) {
      res.status(401)
    } else {
      return next()
    }
  })
  .catch(err => {
    console.error('error....ensureUser')
  })
}
