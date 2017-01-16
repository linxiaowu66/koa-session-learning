import fs from 'fs'
import path from 'path'
import url from 'url'
import koa_body from 'koa-body'
import validator from 'koa-validator'
import koa_logger from 'koa-logger2'
import favicon from 'koa-favicon'
import session from 'koa-generic-session'
import passport from 'koa-passport'
import Koa from 'koa'
import convert  from 'koa-convert'
import mount from 'koa-mount'
import serve from 'koa-static'
import mongoose from 'mongoose'
import { errorMiddleware } from './middleware'
import webpackDevMiddleware from './middleware/webpack-dev'
import router from './route'
import config from '../config'

const app = new Koa()
const cwd = process.cwd();

app.use(favicon(__dirname + '/../public/favicon.ico'));

mongoose.Promise = global.Promise
mongoose.connect(config.database)

if (process.env.NODE_ENV === 'development') {
  webpackDevMiddleware(app)
}

//记录日志
app.use(convert(koa_logger('ip [day/month/year:time zone] "method url " status size duration ms').gen));

//响应时间
app.use(async (ctx, next) => {
    var start = new Date();
    await next;
    var ms = new Date() - start;
    ctx.set('X-Response-Time', ms + 'ms');
});

// application/json
app.use(async (ctx, next) => {
  var urlObj=url.parse(ctx.request.url);
  var pathObject=path.parse(urlObj.pathname);
  if(pathObject.ext==='.json'){
    ctx.set('Content-Type','application/json');
  }
  await next;
});

// 配置session的key
app.keys = config.keys;
app.use(convert(session()));
app.use(errorMiddleware())

//加载第三方中间件
app.use(convert(validator()));
app.use(koa_body({
  formidable:{uploadDir: cwd+'/upload'},
  multipart:true
}));

require('./helpers/passport')
// 初始化passport,这个必须初始化在router之前
app.use(passport.initialize());
app.use(passport.session());

router(app)

app.use(convert(mount('/dist', serve(`${process.cwd()}/dist`))))

app.listen(config.port,()=>{
  console.log('服务在'+config.port+'端口上监听');
});
