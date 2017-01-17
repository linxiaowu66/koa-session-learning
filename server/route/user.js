import { ensureUser } from '../middleware/validators'
import * as user from '../controller/user'

export const baseUrl = '/users'

export default [
  {
    method: 'POST',
    route: '/register',
    handlers: [
      user.createUser
    ]
  },
  {
    method: 'GET',
    route: '/',
    handlers: [
      // ensureUser
      user.getUsers
    ]
  },
  {
    method: 'delete',
    route: '/nothing',
    handlers: [
      user.getNothing
    ]
  }
]
