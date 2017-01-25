//json 格式化输出
module.exports=(json)=>{

  // { } [] 记录层数
  var stock=[];
  var result=[];
  var isInString=false;

  for(var i=0;i<json.length;i++){
    var char=json.charAt(i);

    if(char==='"'){
      result.push(char);
      isInString=!isInString;
    }else if(isInString){
      result.push(char);
      continue;
    }

    if(char==='{'||char==='['){
      stock.push(char);
      result.push(char);
      result.push('\n'+'\t'.repeat(stock.length));
    }else if(char==='}'||char===']'){
      stock.pop();
      result.push('\n'+'\t'.repeat(stock.length)+char);
    }else if(char===','){
      result.push(char);
      result.push('\n'+'\t'.repeat(stock.length));
    }else if(char!=='"'){
      result.push(char);
    }
  }
  return result.join('');
};
