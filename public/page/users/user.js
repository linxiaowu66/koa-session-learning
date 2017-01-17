import Vue from 'vue';
import template from './user.html';
import config from '../../common/global/config.js';
// import reqwest from 'reqwest';
import './user.css';

var request = require('ajax-request')

export default Vue.extend({
  template,
  data: () => ({
    Items: []
  }),
  methods: {},
  created () {
    config.crumb = ['用户列表'];
    const self = this;
    // reqwest({
    //     url: '/users/nothing',
    //     method: 'delete'
    // })
    // .then(function (resp) {
    //   console.log('---====', resp)
    // })
    // .fail(function (err, msg) {
    //   console.log('error ', err)
    //   config.showToast(JSON.stringify(err));
    // })
    // .always(function (resp) {
    //   console.log('aaaaaaa---====', resp)
    // })
    request('/users/nothing', function (error, response, body) {
      console.log('---====', response)
      if (!error && response.statusCode == 200) {
        console.log(body) // Show the HTML for the Google homepage.
      }
    })
  }
})
