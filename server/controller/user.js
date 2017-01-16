import {format} from '../helpers/util'
import user from '../controller/user'


export async function createUser (ctx) {
  let {username, password} = ctx.request.body
  //动态生成一张图片索引
  let avatarIdx = Math.floor(Math.random() * 100 % 10)
  console.log('createUser-----------------')
  try {
    await User.create({username: username, password: password, avatar: `avatar${avatarIdx}.png`})
    const token = User.generateToken()

    ctx.body = format(null, {username: username, token: token});
  } catch (err) {
    if (e.code === 11000){
      ctx.body=format('该用户已经存在',null);
    } else {
      console.error(e);
      ctx.body=format('新建用户失败,请联系管理员',null);
    }
  }
}
export async function getUsers (ctx) {
  const users = await User.findAll()
  ctx.body = format(null, { users })
}
