let aldstat = require('../static/alad/ald-stat');
import Vue from 'vue'
import App from './App'
import Fly from 'flyio/dist/npm/wx'
import "../static/common.scss";
Vue.config.productionTip = false
App.mpType = 'app'
Vue.use({
  install: function (Vue) {
    Vue.prototype.$fly = new Fly();
    Vue.prototype.$fly.interceptors.response.use(function (response) {
      if (response.data.code == 200) {
        return response.data.data;
      } else {
        return Promise.reject(response);
      }
    }, function (error) {
      return Promise.reject(error)
    });
    

    /*Vue.prototype.$fly.interceptors.request.use((request)=>{
      //给所有请求添加自定义header
      let userInfo = wx.getStorageSync("loginInfo");
      request.headers["access_token"]=userInfo.token;
      request.body.token = userInfo.token;
      request.params.token = userInfo.token;
      return request;
    })*/
  }
});
const app = new Vue(App)
app.$mount()

