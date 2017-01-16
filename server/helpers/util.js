var STATUS_OK=0;
var STATUS_ERR=1;
var STATUS_EMPTY=2;

module.exports={
  format(err,result){
    if(err){
      return JSON.stringify({
        status:STATUS_ERR,
        msg:err.toString()
      });
    }
    var resultType=typeof(result);
    if(resultType==='object'||resultType==='string'){
      return JSON.stringify({
        status:STATUS_OK,
        result
      });
    }else{
      return JSON.stringify({
        status:STATUS_ERR,
        msg:'result格式不正确'
      });
    }
  },
  isArray(arr){
    return Object.prototype.toString.call(arr)==='[object Array]';
  }
};
