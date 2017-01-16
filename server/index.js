import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import convert  from 'koa-convert'
import logger from 'koa-logger2'
import favicon from 'koa-favicon'
import session from 'koa-generic-session'
import passport from 'koa-passport'
import mount from 'koa-mount'
import serve from 'koa-static'
import mongoose from 'mongoose'
import url from 'url'
import path from 'path'

import { errorMiddleware } from './middleware'
import webpackDevMiddleware from './middleware/webpack-dev'
import router from './route'
import config from '../config'

const app = new Koa()

app.use(favicon(__dirname + '/../public/favicon.ico'))

mongoose.Promise = global.Promise
mongoose.connect(config.database)

if (process.env.NODE_ENV === 'development') {
  webpackDevMiddleware(app)
}

//记录日志
app.use(convert(logger('[day/month/year:time zone] "method url " status size duration ms').gen))
app.use(bodyParser())

//响应时间
app.use(async (ctx, next) => {
    var start = new Date()
    await next()
    var ms = new Date() - start
    ctx.set('X-Response-Time', ms + 'ms')
})

// application/json
app.use(async (ctx, next) => {
  var urlObj=url.parse(ctx.request.url)
  var pathObject=path.parse(urlObj.pathname)
  if(pathObject.ext==='.json'){
    ctx.set('Content-Type','application/json')
  }
  await next()
})

// 配置session的key
app.keys = config.keys
app.use(convert(session()))
app.use(errorMiddleware())

require('./helpers/passport')
// 初始化passport,这个必须初始化在router之前
app.use(passport.initialize())
app.use(passport.session())

router(app)

app.use(convert(mount('/dist', serve(`${process.cwd()}/dist`))))

app.listen(config.port,()=>{
  console.log('服务在'+config.port+'端口上监听')
})
