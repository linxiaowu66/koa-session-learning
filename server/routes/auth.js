const ensureUser = require('../middleware/validators')
const auth = require('../controllers/auth')

exports = module.exports = [
  {
    method: 'POST',
    route: '/auth',
    handlers: [
      auth.authUser
    ]
  },
  {
    method: 'POST',
    route: '/auth/logout',
    handlers: [
      ensureUser,
      auth.authUser
    ]
  }
]

