import passport from 'koa-passport'
import {format} from '../helpers/util'

export async function authUser (ctx, next) {
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
}

export async function logout (ctx, next) {
  ctx.logout();
  ctx.body=util.format(null,{success: true});
}
