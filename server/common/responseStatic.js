var fs=require('fs');
var path=require('path');
var mime = require('mime');
var isImage=require('./regexp.js').isImage;

module.exports= async (dist,res) => {
  var contentType = mime.lookup(dist);
  res.writeHeader(200,{'Content-Type':contentType});
  if(isImage.test(dist)){
    var imageBinary =await fs.readFile(dist,'binary');
    res.write(imageBinary,'binary');
    res.end();
  }else{
    res.end(await fs.readFile(dist,'utf-8'));
  }
}
