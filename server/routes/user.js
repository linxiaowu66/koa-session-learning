const ensureUser = require('../middleware/validators')
const user = require('../controllers/user')

export const baseUrl = '/users'

exports = module.exports = [
  {
    method: 'POST',
    route: '/users/register',
    handlers: [
      user.createUser
    ]
  },
  {
    method: 'GET',
    route: '/users',
    handlers: [
      ensureUser
      user.getUsers
    ]
  },
  {
    method: 'delete',
    route: '/users/nothing',
    handlers: [
      user.getNothing
    ]
  }
]
