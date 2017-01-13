var mongoose=require('mongoose');
var config=require('../config.js');

mongoose.connect(config.mongod);

module.exports=Object.assign(
  {},
  require('./user.js')
);
