import * as auth from '../controller/auth'
import { ensureUser } from '../middleware/validators'

export const baseUrl = '/auth'

export default [
  {
    method: 'POST',
    route: '/',
    handlers: [
      auth.authUser
    ]
  },
  {
    method: 'POST',
    route: '/logout',
    handlers: [
      ensureUser,
      auth.authUser
    ]
  }
]

