import Vue from 'vue';
import VueRouter from 'vue-router';
import MuseUI from 'muse-ui'
import 'muse-ui/dist/muse-ui.css'
import "./common/global/frame.css";
import "./common/global/reset.css";
import config from './common/global/config.js';
import reqwest from 'reqwest';

//加载所有的图片
var requireContext = require.context("./common/images", true, /^\.\/.*\.png$/);
var modules = requireContext.keys().map(requireContext);

// global register
Vue.use(MuseUI);
Vue.use(VueRouter);

// route配置
import Auth from './page/auth';
import User from './page/users'

const routes = [
  { path: '/auth/:action', component: Auth},
  { path: '/user', component: User}
];

const router = new VueRouter({routes});
new Vue({
  data:config,
  methods:{
    toggle(event){
      config.close=!config.close;
    },
    processLogin: function(event){
      this.username = event.username;
      this.avatar = requireContext(`./${event.avatar}`)
    },
    logout: function(){
      let request=reqwest({
        url: '/auth/logout',
        method: 'POST'
      });
      request.then(result => {
        this.username = '';
        this.avatar = '';
      }).catch(error => {
        config.showToast(JSON.stringify(error));
      })
    }
  },
  router
}).$mount('#app');
