import Vue from 'vue';
import template from './auth.html';
import config from '../../common/global/config.js';
import reqwest from 'reqwest';
import "./auth.css";

export default Vue.extend({
  template,
  data:() => ({
    action: '',
    actionName: '',
    username: '',
    password: ''
  }),
  methods:{
    loginSubmit: function(){
      let request=reqwest({
        url: '/auth',
        method: 'POST',
        data: {username: this.username,
               password: this.password}
      });
      request.then(result => {
        let resp = JSON.parse(result.response);

        if(!resp.status){
          config.showToast('恭喜你，登录成功');
          // 将token存储在sessionStorage中
          sessionStorage.setItem('myToken', resp.result.token);
          this.$emit('login', resp.result.user);
          this.$router.push('/user');
        }else{
          config.showToast(resp.msg);
        }
      }).catch(error => {
        config.showToast(JSON.stringify(error));
      })
    },
    registerSubmit: function(){

      let request=reqwest({
        url: '/users/register',
        method: 'POST',
        data: {username: this.username,
               password: this.password}
      });
      request.then(result => {
        let resp = JSON.parse(result);
        if (!resp.status){
          config.showToast('恭喜你，注册成功！');
          this.$router.push('/user/login');
        } else{
          config.showToast(resp.msg);
        }
      }).catch(error => {
        config.showToast(JSON.stringify(error));
      })
    }
  },
  created(){
    let action = this.$route.params.action === 'login' ? '用户登录' : '用户注册';
    config.crumb=[action];
    this.actionName = action;
    this.action = this.$route.params.action;
  },
  watch: {
    '$route' (to, from) {
      // 对路由变化作出响应...
      if (to.path !== from.path){
        let action = this.$route.params.action === 'login' ? '用户登录' : '用户注册';
        config.crumb=[action];
        this.actionName = action;
        this.action = this.$route.params.action;
      }
    }
  }
})

