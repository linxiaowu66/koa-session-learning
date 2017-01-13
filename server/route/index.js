var router = require('koa-router')();
var list = [
  require('./user.js')
];
var routers = list.reduceRight(($1,$2)=>{return $2.concat($1)},[]);

for(var i=0;i<routers.length;i++){
  var item=routers[i];
  router[item.method](item.path, item.handle);
}
module.exports=router;
