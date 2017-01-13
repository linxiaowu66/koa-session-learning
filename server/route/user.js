var user=require('../controller/user.js');
var util=require('../common/util.js');
var passport=require('koa-passport');
module.exports=[
  {
    method:'post',
    path:"/login",
    "handle": function*(next) {
      var ctx = this;
      try{
        yield passport.authenticate('local', function*(err, user, info){
          if (err) throw err
          if (user === false) {
            ctx.body=util.format(info.message, null);
          } else {
            yield ctx.login(user);
            ctx.body=util.format(null, {username: user.username, avatar: user.avatar});
          }
        }).call(this, next)
      }catch(e){
        ctx.body=util.format(e,null);
      }
    }
  },
  {
    method:'post',
    path:"/register",
    "handle":function *(next){
      let {username, password} = this.request.body;
      //动态生成一张图片索引
      let avatarIdx = Math.floor(Math.random() * 100 % 10);
      try{
        var result=yield user.register({username: username, password: password, avatar: `avatar${avatarIdx}.png`});
          this.body=util.format(null,result);
      }catch(e){
        if (e.code === 11000){
          this.body=util.format('该用户已经存在',null);
        } else {
          console.error(e);
          this.body=util.format('新建用户失败,请联系管理员',null);
        }
      }
    }
  },
  {
    method:'post',
    path:"/logout",
    "handle":function *(next){
      this.logout();
      this.body=util.format(null,{success: true});
    }
  }
];
