var toastTimer=null;
export default {
  crumb:["global"],
  close:false,
  snackbar:false,
  message:'',
  username: '',
  avatar: '',
  showToast(message){
    if(toastTimer!==null){
      window.clearTimeout(toastTimer);
      toastTimer=null;
    }
    this.snackbar=true;
    this.message=message;
    toastTimer=window.setTimeout(()=>{
      this.snackbar=false;
      toastTimer=null;
    },4000);
  }
};
