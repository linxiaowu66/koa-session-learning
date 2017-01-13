import fs from 'fs'
import path from 'path'
import url from 'url'
import koa from 'koa'
import koa_body from 'koa-body'
import validator from 'koa-validator'
import koa_logger from 'koa-logger2'
import favicon from 'koa-favicon'
import session from 'koa-generic-session'
import passport from 'koa-passport'
import Koa from 'koa'
import router from './route'
import config from './config'
import http from 'http'
import httpProxy from 'http-proxy'
import convert  from 'koa-convert'

const app = new Koa()
const port = 9999
const cwd = process.cwd();
// app.use(favicon(__dirname + '/../public/favicon.ico'));

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

//加载第三方中间件
app.use(convert(validator()));
app.use(koa_body({
  formidable:{uploadDir: cwd+'/upload'},
  multipart:true
}));

require('./common/passport')(passport);
// 初始化passport,这个必须初始化在router之前
app.use(passport.initialize());
app.use(passport.session());

app.use(router.routes()).use(router.allowedMethods());

var proxy = httpProxy.createProxyServer({});
var regexp=require('./common/regexp.js');
var isStatic=regexp.isStatic;
var isImage=regexp.isImage;
var isHotUpdate=regexp.isHotUpdate;
var responseRes=require('./common/responseStatic.js');

app.use(async (ctx, next) => {
  if (ctx.isAuthenticated()) {
    await next
  } else {
    ctx.redirect('/login');
  }
})

var server = http.createServer(function(req, res) {
  var url = req.url;

  if(url==='/'){
    url = 'index.html';
  }
  // 若是静态请求
  if(isStatic.test(url)||isImage.test(url)||isHotUpdate.test(url)){
    if(config.debug!==undefined){
      // 线下使用 代理线下解析服务
      proxy.web(req, res, { target: config.debug });
    }else{
      // 线上使用 读取静态文件
      responseRes(path.join(cwd,'dist',url),res).catch(function(err){
        res.end('找不到资源');
      });
    }
  }else{
    // 若是接口请求 用koa解析
    app.callback()(req, res);
    app.on('error', function(err){
      log.error('server error', err);
    });
  }
});
server.listen(port,()=>{
  console.log('服务在'+port+'端口上监听');
});
