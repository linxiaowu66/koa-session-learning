const passport = require('passport')
const format = require('../helpers/util')

module.exports = {
  authUser (req, res) {
    passport.authenticate('local'), function(req, res) {
        res.redirect('/');
    }
    return passport.authenticate('local', (user) => {
      if (!user) {
        ctx.throw(401)
      }

      const token = user.generateToken()
      const response = user.toJSON()

      delete response.password

      ctx.body = format(null, {
        token,
        user: response
      })
    })(ctx, next)
  },
  authUser (req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if (err) { return next(err); }
      if (!user) { return res.redirect('/login'); }
      const token = user.generateToken()
      const response = user.toJSON()

      delete response.password



    })(req, res, next);
  }
  function logout (req, res) {

  }
}
