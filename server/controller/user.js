var User=require('../model').user;
module.exports={
  register(params){
    const user = new User(params);
    return user.save();
  }
}
